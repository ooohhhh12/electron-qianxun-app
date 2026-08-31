import axios, { AxiosInstance, AxiosResponse } from "axios";

const request: AxiosInstance = axios.create({
  baseURL: "/api",
});

// 添加请求拦截器
request.interceptors.request.use(
  function (config) {
    // 统一在请求头中携带 token
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["token"] = token;
    }
    return config;
  },
  function (error) {
    return Promise.reject(error);
  },
);

// 添加响应拦截器
request.interceptors.response.use(
  function (response) {
    return response;
  },
  function (error) {
    return Promise.reject(error);
  },
);

const http = {
  get<T>(url: string, params?: any, config?: {}): Promise<T> {
    return new Promise((resolve, reject) => {
      request
        .get<T>(url, { params, ...config })
        .then((res: AxiosResponse<T>) => {
          resolve(res.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  },
  post<T>(url: string, data?: any, config?: {}): Promise<T> {
    return new Promise((resolve, reject) => {
      request
        .post<T>(url, data, config)
        .then((res: AxiosResponse<T>) => {
          resolve(res.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  },
};

export default http;
