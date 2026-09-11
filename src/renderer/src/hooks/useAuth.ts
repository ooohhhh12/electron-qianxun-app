import { ref, watch } from "vue";
import { useRouter } from "vue-router";
import { mockLogin, mockUserInfo, type LoginCredentials, type UserInfo } from "@api/auth";
import { getMenuList, type MenuNode } from "@api/menu";

/**
 * 鉴权 hook：统一管理 token / 用户信息 / 菜单树 的状态、持久化与登录流程编排。
 *
 * 核心设计：
 *  - 模块级 ref：跨组件共享同一份状态，login.vue 写入 → layout.vue 直接读取，无需手动 parse localStorage
 *  - 自动持久化：状态变化写入 localStorage，页面刷新时从 localStorage 恢复
 *  - API 层解耦：mockLogin / mockUserInfo / getMenuList 都在 api/ 目录下，接入真实接口只改那几个函数体
 */

const TOKEN_KEY = "token";
const USER_KEY = "userInfo";
const MENU_KEY = "menuTree";

// —— 模块级状态（单例，所有组件共享）——
const token = ref<string>(localStorage.getItem(TOKEN_KEY) || "");
const userInfo = ref<UserInfo | null>(
  (() => {
    const raw = localStorage.getItem(USER_KEY);
    if (!raw) return null;
    try { return JSON.parse(raw) as UserInfo; } catch { return null; }
  })()
);
const menuTree = ref<MenuNode[]>(
  (() => {
    const raw = localStorage.getItem(MENU_KEY);
    if (!raw) return [];
    try { return JSON.parse(raw) as MenuNode[]; } catch { return []; }
  })()
);

// 状态变化 → 自动持久化到 localStorage
watch(token, (v) => {
  v ? localStorage.setItem(TOKEN_KEY, v) : localStorage.removeItem(TOKEN_KEY);
});
watch(userInfo, (v) => {
  v ? localStorage.setItem(USER_KEY, JSON.stringify(v)) : localStorage.removeItem(USER_KEY);
}, { deep: true });
watch(menuTree, (v) => {
  v.length ? localStorage.setItem(MENU_KEY, JSON.stringify(v)) : localStorage.removeItem(MENU_KEY);
}, { deep: true });

export function useAuth() {
  const router = useRouter();

  /** 步骤1：登录获取 token */
  const login = async (credentials: LoginCredentials): Promise<void> => {
    const res = await mockLogin(credentials);
    token.value = res.token;
  };

  /** 步骤2：拉取当前登录用户信息（含角色权限编码） */
  const fetchUserInfo = async (): Promise<void> => {
    const data = await mockUserInfo();
    userInfo.value = data;
  };

  /** 步骤3：根据角色权限编码拉取菜单树 */
  const fetchMenuTree = async (): Promise<void> => {
    const list = await getMenuList();
    menuTree.value = list;
  };

  /** 全流程编排：登录 → 拉用户 → 拉菜单 → 进入后台首页 */
  const loginAndEnter = async (credentials: LoginCredentials): Promise<void> => {
    await login(credentials);
    await fetchUserInfo();
    await fetchMenuTree();
    router.push("/home");
  };

  /** 登出：清所有状态 + 跳登录页 */
  const logout = async (): Promise<void> => {
    token.value = "";
    userInfo.value = null;
    menuTree.value = [];
    router.push("/");
  };

  /** 是否已登录 */
  const isAuthenticated = () => !!token.value;

  return {
    // 状态
    token,
    userInfo,
    menuTree,
    // 方法
    login,
    fetchUserInfo,
    fetchMenuTree,
    loginAndEnter,
    logout,
    isAuthenticated,
  };
}
