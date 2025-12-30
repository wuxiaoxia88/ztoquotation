/**
 * 模板相关API
 */
import api from './api';
import { Template, TemplateType } from '@/types';

export interface TemplateCreateRequest {
  name: string;
  template_type: TemplateType;
  template_data: any;
  is_default?: boolean;
  remark?: string;
}

export interface TemplateUpdateRequest {
  name?: string;
  template_data?: any;
  is_default?: boolean;
  remark?: string;
}

export const templateApi = {
  // 获取模板列表
  list: (params?: { template_type?: string; is_active?: boolean }): Promise<Template[]> => {
    return api.get('/templates', { params });
  },

  // 创建模板
  create: (data: TemplateCreateRequest): Promise<Template> => {
    return api.post('/templates', data);
  },

  // 获取模板详情
  get: (id: number): Promise<Template> => {
    return api.get(`/templates/${id}`);
  },

  // 更新模板
  update: (id: number, data: TemplateUpdateRequest): Promise<Template> => {
    return api.put(`/templates/${id}`, data);
  },

  // 删除模板 (逻辑删除)
  delete: (id: number): Promise<void> => {
    return api.delete(`/templates/${id}`);
  },

  // 设为默认
  setDefault: (id: number): Promise<Template> => {
    return api.put(`/templates/${id}/default`);
  },

  // Excel导入
  importExcel: (file: File): Promise<Template> => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post('/templates/import', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
};
