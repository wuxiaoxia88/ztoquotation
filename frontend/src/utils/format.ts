/**
 * 格式化工具函数
 */
import dayjs from 'dayjs';

// 格式化日期
export const formatDate = (date: string | Date, format: string = 'YYYY-MM-DD'): string => {
  return dayjs(date).format(format);
};

// 格式化日期时间
export const formatDateTime = (date: string | Date): string => {
  return dayjs(date).format('YYYY-MM-DD HH:mm:ss');
};

// 格式化金额
export const formatMoney = (amount: number, decimals: number = 2): string => {
  return amount.toFixed(decimals);
};

// 格式化手机号
export const formatPhone = (phone: string): string => {
  return phone.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3');
};

// 状态映射
export const statusMap: Record<string, { text: string; color: string }> = {
  DRAFT: { text: '草稿', color: 'default' },
  SENT: { text: '已发送', color: 'processing' },
  CONFIRMED: { text: '已确认', color: 'success' },
  EXPIRED: { text: '已过期', color: 'error' },
};

// 角色映射
export const roleMap: Record<string, string> = {
  ADMIN: '管理员',
  OPERATOR: '操作员',
};

// 模板类型映射
export const templateTypeMap: Record<string, string> = {
  TONGPIAO: '通票',
  DAKEHU: '大客户',
  CANGPEI: '仓配',
};
