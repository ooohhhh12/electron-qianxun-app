# 风禾千寻electron-app

> 全场景绿植搭配与园林空间设计应用（桌面端 Demo）

**风禾千寻** 是一款全场景绿植搭配与园林空间设计 APP，区别于单一的阳台、庭院工具类软件，覆盖家庭、室内、商业全空间绿植设计需求。为普通用户、绿植爱好者、小微商户、园艺设计师提供：方案灵感、空间绿植搭配、AI 智能设计、植物识别、养护管理、设计师定制服务的一站式解决方案。

> 品牌 Slogan：**每个空间，皆有风禾绿意**

本项目基于 `electron-vite` 脚手架搭建，是一个集成了 **Electron + Vue 3 + TypeScript + Element Plus** 的桌面端应用模板，目前已实现首页与关于/详情页的 Demo 界面。

---

## 技术栈

| 分类      | 技术                 | 说明                               |
| --------- | -------------------- | ---------------------------------- |
| 桌面框架  | Electron             | 跨平台桌面应用                     |
| 前端框架  | Vue 3                | `<script setup>` 组合式 API        |
| 构建工具  | electron-vite / Vite | 主进程、预加载、渲染进程一体化构建 |
| 语言      | TypeScript           | 类型安全的开发体验                 |
| UI 组件库 | Element Plus         | 按需自动引入                       |
| 状态管理  | Pinia                | 含 `pinia-plugin-persist` 持久化   |
| 路由      | Vue Router           | Hash 模式 + 导航守卫               |
| 网络请求  | Axios                | 封装于 `utils/request.ts`          |
| 样式      | SCSS                 | 全局样式 + 组件作用域样式          |

---

## 功能特性

- 🚀 **主进程 / 预加载 / 渲染进程** 一键启动开发
- 🔥 渲染进程 HMR 快速热更新，主进程与预加载脚本支持热重载
- 📦 Element Plus 组件按需自动引入（`unplugin-auto-import` + `unplugin-vue-components`）
- 🗂️ Pinia 状态管理 + 本地持久化
- 🧭 Vue Router 路由 + 前置/后置导航守卫
- 🌿 风禾千寻品牌风格首页（Hero、核心功能、空间场景、CTA）
- 📄 首页详情跳转的关于页（根据 `?feature=` 参数高亮展示功能详情）

---

## 目录结构

```
electron-app
├── build/                        # 打包资源（图标、entitlements 等）
├── resources/                    # 应用资源（图标等）
├── doc/                          # 学习笔记 / 示例文档
├── src/
│   ├── main/
│   │   └── index.ts              # 主进程入口：创建窗口、生命周期管理
│   ├── preload/
│   │   ├── index.ts              # 预加载脚本：通过 contextBridge 暴露 API
│   │   └── index.d.ts            # 预加载 API 类型声明
│   └── renderer/                 # 渲染进程（Vue 应用）
│       ├── index.html            # 页面入口
│       └── src/
│           ├── main.ts           # Vue 应用入口（挂载路由、Pinia、全局样式）
│           ├── App.vue           # 根组件
│           ├── env.d.ts          # 类型声明
│           ├── api/              # 接口定义（login.ts 等）
│           ├── assets/
│           │   └── css/          # 全局样式（styles.less）
│           ├── components/       # 公共组件（Versions.vue 等）
│           ├── router/           # 路由（routes / guards / index）
│           ├── store/            # Pinia 状态（useUserStore 等）
│           ├── utils/            # 工具（request.ts 等）
│           └── views/            # 页面（Home.vue / About.vue）
├── electron-builder.yml          # 打包配置
├── electron.vite.config.ts       # electron-vite 配置（别名、代理、插件）
├── tsconfig.json                 # TypeScript 配置（项目引用）
├── tsconfig.node.json            # 主进程 / 预加载 TS 配置
├── tsconfig.web.json             # 渲染进程 TS 配置
└── package.json
```

---

## 快速开始

### 环境要求

- Node.js ≥ 18
- pnpm ≥ 9（本项目统一使用 pnpm 管理依赖）

### 安装依赖

```bash
pnpm install
```

> 项目已配置国内镜像加速（`.npmrc`）：npm 包源、Electron 二进制、electron-builder 打包工具均自动走 npmmirror，安装和打包时无需再手动处理网络问题。

### 启动开发

```bash
pnpm run dev
```

# 手动审批

pnpm approve-builds

启动后会打开 Electron 窗口，默认加载渲染进程开发地址，支持热更新。

### 构建与打包

```bash
# 仅构建（会先执行类型检查）
pnpm run build

# 打包为各平台安装包
pnpm run build:win      # Windows
pnpm run build:mac      # macOS
pnpm run build:linux    # Linux
```

---

## 常用脚本

| 命令                      | 说明                                   |
| ------------------------- | -------------------------------------- |
| `pnpm run dev`            | 启动开发环境（electron-vite dev）      |
| `pnpm run start`          | 预览构建产物（electron-vite preview）  |
| `pnpm run build`          | 类型检查 + 构建（electron-vite build） |
| `pnpm run typecheck`      | 主进程 / 渲染进程类型检查              |
| `pnpm run typecheck:node` | 仅检查主进程 / 预加载                  |
| `pnpm run typecheck:web`  | 仅检查渲染进程（vue-tsc）              |
| `pnpm run lint`           | ESLint 检查并自动修复                  |
| `pnpm run format`         | Prettier 格式化全部文件                |

---

## 路径别名

在 `electron.vite.config.ts` 与 `tsconfig.web.json` 中已配置以下别名，渲染进程中可直接使用：

| 别名          | 指向目录                      |
| ------------- | ----------------------------- |
| `@renderer`   | `src/renderer/src`            |
| `@views`      | `src/renderer/src/views`      |
| `@components` | `src/renderer/src/components` |
| `@router`     | `src/renderer/src/router`     |
| `@store`      | `src/renderer/src/store`      |
| `@utils`      | `src/renderer/src/utils`      |
| `@api`        | `src/renderer/src/api`        |

示例：

```ts
import { useUserStore } from "@store/useUserStore";
import { loginByJson } from "@api/login";
```

---

## 开发代理

开发环境下，渲染进程的 `/api` 请求会被代理到后端接口：

```ts
server: {
  proxy: {
    '/api': {
      target: 'http://uat.crm.xuexiluxian.cn',
      changeOrigin: true,
      rewrite: (path) => path.replace(/^\/api/, '')
    }
  }
}
```

即前端请求 `/api/xxx` 会转发到 `http://uat.crm.xuexiluxian.cn/xxx`。

---

## 推荐 IDE 配置

- [VS Code](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar)（Vue 官方扩展）
- [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)
- [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)

---

## 更多参考

- [electron-vite 官方文档](https://electron-vite.org/)
- [Electron 官方文档](https://www.electronjs.org/)
- [Vue 3 官方文档](https://cn.vuejs.org/)
- [Element Plus 官方文档](https://element-plus.org/zh-CN/)
