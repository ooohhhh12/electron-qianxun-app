"use strict";
const electron = require("electron");
const preload = require("@electron-toolkit/preload");
const api = {
  // // 调用主进程获取当前窗口显示器缩放因子
  // getScaleFactor: () => electronAPI.ipcRenderer.invoke('get-display-scale'),
  // // 拖动窗口的invoke
  // moveWindow: (data) => electronAPI.ipcRenderer.invoke('custom-adsorption', data)
};
if (process.contextIsolated) {
  try {
    electron.contextBridge.exposeInMainWorld("electron", preload.electronAPI);
    electron.contextBridge.exposeInMainWorld("api", api);
  } catch (error) {
    console.error(error);
  }
} else {
  window.electron = preload.electronAPI;
  window.api = api;
}
