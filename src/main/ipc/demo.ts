/**
 * ============================================================================
 * Electron 系统交互 Demo —— 主进程 IPC handlers（仅 /demo 页面演示使用）
 * ----------------------------------------------------------------------------
 * 架构：渲染进程通过 preload 注入的 window.electron.ipcRenderer.invoke(channel, ...args)
 *      调用这里的 handler；handler 执行系统级能力后把结果 Promise 回传。
 *
 * 与业务隔离：本文件只服务 Demo，registerDemoIpc() 在 createWindow() 之后调用，
 * safeHandle 会自动跳过 index.ts 已注册的通道（win-minimize 等），避免重复注册。
 *
 * 正式开发时，可按需把对应 handler 搬到业务模块；通道命名建议保持「模块-动作」风格。
 * ============================================================================
 */
import {
  app,
  ipcMain,
  BrowserWindow,
  dialog,
  shell,
  clipboard,
  screen,
  nativeTheme,
  Notification,
  powerMonitor,
  powerSaveBlocker,
  Tray,
  Menu,
  globalShortcut,
  desktopCapturer,
  nativeImage,
  systemPreferences,
  safeStorage,
  net,
  session,
  autoUpdater,
  crashReporter,
} from "electron";
import { promises as fs } from "fs";
// fs.watch（带事件回调的目录监听）只在同步 fs 上提供，fs.promises 版返回异步迭代器
import nodeFs from "fs";
import path from "path";
import type { IpcMainInvokeEvent, WebContents } from "electron";

/* ========================================================================== */
/* 公共工具                                                                    */
/* ========================================================================== */

/**
 * 安全注册：ipcMain.handle 同一通道重复注册会直接抛错
 * （Error: Attempted to register a second handler），这里先检查再注册。
 */
function safeHandle(channel: string, listener: (e: IpcMainInvokeEvent, ...args: any[]) => any): void {
  if (ipcMain.eventNames().includes(channel)) return;
  ipcMain.handle(channel, (e, ...args) => listener(e, ...args));
}

/** 取调用方所在窗口（从事件来源反查），找不到则取当前焦点窗口 */
function getWin(e: IpcMainInvokeEvent): BrowserWindow | null {
  return BrowserWindow.fromWebContents(e.sender) ?? BrowserWindow.getFocusedWindow();
}

/** 主进程 → 渲染进程主动推送（事件监听类 Demo 统一走 demo-push 通道） */
function push(wc: WebContents, source: string, data: unknown): void {
  if (!wc.isDestroyed()) wc.send("demo-push", { source, data });
}

/* ========================================================================== */
/* 长驻资源：托盘 / 休眠阻止 / 文件监听 / 剪贴板轮询                             */
/* ========================================================================== */

let tray: Tray | null = null;
let saveBlockerId: number | null = null;
let fsWatcher: import("fs").FSWatcher | null = null;
let clipboardTimer: NodeJS.Timeout | null = null;
/** macOS 系统通知订阅句柄表：事件名 -> subscriptionId（systemPreferences.subscribeNotification） */
const prefSubs = new Map<string, number>();
/** 最近一条演示通知的引用，供 notify-close 主动关闭 */
let lastNotification: Notification | null = null;
/** 事件监听开关表：source -> 取消函数（窗口/电源/主题/显示器等一次性注册的事件） */
const listeners = new Map<string, () => void>();

/** Demo 用固定文件路径，避免渲染层手动输入路径导致误删系统文件 */
const TEMP_DIR = app.getPath("temp");
const DEMO_FILE = path.join(TEMP_DIR, "fenghe-demo.txt");
const DEMO_COPY = path.join(TEMP_DIR, "fenghe-demo-copy.txt");
const DEMO_RENAME = path.join(TEMP_DIR, "fenghe-demo-renamed.txt");
/** 加密演示结果暂存（真实项目应存文件/数据库，不建议长期放内存） */
let encryptedCache = "";

/* ========================================================================== */
/* 注册入口                                                                    */
/* ========================================================================== */

export function registerDemoIpc(): void {
  /* ================= 一、窗口控制（BrowserWindow） =================
   * 使用场景：自定义无边框标题栏、视频播放全屏、置顶悬浮工具窗、
   *          新手引导固定窗口尺寸、防止误拖动、透明悬浮球等。
   * 注意：除特别说明外都作用于「发起调用的那个窗口」，多窗口安全。
   * ================================================================ */
  // safeHandle("win-minimize", (e) => getWin(e)?.minimize());
  safeHandle("win-restore", (e) => getWin(e)?.restore());
  // safeHandle("win-toggle-max", (e) => {
  //   const win = getWin(e);
  //   if (!win) return false;
  //   if (win.isMaximized()) win.unmaximize();
  //   else win.maximize();
  //   return win.isMaximized();
  // });
  // safeHandle("win-close", (e) => getWin(e)?.close());
  // 隐藏 ≠ 关闭：窗口从任务栏消失但进程保留，配合托盘可再唤起
  safeHandle("win-hide", (e) => getWin(e)?.hide());
  // 隐藏后的唤起入口：托盘 Demo 或这里都可显示
  safeHandle("win-show", (e) => {
    const win = getWin(e);
    win?.show();
    win?.focus();
  });
  // 闪烁任务栏/抢焦点场景：消息到达但用户在别的窗口时主动唤起
  safeHandle("win-focus", (e) => getWin(e)?.focus());
  // safeHandle("win-is-maximized", (e) => getWin(e)?.isMaximized());
  safeHandle("win-is-focused", (e) => getWin(e)?.isFocused());
  // 置顶：悬浮时钟、客服小窗；再次调用 false 取消
  safeHandle("win-set-always-on-top", (e, flag: boolean) => getWin(e)?.setAlwaysOnTop(!!flag));
  // F11 式全屏（macOS 是原生全屏，有独立空间过渡动画）
  safeHandle("win-set-full-screen", (e, flag: boolean) => getWin(e)?.setFullScreen(!!flag));
  // 简易全屏：macOS 专用，模拟 Windows 式最大化而非原生全屏；Win 上等同最大化
  safeHandle("win-set-simple-fullscreen", (e, flag: boolean) => getWin(e)?.setSimpleFullScreen(!!flag));
  // 透明度 0~1：做淡入淡出或半透明悬浮窗；Linux 不支持
  safeHandle("win-set-opacity", (e, opacity: number) => getWin(e)?.setOpacity(opacity));
  // 毛玻璃：macOS 走 vibrancy；Windows 11 走 setBackgroundMaterial('acrylic')（需 Electron 30+）
  // 使用前窗口需设 transparent 或由系统合成背景；传 'none' 关闭效果
  safeHandle("win-set-vibrancy", (e, type: string) => {
    const win = getWin(e);
    if (!win) return { supported: false };
    if (process.platform === "darwin") {
      win.setVibrancy(type === "none" ? null : (type as never));
      return { supported: true, effect: type, platform: "darwin" };
    }
    const anyWin = win as unknown as { setBackgroundMaterial?: (m: string) => void };
    if (typeof anyWin.setBackgroundMaterial === "function") {
      anyWin.setBackgroundMaterial(type === "none" ? "none" : "acrylic");
      return { supported: true, material: "acrylic", platform: process.platform };
    }
    return {
      supported: false,
      platform: process.platform,
      note: "Windows 亚克力效果需 Electron 30+ 与 Win11 22H2+，当前运行时不支持",
    };
  });
  safeHandle("win-set-size", (e, { width, height }: { width: number; height: number }) =>
    getWin(e)?.setSize(width, height),
  );
  safeHandle("win-set-position", (e, { x, y }: { x: number; y: number }) => getWin(e)?.setPosition(x, y));
  // 一次设置位置+尺寸，等价于 setPosition + setSize 原子操作
  safeHandle("win-set-bounds", (e, bounds: { x: number; y: number; width: number; height: number }) =>
    getWin(e)?.setBounds(bounds),
  );
  safeHandle("win-set-min-size", (e, { width, height }: { width: number; height: number }) =>
    getWin(e)?.setMinimumSize(width, height),
  );
  safeHandle("win-set-max-size", (e, { width, height }: { width: number; height: number }) =>
    getWin(e)?.setMaximumSize(width, height),
  );
  safeHandle("win-set-resizable", (e, flag: boolean) => getWin(e)?.setResizable(!!flag));
  // 禁止拖动：弹窗模态展示期间防止用户把窗口拖走
  safeHandle("win-set-movable", (e, flag: boolean) => getWin(e)?.setMovable(!!flag));
  safeHandle("win-set-title", (e, title: string) => getWin(e)?.setTitle(title));
  // 不在任务栏显示：托盘常驻工具、启动闪屏、辅助小窗
  safeHandle("win-set-skip-taskbar", (e, flag: boolean) => getWin(e)?.setSkipTaskbar(!!flag));
  // 鼠标穿透：桌面宠物/悬浮字幕层，点击直接落到下层应用；forward:true 时仍可收到 mousemove
  safeHandle("win-set-ignore-mouse-events", (e, flag: boolean) =>
    getWin(e)?.setIgnoreMouseEvents(!!flag, { forward: true }),
  );

  /* ================= 二、对话框（dialog） =================
   * 使用场景：导入/导出文件选择、另存为、危险操作二次确认、错误详情展示。
   * 对话框是模态的，会阻塞同一窗口的其它交互。
   * ====================================================== */
  safeHandle("dialog-open-file", () => dialog.showOpenDialog({ properties: ["openFile"] }));
  safeHandle("dialog-open-dir", () => dialog.showOpenDialog({ properties: ["openDirectory"] }));
  safeHandle("dialog-open-multi", () => dialog.showOpenDialog({ properties: ["openFile", "multiSelections"] }));
  safeHandle("dialog-save-file", (_e, opts) => dialog.showSaveDialog(opts ?? {}));
  safeHandle("dialog-show-message", (_e, opts) => dialog.showMessageBox(opts ?? { type: "info", message: "" }));
  // 错误框无返回值、无按钮分支，适合展示崩溃/异常详情
  safeHandle("dialog-show-error", (_e, opts: { title?: string; content?: string }) =>
    dialog.showErrorBox(opts?.title ?? "错误", opts?.content ?? ""),
  );

  /* ============ 三、系统路径 + 文件系统（app.getPath / fs / shell） ============
   * 使用场景：配置文件持久化（userData）、导出报表到下载/桌面、
   *          日志写入 logs、软删除到回收站、监听配置目录热更新。
   * 注意：渲染进程无权直接访问 Node fs，必须经 IPC，路径也应以系统目录为准。
   * ====================================================================== */
  safeHandle("path-get-app-data", () => app.getPath("appData"));
  safeHandle("path-get-temp", () => app.getPath("temp"));
  safeHandle("path-get-desktop", () => app.getPath("desktop"));
  safeHandle("path-get-documents", () => app.getPath("documents"));
  safeHandle("path-get-downloads", () => app.getPath("downloads"));
  safeHandle("path-get-home", () => app.getPath("home"));
  safeHandle("path-get-exe", () => app.getPath("exe"));
  safeHandle("path-get-logs", () => app.getPath("logs"));
  safeHandle("path-get-userData", () => app.getPath("userData"));

  safeHandle("fs-read-dir", async (_e, dirPath: string) => fs.readdir(dirPath));
  safeHandle("fs-stat", async (_e, filePath: string) => {
    const stat = await fs.stat(filePath);
    return {
      size: stat.size,
      created: stat.birthtime,
      modified: stat.mtime,
      isFile: stat.isFile(),
      isDirectory: stat.isDirectory(),
    };
  });

  // —— 以下用固定的临时文件演示增删改查，避免误操作系统文件 ——
  safeHandle("fs-write-file", async () => {
    await fs.writeFile(DEMO_FILE, `风禾千寻演示文件\n写入时间：${new Date().toLocaleString()}\n`, "utf-8");
    return DEMO_FILE;
  });
  safeHandle("fs-read-file", async () => {
    const content = await fs.readFile(DEMO_FILE, "utf-8");
    return { path: DEMO_FILE, content };
  });
  safeHandle("fs-copy", async () => {
    await fs.copyFile(DEMO_FILE, DEMO_COPY);
    return DEMO_COPY;
  });
  safeHandle("fs-rename", async () => {
    await fs.rename(DEMO_COPY, DEMO_RENAME);
    return DEMO_RENAME;
  });
  safeHandle("fs-delete", async () => {
    // unlink 只删文件；目录删除用 fs.rm(path, { recursive: true })
    await fs.unlink(DEMO_RENAME).catch(() => fs.unlink(DEMO_COPY));
    return "已删除";
  });
  // 软删除：进回收站/废纸篓，用户可还原，比直接 unlink 安全
  safeHandle("fs-move-to-trash", async () => {
    await shell.trashItem(DEMO_FILE);
    return "已移入回收站：" + DEMO_FILE;
  });
  // 目录监听统一走 demo-listen('fs', 目录路径)，见底部「事件推送」区

  /* ================= 四、系统信息与外观（process / os / screen / nativeTheme） =================
   * 使用场景：崩溃报告附带环境、按 DPI 适配界面、跟随系统深浅色、多显示器投放。
   * ===================================================================================== */
  safeHandle("sys-get-platform", () => process.platform); // win32 / darwin / linux
  safeHandle("sys-get-arch", () => process.arch); // x64 / arm64
  safeHandle("sys-get-os-version", () => process.getSystemVersion());
  safeHandle("sys-get-locale", () => app.getLocale());
  safeHandle("sys-get-theme", () => (nativeTheme.shouldUseDarkColors ? "dark" : "light"));
  // 强制应用主题：system 跟随系统，light/dark 覆盖；可与页面 html.dark 类联动
  safeHandle("sys-set-theme", (_e, theme: "system" | "light" | "dark") => {
    nativeTheme.themeSource = theme;
    return nativeTheme.themeSource;
  });
  // 系统强调色：取 Win10/11 个性化颜色（RRGGBB），用于主题取色
  safeHandle("sys-get-accent-color", () => {
    try {
      return {
        accent: systemPreferences.getAccentColor?.(),
        highContrast:
          typeof (systemPreferences as any).isHighContrastColorScheme === "function"
            ? (systemPreferences as any).isHighContrastColorScheme()
            : false,
      };
    } catch {
      return { supported: false, platform: process.platform };
    }
  });
  safeHandle("sys-get-hardware-memory", () => {
    const info = process.getSystemMemoryInfo();
    return { totalBytes: info.total * 1024, freeBytes: info.free * 1024 };
  });
  // Electron 无内置 machineId（注册表 MachineGuid 需第三方库），demo 用计算机名代替
  safeHandle("sys-get-machine-id", () => process.env.COMPUTERNAME || process.env.HOSTNAME || "unknown");

  safeHandle("screen-get-all", () => screen.getAllDisplays());
  safeHandle("screen-get-primary", () => screen.getPrimaryDisplay());
  safeHandle("screen-get-cursor-point", () => screen.getCursorScreenPoint());

  /* ============== 四（补充）、系统偏好与权限（systemPreferences） ==============
   * 使用场景：音视频通话前查询/申请摄像头、麦克风权限；
   *          录屏前检查 macOS「屏幕录制」授权（未授权会拿到黑屏）；
   *          高对比度模式做无障碍适配。
   * 平台差异：查询类 API Windows 10+ 部分支持；申请授权类为 macOS 专属，
   *          Windows 上应用在安装/首次调用时由系统弹窗，无对应 JS API。
   * ====================================================================== */
  // 查询媒体权限状态：返回 granted / denied / not-determined / restricted 等
  safeHandle("pref-get-media-access-status", (_e, mediaType: "camera" | "microphone" | "screen") => {
    try {
      return { mediaType, status: systemPreferences.getMediaAccessStatus(mediaType), platform: process.platform };
    } catch (err) {
      return { supported: false, error: (err as Error).message };
    }
  });
  // 主动申请摄像头/麦克风授权（仅 macOS 会弹系统授权框；Windows 返回不支持）
  safeHandle("pref-ask-media-access", async (_e, mediaType: "camera" | "microphone") => {
    if (process.platform !== "darwin") return { supported: false, platform: process.platform };
    return { supported: true, mediaType, granted: await systemPreferences.askForMediaAccess(mediaType) };
  });
  // 屏幕录制权限：macOS 录屏/截屏前必查；Windows、Linux 无需授权直接视为 granted
  safeHandle("pref-get-screen-access-status", () => {
    if (process.platform !== "darwin") {
      return { supported: true, status: "granted", note: "Windows/Linux 录屏无需系统授权" };
    }
    return { supported: true, status: systemPreferences.getMediaAccessStatus("screen") };
  });
  // 是否高对比度配色方案：无障碍场景下调高界面对比（Electron 14+ 统一走 nativeTheme）
  safeHandle("pref-is-high-contrast", () => nativeTheme.shouldUseHighContrastColors);
  // 取 macOS 系统语义色（如 window-background / control-accent），Windows 不支持
  safeHandle("pref-get-system-color", (_e, color: string) => {
    if (process.platform !== "darwin") return { supported: false, platform: process.platform };
    try {
      return { supported: true, color, hex: systemPreferences.getSystemColor(color as never) };
    } catch (err) {
      return { supported: false, error: (err as Error).message };
    }
  });
  // 打开系统隐私设置页：macOS 用 x-apple.systempreferences 协议，Windows 用 ms-settings
  safeHandle("pref-open-settings", (_e, pane: string) => {
    const macMap: Record<string, string> = {
      camera: "x-apple.systempreferences:com.apple.preference.security?Privacy_Camera",
      microphone: "x-apple.systempreferences:com.apple.preference.security?Privacy_Microphone",
      "screen-capture": "x-apple.systempreferences:com.apple.preference.security?Privacy_ScreenCapture",
    };
    const winMap: Record<string, string> = {
      camera: "ms-settings:privacy-webcam",
      microphone: "ms-settings:privacy-microphone",
      "screen-capture": "ms-settings:display",
    };
    const target = process.platform === "darwin" ? macMap[pane] : winMap[pane];
    if (!target) return { supported: false, pane };
    return shell.openExternal(target);
  });
  // 订阅 macOS 系统通知（如强调色变化 accentColorChanged），回调走 demo-push 的 pref 源
  safeHandle("pref-subscribe-notification", (e, eventName: string) => {
    if (process.platform !== "darwin") return { supported: false, platform: process.platform };
    if (prefSubs.has(eventName)) return { supported: true, eventName, reused: true };
    const id = systemPreferences.subscribeNotification(eventName, (_event, userInfo) => {
      push(e.sender, "pref", { eventName, userInfo: userInfo ?? null });
    });
    prefSubs.set(eventName, id);
    return { supported: true, eventName, id };
  });
  // 取消某个系统通知订阅
  safeHandle("pref-unsubscribe-notification", (_e, eventName: string) => {
    const id = prefSubs.get(eventName);
    if (id === undefined) return { subscribed: false };
    systemPreferences.unsubscribeNotification(id);
    prefSubs.delete(eventName);
    return { subscribed: false, eventName };
  });

  /* ================= 五、Shell 与剪贴板 =================
   * 使用场景：外链跳默认浏览器、下载后"在文件夹中显示"、
   *          一键复制订单号/报错信息、富文本粘贴板。
   * ================================================== */
  safeHandle("shell-open-external", (_e, url: string) => shell.openExternal(url));
  safeHandle("shell-open-path", (_e, p: string) => shell.openPath(p));
  safeHandle("shell-show-in-folder", (_e, p: string) => shell.showItemInFolder(p));
  safeHandle("shell-beep", () => shell.beep());

  safeHandle("clipboard-read-text", () => clipboard.readText());
  safeHandle("clipboard-write-text", (_e, text: string) => clipboard.writeText(text));
  safeHandle("clipboard-read-html", () => clipboard.readHTML());
  // 写入富文本；第二个参数（type）仅 Linux 需要，Windows/macOS 省略即可
  safeHandle("clipboard-write-html", (_e, html: string) => clipboard.writeHTML(html));
  // 返回图片 dataURL，空剪贴板时为空字符串
  safeHandle("clipboard-read-image", () => clipboard.readImage().toDataURL());
  safeHandle("clipboard-clear", () => clipboard.clear());

  /* ================= 六、系统通知（Notification） =================
   * 使用场景：下载完成、消息提醒、后台任务结束。
   * Windows 打包后必须先设置 AppUserModelId 才会走系统通知中心，
   * 否则退化为旧版气泡提示。
   * ============================================================ */
  safeHandle("notify-is-supported", () => Notification.isSupported());
  safeHandle("notify-send", (_e, { title, body }: { title: string; body: string }) => {
    if (!Notification.isSupported()) return false;
    // 保留引用才能随后主动 close；通知被用户/系统关闭后置空
    lastNotification = new Notification({ title, body });
    lastNotification.on("close", () => (lastNotification = null));
    lastNotification.show();
    return true;
  });
  // 主动关闭刚发出的演示通知（提醒撤销/过期通知清理；macOS 系统限制较多）
  safeHandle("notify-close", () => {
    if (!lastNotification) return { closed: false, reason: "没有可关闭的通知" };
    lastNotification.close();
    lastNotification = null;
    return { closed: true };
  });
  // Windows 通知操作按钮能力有限（需走 WinRT 协议激活），demo 降级为普通通知
  safeHandle("notify-send-action", (_e, { title, body }: { title: string; body: string }) => {
    if (!Notification.isSupported()) return false;
    new Notification({ title, body }).show();
    return true;
  });

  /* ================= 七、电源（powerMonitor / powerSaveBlocker） =================
   * 使用场景：下载/渲染长任务时阻止系统休眠、笔记本省电策略提示、
   *          锁屏后暂停视频、唤醒后自动同步数据。
   * ========================================================================== */
  safeHandle("power-get-state", () => ({
    idleState: powerMonitor.getSystemIdleState(60), // active | idle | locked | unknown
    idleTime: powerMonitor.getSystemIdleTime(), // 已空闲秒数
    onBattery: powerMonitor.isOnBatteryPower(),
  }));
  safeHandle("power-is-on-battery", () => powerMonitor.isOnBatteryPower());
  safeHandle("power-block-sleep", (_e, type: string) => {
    // prevent-display-sleep：连显示器也保持常亮；prevent-app-suspension：只防系统睡眠
    if (type === "prevent-display-sleep" && saveBlockerId !== null) {
      powerSaveBlocker.stop(saveBlockerId);
      saveBlockerId = null;
      return { blocking: false };
    }
    if (saveBlockerId === null) saveBlockerId = powerSaveBlocker.start("prevent-display-sleep");
    return { blocking: true, id: saveBlockerId };
  });

  /* ================= 八、菜单 / 托盘 / 全局快捷键 =================
   * 使用场景：托盘常驻后台（IM、下载器）、右键快捷操作、
   *          老板键/截图键/唤起窗口等任何应用失焦时仍生效的快捷键。
   * 注意：托盘图标 macOS 必须用模板图（xxxTemplate.png）；
   *      全局快捷键退出应用时务必 unregisterAll。
   * ============================================================= */
  safeHandle("menu-popup-context", (e) => {
    const menu = Menu.buildFromTemplate([
      {
        label: "演示菜单项（点击会发通知）",
        click: () => new Notification({ title: "风禾千寻", body: "你点了上下文菜单" }).show(),
      },
      { type: "separator" },
      { role: "reload", label: "重新加载" },
      { role: "quit", label: "退出" },
    ]);
    const win = getWin(e);
    menu.popup(win ? { window: win } : undefined);
  });
  // 构建应用主菜单栏（带标准角色，自动补齐复制粘贴/窗口等）
  safeHandle("menu-build-application", () => {
    const menu = Menu.buildFromTemplate([
      {
        label: "文件",
        submenu: [{ role: "quit", label: "退出" }],
      },
      {
        label: "编辑",
        submenu: [
          { role: "undo", label: "撤销" },
          { role: "redo", label: "重做" },
          { type: "separator" },
          { role: "cut", label: "剪切" },
          { role: "copy", label: "复制" },
          { role: "paste", label: "粘贴" },
          { role: "selectAll", label: "全选" },
        ],
      },
      { label: "视图", submenu: [{ role: "togglefullscreen", label: "全屏" }, { role: "reload" }] },
    ]);
    Menu.setApplicationMenu(menu);
    return "应用菜单栏已构建";
  });
  safeHandle("tray-create", (e) => {
    if (tray) return { created: false, reason: "托盘已存在" };
    // 优先用打包后的 resources 图标；找不到用空图占位（Windows 仍可演示交互）
    const iconFile = app.isPackaged
      ? path.join(process.resourcesPath, "resources", "icon.png")
      : path.join(app.getAppPath(), "resources", "icon.png");
    const image = nativeImage.createFromPath(iconFile);
    tray = new Tray(image.isEmpty() ? nativeImage.createEmpty() : image.resize({ width: 16, height: 16 }));
    tray.setToolTip("风禾千寻 Demo 托盘");
    tray.setContextMenu(
      Menu.buildFromTemplate([
        {
          label: "显示主窗口",
          click: () => {
            const win = getWin(e) ?? BrowserWindow.getAllWindows()[0];
            win?.show();
            win?.focus();
          },
        },
        { label: "托盘通知", click: () => new Notification({ title: "风禾千寻", body: "来自托盘" }).show() },
        { type: "separator" },
        { role: "quit", label: "退出" },
      ]),
    );
    // Windows 左键单击=显示窗口；macOS 习惯左键弹菜单（系统差异）
    tray.on("click", () => {
      const win = getWin(e) ?? BrowserWindow.getAllWindows()[0];
      win?.show();
      win?.focus();
    });
    return { created: true };
  });
  safeHandle("tray-destroy", () => {
    tray?.destroy();
    tray = null;
    return { created: false };
  });
  safeHandle("tray-set-tooltip", (_e, tip: string) => {
    tray?.setToolTip(tip);
    return !!tray;
  });
  // 注册全局快捷键：应用失焦也能响应；accelerator 跨平台写 CommandOrControl
  safeHandle("shortcut-register", (e, accelerator = "CommandOrControl+Shift+S") => {
    const ok = globalShortcut.register(accelerator, () => {
      new Notification({ title: "风禾千寻", body: `全局快捷键 ${accelerator} 被按下` }).show();
      push(e.sender, "shortcut", accelerator);
    });
    return { accelerator, registered: ok };
  });
  safeHandle("shortcut-unregister", (_e, accelerator: string) => globalShortcut.unregister(accelerator));
  safeHandle("shortcut-unregister-all", () => {
    globalShortcut.unregisterAll();
    return "已注销全部全局快捷键";
  });
  // 应用退出时兜底注销，避免快捷键被系统永久占用
  app.on("will-quit", () => globalShortcut.unregisterAll());

  /* ================= 九、Windows 专属功能 🪟 =================
   * 全部依赖任务栏/注册表能力，macOS 调用无效。
   * 使用场景：下载进度上任务栏、未读角标、消息闪烁提醒、
   *          右键任务栏跳转列表、开机自启动。
   * ===================================================== */
  safeHandle("win-set-progress-bar", (e, value: number) => getWin(e)?.setProgressBar(value));
  safeHandle("win-flash-frame", (e, flag: boolean) => getWin(e)?.flashFrame(!!flag));
  // 任务栏图标叠加角标（未读数），nativeImage 建议 16x16；传 null 清除
  safeHandle("win-set-overlay-icon", (e, flag: boolean) => {
    const win = getWin(e);
    if (!win) return;
    if (!flag) return win.setOverlayIcon(null, "");
    // 用应用图标缩放出角标演示
    const iconFile = app.isPackaged
      ? path.join(process.resourcesPath, "resources", "icon.png")
      : path.join(app.getAppPath(), "resources", "icon.png");
    const img = nativeImage.createFromPath(iconFile).resize({ width: 16, height: 16 });
    win.setOverlayIcon(img.isEmpty() ? nativeImage.createEmpty() : img, "未读 3");
  });
  safeHandle("win-set-app-user-model-id", (_e, id: string) => app.setAppUserModelId(id));
  // 开机自启：写注册表 Run 键；可带 args 实现自启后直达指定页面
  safeHandle("win-set-login-item", (_e, settings: { openAtLogin: boolean }) => {
    app.setLoginItemSettings({ openAtLogin: !!settings.openAtLogin, args: ["--autostart"] });
    return app.getLoginItemSettings();
  });
  safeHandle("win-get-login-item", () => app.getLoginItemSettings());
  // 任务栏右键 Jump List：自定义常用任务入口
  safeHandle("win-set-jump-list", () => {
    app.setJumpList([
      {
        type: "custom",
        name: "风禾千寻快捷入口",
        items: [
          {
            type: "task",
            title: "打开系统交互 Demo",
            program: process.execPath,
            args: "",
            description: "启动后定位到 /demo",
          },
        ],
      },
    ]);
    return "Jump List 已设置，右键任务栏图标查看";
  });
  // 最近文档：会出现在任务栏跳转列表/资源管理器最近使用中
  safeHandle("win-recent-docs-add", () => {
    app.addRecentDocument(DEMO_FILE);
    return "已添加最近文档";
  });
  safeHandle("win-recent-docs-clear", () => {
    app.clearRecentDocuments();
    return "已清空最近文档";
  });

  /* ================= 十、网络与会话（net / session） + 下载 =================
   * 使用场景：走系统代理的原生请求、读登录态 Cookie、清缓存、
   *          应用内下载并显示进度条。
   * =================================================================== */
  safeHandle("online-get-status", () => ({ online: true, platform: process.platform }));
  safeHandle("session-get-cookies", (e) => e.sender.session.cookies.get({}));
  safeHandle("session-clear-cache", (e) => e.sender.session.clearCache());
  safeHandle("session-get-user-agent", (e) => e.sender.session.getUserAgent());
  // 原生 net.request：自动跟随系统代理，可带 Session 隔离 Cookie
  safeHandle("net-request", (_e, url: string) => {
    return new Promise((resolve) => {
      const req = net.request(url);
      let body = "";
      req.on("response", (res) => {
        res.on("data", (chunk) => (body += chunk.toString("utf8")));
        res.on("end", () => resolve({ statusCode: res.statusCode, body: body.slice(0, 2000) }));
      });
      req.on("error", (err) => resolve({ error: err.message }));
      req.end();
    });
  });
  // 下载到系统下载目录；进度通过 demo-push(source:'download') 实时推送
  safeHandle("download-start", (e, url: string) => {
    e.sender.session.downloadURL(url);
    return { started: true, url };
  });
  // 统一监听默认会话的下载事件，向所有窗口推送进度（百分比 + 状态）
  session.defaultSession.on("will-download", (_event, item) => {
    BrowserWindow.getAllWindows().forEach((w) =>
      push(w.webContents, "download", {
        filename: item.getFilename(),
        totalBytes: item.getTotalBytes(),
        state: "started",
        savePath: item.getSavePath(),
      }),
    );
    item.on("updated", (_ev, state) => {
      BrowserWindow.getAllWindows().forEach((w) =>
        push(w.webContents, "download", {
          filename: item.getFilename(),
          receivedBytes: item.getReceivedBytes(),
          totalBytes: item.getTotalBytes(),
          percent: item.getTotalBytes() ? Math.round((item.getReceivedBytes() / item.getTotalBytes()) * 100) : 0,
          state, // progressing | interrupted
        }),
      );
    });
    item.once("done", (_ev, state) => {
      BrowserWindow.getAllWindows().forEach((w) =>
        push(w.webContents, "download", {
          filename: item.getFilename(),
          state, // completed | cancelled | interrupted
          savePath: item.getSavePath(),
        }),
      );
    });
  });

  /* ================= 十一、媒体与截屏（desktopCapturer / capturePage） =================
   * 使用场景：屏幕共享、截图工具、录屏前的源选择。
   * 注意：macOS 10.15+ 必须先获得「屏幕录制」授权，否则拿到黑屏；
   *      Windows 无额外权限要求。
   * ============================================================================== */
  // 枚举所有可捕获的屏幕和窗口（含缩略图 dataURL）
  safeHandle("capture-get-sources", async () => {
    const sources = await desktopCapturer.getSources({
      types: ["screen", "window"],
      thumbnailSize: { width: 300, height: 170 },
    });
    return sources.map((s) => ({
      id: s.id,
      name: s.name,
      type: s.id.startsWith("screen") ? "screen" : "window",
      thumbnail: s.thumbnail.toDataURL(),
    }));
  });
  // 截取当前应用窗口画面，返回 PNG dataURL
  safeHandle("capture-screenshot", async (e) => {
    const image = await getWin(e)?.webContents.capturePage();
    return image?.toDataURL() ?? "";
  });

  /* ================= 十二、应用信息 / 重启 / 安全存储（safeStorage） =================
   * 使用场景：版本检测、升级后重启、本地加密保存 token/密码等敏感信息。
   * safeStorage：Windows 走 DPAPI、macOS 走 Keychain、Linux 走 libsecret，
   *             加密结果与当前用户绑定，不能跨机器复制使用。
   * ========================================================================== */
  safeHandle("app-get-version", () => app.getVersion());
  safeHandle("app-get-name", () => app.getName());
  // relaunch 后必须 exit 才真正重启（renderer 调用前建议先弹确认框）
  safeHandle("app-relaunch", () => {
    app.relaunch();
    app.exit(0);
  });
  safeHandle("safe-storage-available", () => safeStorage.isEncryptionAvailable());
  safeHandle("safe-storage-encrypt", (_e, text: string) => {
    if (!safeStorage.isEncryptionAvailable()) return { supported: false };
    encryptedCache = safeStorage.encryptString(text).toString("base64");
    return { supported: true, encrypted: encryptedCache };
  });
  safeHandle("safe-storage-decrypt", () => {
    if (!safeStorage.isEncryptionAvailable() || !encryptedCache) return { supported: false, plain: "" };
    return { supported: true, plain: safeStorage.decryptString(Buffer.from(encryptedCache, "base64")) };
  });

  /* ================= 崩溃报告（crashReporter） =================
   * 使用场景：接入 Sentry/Bugly 等崩溃收集，进程崩溃时上报 minidump。
   * demo 只本地初始化、不上传服务器（uploadToServer:false），避免对外发请求。
   * 平台差异：Windows 生成 .dmp 放 userData/Crashpad；macOS 走系统崩溃机制。
   * ========================================================== */
  let crashStarted = false;
  safeHandle("crash-reporter-start", () => {
    if (crashStarted) return { started: true, reused: true, last: crashReporter.getLastCrashReport() };
    crashReporter.start({
      productName: app.getName(),
      companyName: "Fenghe",
      submitURL: "", // 真实使用填崩溃收集服务地址
      uploadToServer: false,
      compress: true,
      ignoreSystemCrashHandler: false,
    });
    crashStarted = true;
    return {
      started: true,
      lastCrashReport: crashReporter.getLastCrashReport(),
      uploadedCount: crashReporter.getUploadedReports().length,
      crashesDir: path.join(app.getPath("userData"), "Crashpad"),
    };
  });

  /* ================= 十二（补充）、自动更新（内置 autoUpdater / Squirrel） =================
   * 使用场景：启动后静默检查更新、发现新版本、下载、下载完成后提示重启安装。
   * 重要前提：
   *  1. 内置 autoUpdater 需要 Squirrel 服务端（Windows: RELEASES + nupkg；mac: zip feed），
   *     且 mac 应用必须签名；生产项目更常用 electron-updater（支持 generic/github 源与进度）。
   *  2. 未调用 setFeedURL 就 checkForUpdates 会同步抛错，Demo 里正好用它演示 error 事件分支。
   * 生命周期事件（checking / available / downloaded / error / progress）统一通过
   *          demo-push 的 update 源实时推送到所有窗口。
   * ===================================================================================== */
  safeHandle("update-get-version", () => app.getVersion());
  // 配置更新源地址（真实项目按灰度通道 beta/latest 传不同 URL）
  safeHandle("update-set-feed-url", (_e, url: string) => {
    autoUpdater.setFeedURL({ url });
    return { ok: true, url };
  });
  // 手动检查更新；没有可用更新源时返回错误信息（不弹窗）
  safeHandle("update-check", () => {
    try {
      autoUpdater.checkForUpdates();
      return { started: true };
    } catch (err) {
      return { started: false, error: (err as Error).message };
    }
  });
  // 下载完成后调用：退出应用并运行安装包（未下载完成时调用无效）
  safeHandle("update-install", () => {
    autoUpdater.quitAndInstall();
    return "已调用 quitAndInstall";
  });
  // 一次性绑定 autoUpdater 全部事件，向所有窗口推送更新状态
  const updateEvents = [
    "checking-for-update",
    "update-available",
    "update-not-available",
    "download-progress",
    "update-downloaded",
    "error",
  ] as const;
  updateEvents.forEach((evt) =>
    (autoUpdater as any).on(evt, (info: unknown) => {
      BrowserWindow.getAllWindows().forEach((w) => push(w.webContents, "update", { event: evt, info: info ?? null }));
    }),
  );

  /* ================= 十三、macOS 专属能力 🍎（Windows 上返回不支持） =================
   * 当前开发环境为 Windows，这里保留调用入口与平台守卫，
   * 方便以后打包 mac 版本时直接在同一套 Demo 验证。
   * =========================================================================== */
  safeHandle("mac-dock-set-badge", (_e, text: string) => {
    if (process.platform !== "darwin") return { supported: false, platform: process.platform };
    (app as any).dock?.setBadge(text);
    return { supported: true, badge: text };
  });
  safeHandle("mac-dock-bounce", () => {
    if (process.platform !== "darwin") return { supported: false, platform: process.platform };
    return { supported: true, id: (app as any).dock?.bounce("informational") };
  });

  /* ================= 十四、主进程 → 渲染进程 事件推送开关 =================
   * 渲染层 invoke('demo-listen', source) 开启；invoke('demo-unlisten', source) 关闭。
   * 所有推送统一通过 demo-push 通道，payload 为 { source, data }。
   * =================================================================== */
  safeHandle("demo-listen", (e, source: string, arg?: string) => {
    const win = getWin(e);
    if (!win) return false;
    demoUnlisten(source); // 先清掉旧的，防止重复订阅

    switch (source) {
      case "window": {
        const send = (type: string, data?: unknown) => push(e.sender, "window", { type, ...(data as object) });
        const onResize = () => send("resized", { bounds: win.getBounds() });
        const onMove = () => send("moved", { bounds: win.getBounds() });
        const onFocus = () => send("focus");
        const onBlur = () => send("blur");
        const onEnterFs = () => send("enter-fullscreen");
        const onLeaveFs = () => send("leave-fullscreen");
        win.on("resize", onResize);
        win.on("move", onMove);
        win.on("focus", onFocus);
        win.on("blur", onBlur);
        win.on("enter-full-screen", onEnterFs);
        win.on("leave-full-screen", onLeaveFs);
        listeners.set("window", () => {
          win.off("resize", onResize);
          win.off("move", onMove);
          win.off("focus", onFocus);
          win.off("blur", onBlur);
          win.off("enter-full-screen", onEnterFs);
          win.off("leave-full-screen", onLeaveFs);
        });
        break;
      }
      case "power": {
        const events = ["suspend", "resume", "lock-screen", "unlock-screen", "shutdown"] as const;
        const handlers = events.map((evt) => {
          const fn = () => push(e.sender, "power", { event: evt });
          // evt 为字面量联合，TS 重载无法自动收窄，这里事件名是内置白名单，as any 安全
          (powerMonitor as any).on(evt, fn);
          return { evt, fn };
        });
        listeners.set("power", () => handlers.forEach(({ evt, fn }) => (powerMonitor as any).off(evt, fn)));
        break;
      }
      case "theme": {
        const fn = () =>
          push(e.sender, "theme", { dark: nativeTheme.shouldUseDarkColors, source: nativeTheme.themeSource });
        nativeTheme.on("updated", fn);
        listeners.set("theme", () => nativeTheme.off("updated", fn));
        break;
      }
      case "display": {
        const onAdded = (_ev: unknown, display: Electron.Display) =>
          push(e.sender, "display", { event: "added", id: display.id });
        const onRemoved = (_ev: unknown, display: Electron.Display) =>
          push(e.sender, "display", { event: "removed", id: display.id });
        screen.on("display-added", onAdded);
        screen.on("display-removed", onRemoved);
        listeners.set("display", () => {
          screen.off("display-added", onAdded);
          screen.off("display-removed", onRemoved);
        });
        break;
      }
      case "clipboard": {
        // Electron 剪贴板无变更事件，用 changeCount 轮询（开销极低；该方法为 macOS 语义，Win 上同样可用）
        const cb = clipboard as any;
        let last = cb.changeCount();
        clipboardTimer = setInterval(() => {
          const now = cb.changeCount();
          if (now !== last) {
            last = now;
            push(e.sender, "clipboard", { changeCount: now, text: clipboard.readText().slice(0, 200) });
          }
        }, 1000);
        listeners.set("clipboard", () => {
          if (clipboardTimer) clearInterval(clipboardTimer);
          clipboardTimer = null;
        });
        break;
      }
      case "fs": {
        const dir = arg || TEMP_DIR;
        try {
          fsWatcher?.close();
          fsWatcher = nodeFs.watch(dir, (eventType, filename) => push(e.sender, "fs", { eventType, filename, dir }));
        } catch (err) {
          return { ok: false, error: (err as Error).message };
        }
        listeners.set("fs", () => {
          fsWatcher?.close();
          fsWatcher = null;
        });
        return { ok: true, dir };
      }
      default:
        return false;
    }
    return true;
  });

  safeHandle("demo-unlisten", (_e, source: string) => demoUnlisten(source));
}

/* ========================================================================== */
/* 模块内部辅助                                                                  */
/* ========================================================================== */

/** 取消某一类事件订阅（存在才取消） */
function demoUnlisten(source: string): void {
  listeners.get(source)?.();
  listeners.delete(source);
  if (source === "fs") {
    fsWatcher?.close();
    fsWatcher = null;
  }
  if (source === "clipboard" && clipboardTimer) {
    clearInterval(clipboardTimer);
    clipboardTimer = null;
  }
}
