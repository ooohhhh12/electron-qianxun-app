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
    path: "/login/wechat",
    name: "微信登录",
    component: () => import("@views/login/wechat.vue"),
  },
];
