import http from "@utils/request";
interface ILoginRequest {
  code: string;
  msg: string;
  data?: string | null;
}

//图形验证码
export const captchaImage = (data: { key: string }): Promise<ArrayBuffer> => {
  return http.get<ArrayBuffer>("/captcha/image", data, { responseType: "arraybuffer" });
};

//用户登录
export const loginByJson = (data): Promise<ILoginRequest> => {
  return http.post<ILoginRequest>("/u/loginByJson", data);
};

//登录动态验证码
export const loginCaptcha = (data): Promise<ILoginRequest> => {
  return http.get<ILoginRequest>("/captcha/sendRegisterOrLoginCaptcha", data);
};

//手机验证码登录
export const loginByMobile = (data): Promise<ILoginRequest> => {
  return http.post<ILoginRequest>("/u/loginByMobile", data);
};

//获取当前登录用户信息（需携带 token）
export const getUserInfo = (): Promise<ILoginRequest> => {
  return http.get<ILoginRequest>("/u/getUserInfo");
};

//根据角色权限编码获取路由菜单树
export const getRoutes = (data: { roleCodes: string[] }): Promise<ILoginRequest> => {
  return http.post<ILoginRequest>("/u/getRoutes", data);
};
