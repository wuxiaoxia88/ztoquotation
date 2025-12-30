/**
 * 类型定义文件
 */

// 用户角色
export enum UserRole {
  ADMIN = 'ADMIN',
  OPERATOR = 'OPERATOR',
}

// 用户类型
export interface User {
  id: number;
  username: string;
  email: string;
  full_name: string;
  role: UserRole;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// 登录请求
export interface LoginRequest {
  username: string;
  password: string;
}

// 登录响应
export interface LoginResponse {
  access_token: string;
  token_type: string;
  user: User;
}

// 报价人
export interface Quoter {
  id: number;
  name: string;
  phone: string;
  email?: string;
  department?: string;
  is_default: boolean;
  created_at: string;
  updated_at: string;
}

// 模板类型
export enum TemplateType {
  TONGPIAO = 'TONGPIAO',
  DAKEHU = 'DAKEHU',
  CANGPEI = 'CANGPEI',
}

// 价格模板
export interface Template {
  id: number;
  name: string;
  template_type: TemplateType;
  template_data: any; // JSONB
  is_default: boolean;
  is_active: boolean;
  remark?: string;
  created_at: string;
  updated_at: string;
}

// 报价单状态
export enum QuoteStatus {
  DRAFT = 'DRAFT',
  SENT = 'SENT',
  CONFIRMED = 'CONFIRMED',
  EXPIRED = 'EXPIRED',
}

// 报价单
export interface Quote {
  id: number;
  quote_number: string;
  customer_name: string;
  contact_person: string;
  contact_phone: string;
  customer_address?: string;
  daily_volume?: string;
  weight_range?: string;
  product_type?: string;
  quoter_id: number;
  quote_date: string;
  expire_date: string;
  valid_days: number;
  is_tax_included: boolean;
  template_type: string;
  price_data: any; // JSONB
  fixed_terms?: any[];
  optional_terms?: any[];
  custom_terms?: string[];
  remark?: string;
  status: QuoteStatus;
  created_at: string;
  updated_at: string;
}

// 省份
export interface Province {
  id: number;
  code: string;
  name: string;
  region_name: string;
  sort_order: number;
}

// 区域分组
export interface RegionGroup {
  region_name: string;
  provinces: Province[];
}

// 条款
export interface Term {
  id: number;
  title: string;
  content: string;
  is_fixed: boolean;
  sort_order: number;
  is_active: boolean;
}

// 分页响应
export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  page_size: number;
}

// API响应
export interface ApiResponse<T = any> {
  data?: T;
  message?: string;
  code?: number;
}
