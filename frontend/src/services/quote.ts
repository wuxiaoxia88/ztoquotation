/**
 * 报价单相关API
 */
import api from './api';
import { Quote } from '@/types';

export interface QuoteCreateRequest {
  customer_name: string;
  contact_person: string;
  contact_phone: string;
  customer_address?: string;
  daily_volume?: string;
  weight_range?: string;
  product_type?: string;
  quoter_id: number;
  quote_date: string;
  valid_days: number;
  is_tax_included: boolean;
  template_type: string;
  price_data: any;
  fixed_terms?: any[];
  optional_terms?: any[];
  custom_terms?: string[];
  remark?: string;
}

export interface QuoteUpdateRequest {
  customer_name?: string;
  contact_person?: string;
  contact_phone?: string;
  customer_address?: string;
  daily_volume?: string;
  weight_range?: string;
  product_type?: string;
  quoter_id?: number;
  quote_date?: string;
  valid_days?: number;
  is_tax_included?: boolean;
  template_type?: string;
  price_data?: any;
  fixed_terms?: any[];
  optional_terms?: any[];
  custom_terms?: string[];
  remark?: string;
}

export interface QuoteListParams {
  skip?: number;
  limit?: number;
  customer_name?: string;
  contact_phone?: string;
  status?: string;
  start_date?: string;
  end_date?: string;
}

export const quoteApi = {
  // 获取报价单列表
  list: (params?: QuoteListParams): Promise<Quote[]> => {
    return api.get('/quotes', { params });
  },

  // 创建报价单
  create: (data: QuoteCreateRequest): Promise<Quote> => {
    return api.post('/quotes', data);
  },

  // 获取报价单详情
  get: (id: number): Promise<Quote> => {
    return api.get(`/quotes/${id}`);
  },

  // 更新报价单
  update: (id: number, data: QuoteUpdateRequest): Promise<Quote> => {
    return api.put(`/quotes/${id}`, data);
  },

  // 更新报价单状态
  updateStatus: (id: number, status: string): Promise<Quote> => {
    return api.put(`/quotes/${id}/status`, { status });
  },

  // 复制报价单
  copy: (id: number): Promise<Quote> => {
    return api.post(`/quotes/${id}/copy`);
  },

  // 删除报价单
  delete: (id: number): Promise<void> => {
    return api.delete(`/quotes/${id}`);
  },

  // 获取下一个编号
  getNextNumber: (quote_date?: string): Promise<{ quote_number: string; quote_date: string }> => {
    return api.get('/quotes/number/next', { params: { quote_date } });
  },
};
