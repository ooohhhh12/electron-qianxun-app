// 模拟后端：根据 token 返回当前用户的菜单树（含嵌套 children）
// 接入真实后端后，改为 http.get("/menu/list") 即可，返回数据结构保持一致

export interface MenuNode {
  path: string;       // 路由路径（相对 /main）
  name: string;       // 菜单名称
  icon: string;       // Element Plus 图标组件名（字符串，用于 resolveComponent）
  children?: MenuNode[];
}

const mockMenus: MenuNode[] = [
  {
    path: "/main/dashboard",
    name: "数据面板",
    icon: "DataAnalysis",
  },
  {
    path: "/main/user",
    name: "用户管理",
    icon: "User",
    children: [
      { path: "/main/user/normal", name: "普通用户", icon: "" },
      { path: "/main/user/vip", name: "VIP 用户", icon: "" },
    ],
  },
  {
    path: "/main/product",
    name: "商品管理",
    icon: "Goods",
    children: [
      { path: "/main/product/list", name: "商品列表", icon: "" },
      { path: "/main/product/category", name: "商品分类", icon: "" },
    ],
  },
  {
    path: "/main/finance",
    name: "财务管理",
    icon: "Wallet",
    children: [
      { path: "/main/finance/income", name: "收入统计", icon: "" },
      { path: "/main/finance/transaction", name: "交易记录", icon: "" },
    ],
  },
  {
    path: "/main/system",
    name: "系统配置",
    icon: "Setting",
    children: [
      { path: "/main/system/role", name: "角色权限", icon: "" },
      { path: "/main/system/params", name: "系统参数", icon: "" },
    ],
  },
];

export function getMenuList(): Promise<MenuNode[]> {
  // 模拟：校验 token 是否存在，不存在抛错
  const token = localStorage.getItem("token");
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (!token) {
        reject(new Error("未登录，无法获取菜单"));
      } else {
        resolve(mockMenus);
      }
    }, 300);
  });
}
