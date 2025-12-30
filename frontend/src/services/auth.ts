/**
 * 认证相关API
 */
import api from './api';
import { LoginRequest, LoginResponse, User } from '@/types';

export const authApi = {
  // 登录
  login: (data: LoginRequest): Promise<LoginResponse> => {
    return api.post('/auth/login', data);
  },

  // 获取当前用户信息
  getCurrentUser: (): Promise<User> => {
    return api.get('/auth/me');
  },

  // 修改密码
  changePassword: (data: { old_password: string; new_password: string }): Promise<{ message: string }> => {
    return api.put('/auth/password', data);
  },
};
