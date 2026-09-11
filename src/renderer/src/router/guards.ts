// 白名单（无需登录即可访问）
// const WHITE_LIST = ["/", "/home", "/about", "/scenes", "/login/wechat"];

// 前置守卫：未登录不可进入后台
export const beforeEach = (to: { path: string }) => {
  const token = localStorage.getItem("token");
  if (to.path.startsWith("/main") && !token) {
    return "/";
  }
  return true;
};

// 后置守卫
export const afterEach = () => {
  // 预留：埋点、标题更新等
};
