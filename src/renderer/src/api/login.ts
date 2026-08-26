import request from "@utils/request";

//用户登录
export const loginByMobile = (data) => {
  return request({
    url: "/u/loginByJson",
    method: "post",
    data: data,
    //...
  });
};

//获取验证码
export const loginCaptcha = (data) => {
  return request({
    url: "/u/getCaptcha",
    method: "post",
    data: data,
    //...
  });
};

//获取验证码图片
export const captchaImage = (data) => {
  return request({
    url: "/u/getCaptchaImage",
    method: "post",
    data: data,
    //...
  });
};
