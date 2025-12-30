/**
 * 基础数据相关API
 */
import api from './api';
import { Province, RegionGroup, Term } from '@/types';

export const baseApi = {
  // 获取省份列表
  getProvinces: (): Promise<Province[]> => {
    return api.get('/provinces');
  },

  // 获取区域分组
  getRegions: (): Promise<RegionGroup[]> => {
    return api.get('/regions');
  },

  // 获取固定条款
  getFixedTerms: (): Promise<Term[]> => {
    return api.get('/terms/fixed');
  },

  // 获取非固定条款
  getOptionalTerms: (): Promise<Term[]> => {
    return api.get('/terms/optional');
  },
};
