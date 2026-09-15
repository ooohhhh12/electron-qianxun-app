export const AppRoutes = [
  {
    path: "/",
    name: "登录",
    component: () => import("@views/login/index.vue"),
  },
  {
    path: "/home",
    name: "首页",
    component: () => import("@views/Home.vue"),
  },
  {
    path: "/about",
    name: "关于我们",
    component: () => import("@views/About.vue"),
  },
  {
    path: "/scenes",
    name: "空间场景",
    component: () => import("@views/Scenes.vue"),
  },
  {
    path: "/login/wechat",
    name: "微信登录",
    component: () => import("@views/login/wechat.vue"),
  },
  // Electron 系统交互 Demo（仅供开发参考，不影响正式功能）
  {
    path: "/demo",
    name: "系统交互Demo",
    component: () => import("@views/demo/index.vue"),
  },
  // 后台管理（嵌套路由）
  {
    path: "/main",
    component: () => import("@views/main/layout.vue"),
    redirect: "/main/dashboard",
    children: [
      // —— 数据面板（无子菜单，直接渲染）——
      {
        path: "dashboard",
        name: "数据面板",
        component: () => import("@views/main/dashboard/index.vue"),
      },
      // —— 用户管理 ——
      {
        path: "user/normal",
        name: "普通用户",
        component: () => import("@views/main/user/normal.vue"),
      },
      {
        path: "user/vip",
        name: "VIP 用户",
        component: () => import("@views/main/user/vip.vue"),
      },
      // —— 商品管理 ——
      {
        path: "product/list",
        name: "商品列表",
        component: () => import("@views/main/product/list.vue"),
      },
      {
        path: "product/category",
        name: "商品分类",
        component: () => import("@views/main/product/category.vue"),
      },
      // —— 财务管理 ——
      {
        path: "finance/income",
        name: "收入统计",
        component: () => import("@views/main/finance/income.vue"),
      },
      {
        path: "finance/transaction",
        name: "交易记录",
        component: () => import("@views/main/finance/transaction.vue"),
      },
      // —— 系统配置 ——
      {
        path: "system/role",
        name: "角色权限",
        component: () => import("@views/main/system/role.vue"),
      },
      {
        path: "system/params",
        name: "系统参数",
        component: () => import("@views/main/system/params.vue"),
      },
    ],
  },
];
