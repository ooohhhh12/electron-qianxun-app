"use strict";
const electron = require("electron");
const path = require("path");
const utils = require("@electron-toolkit/utils");
const icon = path.join(__dirname, "../../resources/icon.png");
function createWindow() {
  const mainWindow = new electron.BrowserWindow({
    width: 900,
    height: 670,
    // minWidth: 900,
    // minHeight: 670,
    // maxWidth: 900,
    // maxHeight: 670,
    show: false,
    //
    autoHideMenuBar: true,
    // 自动隐藏菜单栏
    // titleBarStyle: "hidden", // 隐藏标题栏
    frame: false,
    //无边框窗口
    resizable: true,
    // 窗口不可调整大小
    // transparent: true,
    ...process.platform === "linux" ? { icon } : {},
    webPreferences: {
      preload: path.join(__dirname, "../preload/index.js"),
      sandbox: false
    }
  });
  mainWindow.on("ready-to-show", () => {
    mainWindow.show();
  });
  electron.ipcMain.handle("custom-adsorption", (event, data) => {
    mainWindow.setPosition(data.appX, data.appY);
  });
  const context = {
    allowQuitting: false,
    // 是否退出应用
    isShow: false,
    //显示隐藏窗口
    childWindow: null
    //创建窗口的对象
  };
  const createChildWindow = () => {
    const childWindow = new electron.BrowserWindow({
      width: 400,
      height: 400,
      parent: mainWindow,
      // 子窗口父窗口
      show: false,
      // 子窗口不显示
      autoHideMenuBar: true,
      // 自动隐藏菜单栏
      frame: false,
      // 无边框窗口
      resizable: false,
      // 窗口不可调整大小
      ...process.platform === "linux" ? { icon } : {},
      webPreferences: {
        preload: path.join(__dirname, "../preload/index.js"),
        sandbox: false
      }
    });
    context.childWindow = childWindow;
    childWindow.on("ready-to-show", () => {
      childWindow.show();
    });
    childWindow.on("close", (e) => {
      {
        e.preventDefault();
        hideWindow();
      }
    });
    childWindow.on("closed", () => {
      context.childWindow = null;
      context.isShow = false;
    });
    if (utils.is.dev && process.env["ELECTRON_RENDERER_URL"]) {
      childWindow.loadURL(process.env["ELECTRON_RENDERER_URL"] + "#/login/wechat");
    } else {
      childWindow.loadFile(path.join(__dirname, "../renderer/index.html"), {
        hash: "/login/wechat"
      });
    }
  };
  const showWindow = () => {
    if (context.childWindow && !context.childWindow.isDestroyed()) {
      context.childWindow.show();
      context.isShow = true;
    }
  };
  const hideWindow = () => {
    if (context.childWindow && !context.childWindow.isDestroyed()) {
      context.childWindow.hide();
      context.isShow = false;
    }
  };
  electron.ipcMain.handle("loginByWechat", () => {
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
  electron.ipcMain.handle("custom-wx", (_event, res) => {
    if (!context.childWindow || context.childWindow.isDestroyed())
      return;
    const { width, height } = context.childWindow.getBounds();
    context.childWindow.setBounds({ x: res.appX, y: res.appY, width, height });
  });
  mainWindow.webContents.setWindowOpenHandler((details) => {
    electron.shell.openExternal(details.url);
    return { action: "deny" };
  });
  electron.ipcMain.handle("close-login", () => {
    mainWindow.close();
  });
  if (utils.is.dev && process.env["ELECTRON_RENDERER_URL"]) {
    mainWindow.loadURL(process.env["ELECTRON_RENDERER_URL"]);
  } else {
    mainWindow.loadFile(path.join(__dirname, "../renderer/index.html"));
  }
}
electron.app.whenReady().then(() => {
  utils.electronApp.setAppUserModelId("com.electron");
  electron.app.on("browser-window-created", (_, window) => {
    utils.optimizer.watchWindowShortcuts(window);
  });
  createWindow();
  electron.app.on("activate", function() {
    if (electron.BrowserWindow.getAllWindows().length === 0)
      createWindow();
  });
});
electron.app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    electron.app.quit();
  }
});
