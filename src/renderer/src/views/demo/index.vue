<template>
  <div class="demo-page">
    <div class="demo-header">
      <h2>Electron 系统交互 API Demo</h2>
      <p>
        按模块演示渲染进程与主进程的系统级交互。所有功能均通过
        <code>ipcRenderer.invoke('通道名', 参数)</code> 触发，结果显示在底部日志；
        事件推送类（窗口变化、电源、下载进度等）在「事件监听」区开关。
      </p>
      <el-alert
        type="warning"
        :closable="false"
        title="请在 Electron 桌面应用内打开本页（#/demo），普通浏览器中没有系统 API。"
      />
    </div>

    <el-collapse v-model="activeNames" class="demo-collapse">
      <!-- ============ 一、窗口控制 ============ -->
      <el-collapse-item title="一、窗口控制（BrowserWindow）" name="window">
        <p class="tip">场景：自定义无边框标题栏、全屏播放器、置顶悬浮窗、固定窗口尺寸、桌面宠物鼠标穿透等。</p>
        <div class="btn-group">
          <el-button @click="call('win-minimize')">最小化</el-button>
          <el-button @click="call('win-restore')">还原</el-button>
          <el-button @click="call('win-toggle-max')">切换最大化</el-button>
          <el-button @click="call('win-close')" type="danger">关闭窗口</el-button>
          <el-button @click="call('win-hide')">隐藏窗口（用托盘唤起）</el-button>
          <el-button @click="call('win-show')">显示并聚焦</el-button>
          <el-button @click="call('win-focus')">聚焦窗口</el-button>
          <el-button @click="call('win-is-maximized')">查询是否最大化</el-button>
          <el-button @click="call('win-is-focused')">查询是否聚焦</el-button>
          <el-button @click="toggleTop">{{ isOnTop ? "取消置顶" : "窗口置顶" }}</el-button>
          <el-button @click="toggleFullScreen">{{ isFullScreen ? "退出全屏" : "进入全屏(F11式)" }}</el-button>
          <el-button @click="call('win-set-simple-fullscreen', true)">简易全屏</el-button>
          <el-button @click="call('win-set-simple-fullscreen', false)">退出简易全屏</el-button>
          <el-button @click="call('win-set-opacity', 0.5)">透明度 0.5</el-button>
          <el-button @click="call('win-set-opacity', 1)">透明度 1.0</el-button>
          <el-button @click="call('win-set-vibrancy', 'under-window')">毛玻璃效果</el-button>
          <el-button @click="call('win-set-vibrancy', 'none')">关闭毛玻璃</el-button>
          <el-divider />
          <el-button @click="call('win-set-size', { width: 800, height: 600 })">设置 800×600</el-button>
          <el-button @click="call('win-set-position', { x: 100, y: 100 })">移动到 (100,100)</el-button>
          <el-button @click="call('win-set-bounds', { x: 80, y: 80, width: 1000, height: 700 })">位置+尺寸</el-button>
          <el-button @click="call('win-set-min-size', { width: 800, height: 600 })">设最小尺寸</el-button>
          <el-button @click="call('win-set-max-size', { width: 1600, height: 1000 })">设最大尺寸</el-button>
          <el-divider />
          <el-button @click="call('win-set-resizable', false)">禁止缩放</el-button>
          <el-button @click="call('win-set-resizable', true)">允许缩放</el-button>
          <el-button @click="call('win-set-movable', false)">禁止拖动</el-button>
          <el-button @click="call('win-set-movable', true)">允许拖动</el-button>
          <el-button @click="call('win-set-title', '自定义标题')">修改标题</el-button>
          <el-button @click="call('win-set-skip-taskbar', true)">任务栏隐藏</el-button>
          <el-button @click="call('win-set-skip-taskbar', false)">任务栏显示</el-button>
          <el-button @click="call('win-set-ignore-mouse-events', true)">鼠标穿透</el-button>
          <el-button @click="call('win-set-ignore-mouse-events', false)">取消穿透</el-button>
        </div>
      </el-collapse-item>

      <!-- ============ 二、对话框 ============ -->
      <el-collapse-item title="二、对话框（Dialog）" name="dialog">
        <p class="tip">场景：导入导出文件、另存为、危险操作二次确认、异常详情。对话框为模态，会阻塞窗口交互。</p>
        <div class="btn-group">
          <el-button @click="call('dialog-open-file')">选择单个文件</el-button>
          <el-button @click="call('dialog-open-dir')">选择文件夹</el-button>
          <el-button @click="call('dialog-open-multi')">多选文件</el-button>
          <el-button @click="call('dialog-save-file', { title: '另存为', defaultPath: 'demo.txt' })"
            >保存文件框</el-button
          >
          <el-button
            type="warning"
            @click="
              call('dialog-show-message', {
                title: '提示',
                message: '确认执行该操作？',
                type: 'info',
                buttons: ['取消', '确定'],
              })
            "
            >消息确认框</el-button
          >
          <el-button type="danger" @click="call('dialog-show-error', { title: '错误', content: '这是错误详情说明' })"
            >错误框</el-button
          >
        </div>
      </el-collapse-item>

      <!-- ============ 三、文件系统与路径 ============ -->
      <el-collapse-item title="三、系统路径与文件系统（app.getPath / fs / shell）" name="fs">
        <p class="tip">场景：配置存 userData、导出报表到下载/桌面、日志写 logs、删除走回收站、监听目录热更新。</p>
        <div class="btn-group">
          <el-button @click="call('path-get-app-data')">AppData 目录</el-button>
          <el-button @click="call('path-get-userData')">应用数据目录</el-button>
          <el-button @click="call('path-get-temp')">临时目录</el-button>
          <el-button @click="call('path-get-desktop')">桌面</el-button>
          <el-button @click="call('path-get-documents')">文档</el-button>
          <el-button @click="call('path-get-downloads')">下载</el-button>
          <el-button @click="call('path-get-home')">用户主目录</el-button>
          <el-button @click="call('path-get-exe')">exe 路径</el-button>
          <el-button @click="call('path-get-logs')">日志目录</el-button>
          <el-divider />
          <el-button type="primary" @click="call('fs-write-file')">① 写演示文件</el-button>
          <el-button @click="call('fs-read-file')">② 读取文件</el-button>
          <el-button @click="call('fs-copy')">③ 复制文件</el-button>
          <el-button @click="call('fs-rename')">④ 重命名副本</el-button>
          <el-button @click="call('fs-delete')">⑤ 删除副本</el-button>
          <el-button type="danger" @click="call('fs-move-to-trash')">⑥ 原文件进回收站</el-button>
          <el-divider />
          <el-button @click="call('fs-read-dir', 'C:/Windows')">读取 C:/Windows 目录</el-button>
          <el-button @click="call('fs-stat', 'C:/Windows/explorer.exe')">查看文件元信息</el-button>
        </div>
        <p class="tip">演示文件固定在系统临时目录 fenghe-demo.txt，可配合「事件监听 → 文件变化」观察推送。</p>
      </el-collapse-item>

      <!-- ============ 四、系统信息与外观 ============ -->
      <el-collapse-item title="四、系统信息与外观（System / Screen / Theme）" name="sys">
        <p class="tip">场景：崩溃报告附带环境、按 DPI 缩放界面、跟随系统深浅色、多显示器投放窗口。</p>
        <div class="btn-group">
          <el-button @click="call('sys-get-platform')">平台标识</el-button>
          <el-button @click="call('sys-get-arch')">CPU 架构</el-button>
          <el-button @click="call('sys-get-os-version')">系统版本</el-button>
          <el-button @click="call('sys-get-locale')">系统语言</el-button>
          <el-button @click="call('sys-get-hardware-memory')">物理内存</el-button>
          <el-button @click="call('sys-get-machine-id')">设备标识(计算机名)</el-button>
          <el-divider />
          <el-button @click="call('sys-get-theme')">当前深浅色</el-button>
          <el-button @click="call('sys-set-theme', 'light')">强制浅色</el-button>
          <el-button @click="call('sys-set-theme', 'dark')">强制深色</el-button>
          <el-button @click="call('sys-set-theme', 'system')">跟随系统</el-button>
          <el-button @click="call('sys-get-accent-color')">系统强调色/高对比度</el-button>
          <el-divider />
          <el-button @click="call('screen-get-all')">所有显示器</el-button>
          <el-button @click="call('screen-get-primary')">主显示器</el-button>
          <el-button @click="call('screen-get-cursor-point')">鼠标全局坐标</el-button>
        </div>
      </el-collapse-item>

      <!-- ============ 五、Shell 与剪贴板 ============ -->
      <el-collapse-item title="五、Shell 与剪贴板" name="shell">
        <p class="tip">场景：外链跳默认浏览器、下载后在资源管理器定位、一键复制订单号、富文本/图片剪贴板。</p>
        <div class="btn-group">
          <el-button @click="call('shell-open-external', 'https://www.baidu.com')">浏览器打开百度</el-button>
          <el-button @click="call('shell-open-path', 'C:/Windows')">打开本地文件夹</el-button>
          <el-button @click="call('shell-show-in-folder', 'C:/Windows/explorer.exe')">资源管理器中定位</el-button>
          <el-button @click="call('shell-beep')">系统提示音</el-button>
          <el-divider />
          <el-button @click="call('clipboard-write-text', '风禾千寻 ' + Date.now())">写入纯文本</el-button>
          <el-button @click="call('clipboard-read-text')">读取纯文本</el-button>
          <el-button
            @click="call('clipboard-write-html', '<b>加粗</b><span style=&quot;color:green&quot;>绿色文字</span>')"
            >写入富文本</el-button
          >
          <el-button @click="call('clipboard-read-html')">读取富文本</el-button>
          <el-button @click="call('clipboard-read-image')">读取剪贴板图片</el-button>
          <el-button @click="call('clipboard-clear')">清空剪贴板</el-button>
        </div>
      </el-collapse-item>

      <!-- ============ 六、通知 ============ -->
      <el-collapse-item title="六、系统通知（Notification）" name="notify">
        <p class="tip">场景：下载完成、消息提醒、后台任务结束。Windows 打包后需设置 AppUserModelId 才进通知中心。</p>
        <div class="btn-group">
          <el-button @click="call('notify-is-supported')">检测通知能力</el-button>
          <el-button type="primary" @click="call('notify-send', { title: '风禾千寻', body: '这是一条系统通知' })"
            >发送普通通知</el-button
          >
          <el-button
            type="success"
            @click="call('notify-send-action', { title: '带操作通知', body: 'Windows 按钮能力有限，降级为普通通知' })"
            >带操作通知(降级)</el-button
          >
          <el-button @click="call('notify-close')">关闭刚发的通知</el-button>
        </div>
      </el-collapse-item>

      <!-- ============ 七、电源 ============ -->
      <el-collapse-item title="七、电源（powerMonitor / powerSaveBlocker）" name="power">
        <p class="tip">场景：长任务阻止休眠、笔记本电池提示、锁屏暂停播放、唤醒后自动同步（事件见监听区）。</p>
        <div class="btn-group">
          <el-button @click="call('power-get-state')">电源状态/空闲/电池</el-button>
          <el-button @click="call('power-is-on-battery')">是否电池供电</el-button>
          <el-button type="warning" @click="call('power-block-sleep', 'block')">阻止系统休眠</el-button>
          <el-button @click="call('power-block-sleep', 'prevent-display-sleep')">允许休眠</el-button>
        </div>
      </el-collapse-item>

      <!-- ============ 八、菜单 / 托盘 / 快捷键 ============ -->
      <el-collapse-item title="八、菜单 / 托盘 / 全局快捷键" name="menu">
        <p class="tip">场景：托盘常驻后台（IM、下载器）、右键菜单、老板键/截图键等失焦仍生效的快捷键。</p>
        <div class="btn-group">
          <el-button @click="call('menu-popup-context')">弹出右键菜单</el-button>
          <el-button @click="call('menu-build-application')">构建应用菜单栏</el-button>
          <el-divider />
          <el-button type="primary" @click="call('tray-create')">创建系统托盘</el-button>
          <el-button @click="call('tray-set-tooltip', '新的悬停提示 ' + timeNow)">改托盘提示</el-button>
          <el-button type="danger" @click="call('tray-destroy')">销毁托盘</el-button>
          <el-divider />
          <el-button type="warning" @click="call('shortcut-register', 'CommandOrControl+Shift+S')"
            >注册 Ctrl+Shift+S</el-button
          >
          <el-button @click="call('shortcut-unregister', 'CommandOrControl+Shift+S')">注销该快捷键</el-button>
          <el-button @click="call('shortcut-unregister-all')">注销全部快捷键</el-button>
        </div>
        <p class="tip">注册后把窗口切到后台，按 Ctrl+Shift+S 会弹通知，事件区也会收到 shortcut 推送。</p>
      </el-collapse-item>

      <!-- ============ 九、Windows 专属 ============ -->
      <el-collapse-item title="九、Windows 专属功能 🪟" name="winex">
        <p class="tip">场景：下载进度上任务栏、未读角标、消息闪烁、任务栏 Jump List、开机自启。macOS 调用无效。</p>
        <div class="btn-group">
          <el-button @click="call('win-set-progress-bar', 0.5)">任务栏进度 50%</el-button>
          <el-button @click="call('win-set-progress-bar', 0.9)">任务栏进度 90%</el-button>
          <el-button @click="call('win-set-progress-bar', -1)">清除进度</el-button>
          <el-button @click="call('win-flash-frame', true)">任务栏闪烁</el-button>
          <el-button @click="call('win-flash-frame', false)">停止闪烁</el-button>
          <el-button @click="call('win-set-overlay-icon', true)">叠加未读角标</el-button>
          <el-button @click="call('win-set-overlay-icon', false)">清除角标</el-button>
          <el-divider />
          <el-button @click="call('win-set-app-user-model-id', 'com.fenghe.qianxun')">设置 AUMID</el-button>
          <el-button @click="call('win-get-login-item')">查询开机自启状态</el-button>
          <el-button @click="call('win-set-login-item', { openAtLogin: true })">设置开机自启</el-button>
          <el-button @click="call('win-set-login-item', { openAtLogin: false })">取消开机自启</el-button>
          <el-divider />
          <el-button @click="call('win-set-jump-list')">设置任务栏 Jump List</el-button>
          <el-button @click="call('win-recent-docs-add')">添加最近文档</el-button>
          <el-button @click="call('win-recent-docs-clear')">清空最近文档</el-button>
        </div>
      </el-collapse-item>

      <!-- ============ 十、网络与下载 ============ -->
      <el-collapse-item title="十、网络 / 会话 / 下载（net / session）" name="net">
        <p class="tip">场景：走系统代理的原生请求、读取登录 Cookie、清缓存、应用内下载并实时显示进度。</p>
        <div class="btn-group">
          <el-button @click="call('online-get-status')">在线状态</el-button>
          <el-button @click="call('session-get-user-agent')">UserAgent</el-button>
          <el-button @click="call('session-get-cookies')">获取 Cookies</el-button>
          <el-button @click="call('session-clear-cache')">清理缓存</el-button>
          <el-button @click="call('net-request', 'https://www.baidu.com')">原生请求百度</el-button>
          <el-button
            type="primary"
            @click="call('download-start', 'https://www.baidu.com/img/flexible/logo/pc/result.png')"
            >下载测试图片</el-button
          >
        </div>
        <div v-if="downloadInfo" class="download-box">
          <span>{{ downloadInfo.filename }} — {{ downloadInfo.state }}</span>
          <el-progress v-if="downloadInfo.percent != null" :percentage="downloadInfo.percent" style="width: 260px" />
        </div>
      </el-collapse-item>

      <!-- ============ 十一、媒体与截屏 ============ -->
      <el-collapse-item title="十一、屏幕/窗口捕获（desktopCapturer）" name="capture">
        <p class="tip">场景：屏幕共享、截图工具、录屏源选择。macOS 10.15+ 需「屏幕录制」授权，Windows 无门槛。</p>
        <div class="btn-group">
          <el-button type="primary" @click="getSources">枚举可捕获屏幕/窗口</el-button>
          <el-button @click="takeScreenshot">截取当前应用窗口</el-button>
        </div>
        <div v-if="sources.length" class="capture-grid">
          <div v-for="s in sources" :key="s.id" class="capture-item">
            <img :src="s.thumbnail" :alt="s.name" />
            <el-tag size="small" :type="s.type === 'screen' ? 'primary' : 'success'">
              {{ s.type === "screen" ? "屏幕" : "窗口" }}
            </el-tag>
            <span class="capture-name">{{ s.name }}</span>
          </div>
        </div>
        <div v-if="shotImage" class="shot-box">
          <p class="tip">当前应用窗口截图：</p>
          <img :src="shotImage" alt="screenshot" />
        </div>
      </el-collapse-item>

      <!-- ============ 十二、应用信息与安全存储 ============ -->
      <el-collapse-item title="十二、应用信息 / 重启 / 安全存储（safeStorage）" name="app">
        <p class="tip">场景：版本检测、升级后重启、本地加密保存 token/密码。Windows 走 DPAPI，密文与当前用户绑定。</p>
        <div class="btn-group">
          <el-button @click="call('app-get-version')">应用版本号</el-button>
          <el-button @click="call('app-get-name')">应用名称</el-button>
          <el-button type="danger" @click="relaunchApp">重启应用（先确认）</el-button>
          <el-divider />
          <el-button @click="call('safe-storage-available')">检测加密能力</el-button>
          <el-button type="warning" @click="call('safe-storage-encrypt', '敏感数据：token-abc-123')"
            >系统级加密文本</el-button
          >
          <el-button type="success" @click="call('safe-storage-decrypt')">解密上次密文</el-button>
          <el-divider />
          <el-button @click="call('crash-reporter-start')">初始化崩溃报告(仅本地)</el-button>
        </div>
      </el-collapse-item>

      <!-- ============ 十三、事件监听 ============ -->
      <el-collapse-item title="十三、主进程事件推送（实时监听）" name="events">
        <p class="tip">
          主进程 → 渲染进程的单向推送，统一走 <code>demo-push</code> 通道。开启后操作窗口/复制内容/开关屏幕等，
          事件会实时写入日志；离开页面会自动全部取消订阅。
        </p>
        <div class="btn-group">
          <el-button :type="listening.window ? 'danger' : 'primary'" @click="toggleListen('window')">
            {{ listening.window ? "停止" : "监听" }}窗口尺寸/位置/焦点
          </el-button>
          <el-button :type="listening.power ? 'danger' : 'default'" @click="toggleListen('power')">
            {{ listening.power ? "停止" : "监听" }}睡眠/锁屏
          </el-button>
          <el-button :type="listening.theme ? 'danger' : 'default'" @click="toggleListen('theme')">
            {{ listening.theme ? "停止" : "监听" }}系统主题变化
          </el-button>
          <el-button :type="listening.display ? 'danger' : 'default'" @click="toggleListen('display')">
            {{ listening.display ? "停止" : "监听" }}显示器插拔
          </el-button>
          <el-button :type="listening.clipboard ? 'danger' : 'default'" @click="toggleListen('clipboard')">
            {{ listening.clipboard ? "停止" : "监听" }}剪贴板变化
          </el-button>
          <el-button :type="listening.fs ? 'danger' : 'default'" @click="toggleListen('fs')">
            {{ listening.fs ? "停止" : "监听" }}临时目录文件变化
          </el-button>
          <el-button @click="stopAll">全部停止</el-button>
        </div>
      </el-collapse-item>

      <!-- ============ 十四、macOS 专属 ============ -->
      <el-collapse-item title="十四、macOS 专属能力 🍎（Windows 下返回不支持）" name="mac">
        <p class="tip">
          保留入口与平台守卫，便于将来打包 mac 版本时在同一套 Demo 验证；Windows 点击会返回 supported:false。
        </p>
        <div class="btn-group">
          <el-button @click="call('mac-dock-set-badge', '3')">Dock 角标 3</el-button>
          <el-button @click="call('mac-dock-set-badge', '')">清除 Dock 角标</el-button>
          <el-button @click="call('mac-dock-bounce')">Dock 图标跳动</el-button>
        </div>
      </el-collapse-item>

      <!-- ============ 十五、系统偏好与权限 ============ -->
      <el-collapse-item title="十五、系统偏好与权限（systemPreferences）" name="pref">
        <p class="tip">
          场景：音视频通话前查摄像头/麦克风权限、录屏前查屏幕录制授权（macOS 未授权录到黑屏）、
          高对比度无障碍适配。授权弹窗类 API 为 macOS 专属，Windows 点击返回 supported:false。
        </p>
        <div class="btn-group">
          <el-button @click="call('pref-get-media-access-status', 'camera')">查摄像头权限</el-button>
          <el-button @click="call('pref-get-media-access-status', 'microphone')">查麦克风权限</el-button>
          <el-button @click="call('pref-ask-media-access', 'camera')">申请摄像头(mac)</el-button>
          <el-button @click="call('pref-ask-media-access', 'microphone')">申请麦克风(mac)</el-button>
          <el-button @click="call('pref-get-screen-access-status')">查屏幕录制权限</el-button>
          <el-divider />
          <el-button @click="call('pref-is-high-contrast')">是否高对比度</el-button>
          <el-button @click="call('pref-get-system-color', 'window-background')">系统语义色(mac)</el-button>
          <el-button @click="call('pref-subscribe-notification', 'AppleShowScrollBarsSettingChanged')"
            >订阅系统外观通知(mac)</el-button
          >
          <el-button @click="call('pref-unsubscribe-notification', 'AppleShowScrollBarsSettingChanged')"
            >取消订阅</el-button
          >
          <el-divider />
          <el-button @click="call('pref-open-settings', 'camera')">打开摄像头设置页</el-button>
          <el-button @click="call('pref-open-settings', 'microphone')">打开麦克风设置页</el-button>
          <el-button @click="call('pref-open-settings', 'screen-capture')">打开录屏设置页(mac)</el-button>
        </div>
      </el-collapse-item>

      <!-- ============ 十六、自动更新 ============ -->
      <el-collapse-item title="十六、自动更新（autoUpdater / Squirrel）" name="update">
        <p class="tip">
          场景：启动静默检查 → 发现新版本 → 后台下载 →
          提示重启安装。生命周期事件（检查中/有更新/下载进度/下载完成/错误） 会自动以
          <code>[事件] update</code> 写入底部日志。注意：内置 autoUpdater 需 Squirrel 更新服务且 mac 需签名，
          未配置更新源直接点「检查更新」会返回错误（可观察 error 分支），生产环境一般用 electron-updater。
        </p>
        <div class="btn-group">
          <el-button @click="call('update-get-version')">当前版本号</el-button>
          <el-button @click="setFeedUrl">配置更新源地址</el-button>
          <el-button type="primary" @click="call('update-check')">检查更新</el-button>
          <el-button type="danger" @click="call('update-install')">下载完成后重启安装</el-button>
        </div>
      </el-collapse-item>
    </el-collapse>

    <!-- 调用日志 -->
    <div class="demo-log">
      <div class="demo-log-header">
        <span>调用日志（invoke 结果 + 事件推送）</span>
        <el-button size="small" text @click="logs = []">清空</el-button>
      </div>
      <div class="demo-log-body">
        <div v-for="(item, i) in logs" :key="i" class="log-item">
          <span class="log-time">{{ item.time }}</span>
          <el-tag size="small" :type="item.ok ? 'success' : 'danger'">{{ item.ok ? "OK" : "ERR" }}</el-tag>
          <span class="log-channel">{{ item.channel }}</span>
          <span class="log-result">{{ item.result }}</span>
        </div>
        <div v-if="logs.length === 0" class="log-empty">暂无调用记录</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, reactive, ref } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";

/* ============================ 页面状态 ============================ */
const activeNames = ref<string[]>(["window"]);
const isOnTop = ref(false);
const isFullScreen = ref(false);
const timeNow = ref("");
setInterval(() => (timeNow.value = new Date().toLocaleTimeString()), 1000);

interface LogItem {
  time: string;
  ok: boolean;
  channel: string;
  result: string;
}
const logs = ref<LogItem[]>([]);

/* ============================ IPC 基础封装 ============================ */
/** 安全获取 preload 注入的 ipcRenderer */
const getIpc = (): { invoke: Function; on: Function; off: Function } | undefined =>
  (window as any).electron?.ipcRenderer;

/** 结果统一格式化（对象转 JSON，超长截断） */
function formatResult(res: unknown): string {
  if (res === undefined) return "undefined";
  if (typeof res === "object") {
    const str = JSON.stringify(res, null, 2);
    return str.length > 3000 ? str.slice(0, 3000) + "\n...（已截断）" : str;
  }
  return String(res);
}

/** 统一 invoke 调用入口 */
const call = async (channel: string, ...args: any[]) => {
  const time = new Date().toLocaleTimeString();
  const ipc = getIpc();
  if (!ipc) {
    logs.value.unshift({ time, ok: false, channel, result: "未检测到 Electron 环境" });
    ElMessage.error("请在 Electron 应用内打开");
    return undefined;
  }
  try {
    const res = await ipc.invoke(channel, ...args);
    logs.value.unshift({ time, ok: true, channel, result: formatResult(res) });
    ElMessage.success(`${channel} 成功`);
    return res;
  } catch (e: any) {
    logs.value.unshift({ time, ok: false, channel, result: e?.message || String(e) });
    ElMessage.error(`${channel} 失败`);
  }
};

/* ============================ 窗口开关类按钮 ============================ */
const toggleTop = async () => {
  isOnTop.value = !isOnTop.value;
  await call("win-set-always-on-top", isOnTop.value);
};
const toggleFullScreen = async () => {
  isFullScreen.value = !isFullScreen.value;
  await call("win-set-full-screen", isFullScreen.value);
};

/* ============================ 下载进度（事件推送） ============================ */
const downloadInfo = ref<{ filename?: string; state?: string; percent?: number } | null>(null);

/* ============================ 截屏演示 ============================ */
interface CaptureSource {
  id: string;
  name: string;
  type: string;
  thumbnail: string;
}
const sources = ref<CaptureSource[]>([]);
const shotImage = ref("");

const getSources = async () => {
  const res = await call("capture-get-sources");
  sources.value = Array.isArray(res) ? res : [];
};
const takeScreenshot = async () => {
  const res = await call("capture-screenshot");
  if (typeof res === "string" && res) shotImage.value = res;
};

/* ============================ 应用重启 ============================ */
const relaunchApp = async () => {
  try {
    await ElMessageBox.confirm("确认立即重启应用吗？", "重启确认", { type: "warning" });
    await call("app-relaunch");
  } catch {
    /* 用户取消 */
  }
};

/* ============================ 自动更新：弹框输入更新源 ============================ */
const setFeedUrl = async () => {
  try {
    const { value } = await ElMessageBox.prompt("请输入 Squirrel 更新源地址（RELEASES 所在目录 URL）", "配置更新源", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      inputPlaceholder: "http://your-server/updates/",
    });
    if (value) await call("update-set-feed-url", value);
  } catch {
    /* 用户取消 */
  }
};

/* ============================ 事件监听（主进程推送） ============================ */
const listening = reactive<Record<string, boolean>>({
  window: false,
  power: false,
  theme: false,
  display: false,
  clipboard: false,
  fs: false,
});

/** 主进程统一推送回调 */
const onPush = (_e: unknown, payload: { source: string; data: unknown }) => {
  // 下载进度单独展示，同时也写日志
  if (payload.source === "download") {
    downloadInfo.value = payload.data as any;
  }
  logs.value.unshift({
    time: new Date().toLocaleTimeString(),
    ok: true,
    channel: `[事件] ${payload.source}`,
    result: formatResult(payload.data),
  });
};

/** 开启某类监听 */
const toggleListen = async (source: string) => {
  const ipc = getIpc();
  if (!ipc) {
    ElMessage.error("请在 Electron 应用内打开");
    return;
  }
  if (listening[source]) {
    await ipc.invoke("demo-unlisten", source);
    listening[source] = false;
    ElMessage.info(`已停止监听：${source}`);
  } else {
    const ok = await ipc.invoke("demo-listen", source);
    listening[source] = !!ok;
    ElMessage.success(ok ? `开始监听：${source}` : `监听开启失败：${source}`);
  }
};

/** 停止全部监听（页面卸载时也会调用） */
const stopAll = async () => {
  const ipc = getIpc();
  if (!ipc) return;
  for (const source of Object.keys(listening)) {
    if (listening[source]) {
      await ipc.invoke("demo-unlisten", source);
      listening[source] = false;
    }
  }
};

onMounted(() => getIpc()?.on("demo-push", onPush));
onBeforeUnmount(() => {
  stopAll();
  getIpc()?.off("demo-push", onPush);
});
</script>

<style scoped>
.demo-page {
  max-width: 1000px;
  margin: 0 auto;
  padding: 24px;
}
.demo-header {
  margin-bottom: 20px;
}
.demo-header h2 {
  font-size: 22px;
  margin-bottom: 8px;
  color: var(--el-text-color-primary);
}
.demo-header p {
  font-size: 13px;
  color: var(--el-text-color-secondary);
  line-height: 1.7;
  margin-bottom: 12px;
}
.demo-header code,
.tip code {
  background: var(--el-fill-color);
  padding: 1px 6px;
  border-radius: 4px;
  font-size: 12px;
}
.demo-collapse {
  margin-bottom: 20px;
}
/* 每个分区下的使用场景说明 */
.tip {
  font-size: 12.5px;
  color: var(--el-text-color-secondary);
  background: var(--el-fill-color-lighter);
  border-left: 3px solid var(--el-color-primary-light-5);
  padding: 8px 12px;
  border-radius: 0 6px 6px 0;
  line-height: 1.6;
  margin: 4px 0 12px;
}
.btn-group {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  padding: 8px 0;
}
.btn-group .el-divider {
  width: 100%;
  margin: 4px 0;
}

/* 下载进度 */
.download-box {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 10px 12px;
  background: var(--el-fill-color-lighter);
  border-radius: 6px;
  font-size: 13px;
}

/* 截屏预览 */
.capture-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 12px;
  margin-top: 12px;
}
.capture-item {
  border: 1px solid var(--el-border-color-lighter);
  border-radius: 8px;
  padding: 8px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  background: var(--el-bg-color-overlay);
}
.capture-item img {
  width: 100%;
  height: 125px;
  object-fit: cover;
  border-radius: 4px;
  background: #333;
}
.capture-name {
  font-size: 12px;
  color: var(--el-text-color-regular);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.shot-box {
  margin-top: 12px;
}
.shot-box img {
  max-width: 480px;
  width: 100%;
  border: 1px solid var(--el-border-color);
  border-radius: 8px;
}

/* 日志面板 */
.demo-log {
  border: 1px solid var(--el-border-color);
  border-radius: 8px;
  overflow: hidden;
  background: var(--el-bg-color-overlay);
}
.demo-log-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 16px;
  border-bottom: 1px solid var(--el-border-color-lighter);
  font-weight: 600;
  color: var(--el-text-color-primary);
}
.demo-log-body {
  max-height: 340px;
  overflow-y: auto;
  padding: 8px 0;
}
.log-item {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  padding: 6px 16px;
  font-size: 13px;
  border-bottom: 1px solid var(--el-border-color-lighter);
}
.log-time {
  color: var(--el-text-color-secondary);
  white-space: nowrap;
}
.log-channel {
  font-weight: 600;
  color: var(--el-color-primary);
  white-space: nowrap;
}
.log-result {
  color: var(--el-text-color-regular);
  word-break: break-all;
  flex: 1;
  white-space: pre-wrap;
  font-family: monospace;
  max-height: 120px;
  overflow-y: auto;
}
.log-empty {
  text-align: center;
  padding: 20px;
  color: var(--el-text-color-placeholder);
}
</style>
