import { app, shell, BrowserWindow, ipcMain, screen } from "electron";
import { join } from "path";
import { electronApp, optimizer, is } from "@electron-toolkit/utils";
import icon from "../../resources/icon.png?asset";

function createWindow(): void {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    // minWidth: 900,
    // minHeight: 670,
    // maxWidth: 900,
    // maxHeight: 670,
    show: false, //
    autoHideMenuBar: true, // 自动隐藏菜单栏
    // titleBarStyle: "hidden", // 隐藏标题栏
    frame: false, //无边框窗口
    resizable: true, // 窗口不可调整大小
    // transparent: true,
    ...(process.platform === "linux" ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, "../preload/index.js"),
      sandbox: false,
    },
  });

  mainWindow.on("ready-to-show", () => {
    mainWindow.show();
  });

  // 窗口拖拽
  ipcMain.handle("custom-adsorption", (event, data) => {
    // 一次调用传全量 bounds，避免只传 width/height 在 125% 等缩放下被错误换算导致窗口变大
    // mainWindow.setBounds({ x: res.appX, y: res.appY, width, height });
      mainWindow.setPosition(data.appX, data.appY);
  });
  // 子窗口对象
  const context: {
    allowQuitting: boolean;
    isShow: boolean;
    childWindow: BrowserWindow | null;
  } = {
    allowQuitting: false, // 是否退出应用
    isShow: false, //显示隐藏窗口
    childWindow: null, //创建窗口的对象
  };
  // 创建子窗口
  const createChildWindow = () => {
    // 用局部变量持有窗口引用，避免闭包内 context.childWindow 被判定可能为 null
    const childWindow = new BrowserWindow({
      width: 400,
      height: 400,
      parent: mainWindow, // 子窗口父窗口
      show: false, // 子窗口不显示
      autoHideMenuBar: true, // 自动隐藏菜单栏
      frame: false, // 无边框窗口
      resizable: false, // 窗口不可调整大小
      ...(process.platform === "linux" ? { icon } : {}),
      webPreferences: {
        preload: join(__dirname, "../preload/index.js"),
        sandbox: false,
      },
    });
    context.childWindow = childWindow;
    // 子窗口显示
    childWindow.on("ready-to-show", () => {
      childWindow.show();
    });
    // 子窗口关闭
    childWindow.on("close", (e) => {
      // 应用未退出时，阻止默认关闭行为，改为隐藏窗口（保留实例以便复用）
      if (context.allowQuitting == false) {
        e.preventDefault();
        hideWindow();
      }
    });
    // 子窗口真正销毁后清理引用，避免下次打开时引用已销毁的窗口
    childWindow.on("closed", () => {
      context.childWindow = null;
      context.isShow = false;
    });

    if (is.dev && process.env["ELECTRON_RENDERER_URL"]) {
      childWindow.loadURL(
        process.env["ELECTRON_RENDERER_URL"] + "#/login/wechat",
      );
    } else {
      // 生产环境 loadFile 需通过 hash 指定子窗口路由，否则会落到默认路由 /
      childWindow.loadFile(join(__dirname, "../renderer/index.html"), {
        hash: "/login/wechat",
      });
    }
  };
  // 显示窗口
  const showWindow = () => {
    if (context.childWindow && !context.childWindow.isDestroyed()) {
      context.childWindow.show();
      context.isShow = true;
    }
  };

  // 隐藏窗口
  const hideWindow = () => {
    if (context.childWindow && !context.childWindow.isDestroyed()) {
      context.childWindow.hide();
      context.isShow = false;
    }
  };
  // 打开微信登录弹窗
  ipcMain.handle("loginByWechat", () => {
    if (context.childWindow == null) {
      createChildWindow();
    } else {
      if (context.isShow) {
        hideWindow();
      } else {
        showWindow();
      }
    }
  });

  // 子窗口拖拽：必须无条件注册，否则 createWindow 时 childWindow 为 null 导致 handler 永不生效
  ipcMain.handle("custom-wx", (_event, res) => {
    if (!context.childWindow || context.childWindow.isDestroyed()) return;
    const { width, height } = context.childWindow.getBounds();
    context.childWindow.setBounds({ x: res.appX, y: res.appY, width, height });
  });

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url);
    return { action: "deny" };
  });

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env["ELECTRON_RENDERER_URL"]) {
    mainWindow.loadURL(process.env["ELECTRON_RENDERER_URL"]);
  } else {
    mainWindow.loadFile(join(__dirname, "../renderer/index.html"));
  }
}

// // 1. 获取窗口所在显示器缩放因子
// ipcMain.handle('get-display-scale', async (event) => {
//   const win = BrowserWindow.fromWebContents(event.sender)
//   if (!win) return 1
//   const display = screen.getDisplayMatching(win.getBounds())
//   return display.scaleFactor
// })

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId("com.electron");

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on("browser-window-created", (_, window) => {
    optimizer.watchWindowShortcuts(window);
  });

  createWindow();

  app.on("activate", function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.
