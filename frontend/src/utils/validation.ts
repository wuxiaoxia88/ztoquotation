/**
 * 表单验证工具
 */

// 验证手机号
export const validatePhone = (phone: string): boolean => {
  const reg = /^1[3-9]\d{9}$/;
  return reg.test(phone);
};

// 验证邮箱
export const validateEmail = (email: string): boolean => {
  const reg = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return reg.test(email);
};

// 验证密码强度 (至少6位)
export const validatePassword = (password: string): boolean => {
  return password.length >= 6;
};

// 表单规则
export const formRules = {
  required: { required: true, message: '此项为必填项' },
  phone: {
    pattern: /^1[3-9]\d{9}$/,
    message: '请输入正确的手机号',
  },
  email: {
    type: 'email' as const,
    message: '请输入正确的邮箱',
  },
  password: {
    min: 6,
    message: '密码至少6位',
  },
};
