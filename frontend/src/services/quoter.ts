/**
 * 报价人相关API
 */
import api from './api';
import { Quoter } from '@/types';

export interface QuoterCreateRequest {
  name: string;
  phone: string;
  email?: string;
  department?: string;
  is_default?: boolean;
}

export interface QuoterUpdateRequest {
  name?: string;
  phone?: string;
  email?: string;
  department?: string;
  is_default?: boolean;
}

export const quoterApi = {
  // 获取报价人列表
  list: (): Promise<Quoter[]> => {
    return api.get('/quoters');
  },

  // 创建报价人
  create: (data: QuoterCreateRequest): Promise<Quoter> => {
    return api.post('/quoters', data);
  },

  // 获取报价人详情
  get: (id: number): Promise<Quoter> => {
    return api.get(`/quoters/${id}`);
  },

  // 更新报价人
  update: (id: number, data: QuoterUpdateRequest): Promise<Quoter> => {
    return api.put(`/quoters/${id}`, data);
  },

  // 删除报价人
  delete: (id: number): Promise<void> => {
    return api.delete(`/quoters/${id}`);
  },

  // 设为默认
  setDefault: (id: number): Promise<Quoter> => {
    return api.put(`/quoters/${id}/default`);
  },
};
