/**
 * Axios基础配置
 */
import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';
import { message } from 'antd';

// 创建axios实例
const api: AxiosInstance = axios.create({
  baseURL: '/api/v1',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 请求拦截器
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // 从localStorage获取token
    const token = localStorage.getItem('access_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// 响应拦截器
api.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error: AxiosError) => {
    // 处理错误
    if (error.response) {
      const status = error.response.status;
      const data: any = error.response.data;

      switch (status) {
        case 401:
          message.error('未授权,请重新登录');
          localStorage.removeItem('access_token');
          localStorage.removeItem('user');
          window.location.href = '/login';
          break;
        case 403:
          message.error('没有权限');
          break;
        case 404:
          message.error(data.detail || '资源不存在');
          break;
        case 422:
          message.error('数据验证失败');
          break;
        case 500:
          message.error('服务器错误');
          break;
        default:
          message.error(data.detail || '请求失败');
      }
    } else if (error.request) {
      message.error('网络错误,请检查网络连接');
    } else {
      message.error('请求配置错误');
    }

    return Promise.reject(error);
  }
);

export default api;
