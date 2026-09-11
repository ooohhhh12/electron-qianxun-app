/// <reference types="vite/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types
  const component: DefineComponent<{}, {}, any>
  export default component
}

// 声明预加载脚本暴露的 electron 对象（通过 contextBridge.exposeInMainWorld）
// 渲染层中可直接写 electron.ipcRenderer.invoke(...)，
// 打包时 typecheck 就不会再报 "找不到名称 'electron'" 了
declare const electron: {
  ipcRenderer: import('electron').IpcRenderer
  process: {
    versions: Record<string, string>
  }
}
