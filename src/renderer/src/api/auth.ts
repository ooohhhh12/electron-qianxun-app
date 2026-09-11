// 模拟后端鉴权相关接口
// 接入真实后端时，把每个函数体替换为 http 请求即可，调用方（hook / 组件）无需改动

export interface LoginCredentials {
  username?: string;
  password?: string;
  mobile?: string;
  captcha?: string;
}

export interface UserInfo {
  id: number;
  username: string;
  nickname: string;
  avatar?: string;
  roles: Array<{ code: string; name: string }>;
}

/**
 * 模拟登录：校验账号密码，返回 token
 * 真实接口约定：POST /auth/login  →  { data: { token } }
 */
export function mockLogin(credentials: LoginCredentials): Promise<{ token: string }> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const { username, password } = credentials;
      // 本地测试账号
      if (username === "admin" && password === "123456") {
        resolve({ token: "mock-token-" + Date.now() });
      } else {
        reject(new Error("用户名或密码错误（测试账号：admin / 123456）"));
      }
    }, 300);
  });
}

/**
 * 模拟获取用户信息（请求头自动携带 token，由 request.ts 拦截器注入）
 * 真实接口约定：GET /auth/userinfo  →  { data: UserInfo }
 */
export function mockUserInfo(): Promise<UserInfo> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        id: 1,
        username: "admin",
        nickname: "管理员",
        roles: [{ code: "admin", name: "超级管理员" }],
      });
    }, 200);
  });
}
