/**
 * 导出相关API
 */
import api from './api';

export const exportApi = {
  // 预览HTML
  preview: (quoteId: number, theme: string = 'blue'): string => {
    return `/api/v1/exports/quotes/${quoteId}/preview?theme=${theme}`;
  },

  // 导出HTML
  exportHtml: (quoteId: number, theme: string = 'blue'): string => {
    return `/api/v1/exports/quotes/${quoteId}/export/html?theme=${theme}`;
  },

  // 导出Excel
  exportExcel: (quoteId: number): string => {
    return `/api/v1/exports/quotes/${quoteId}/export/excel`;
  },

  // 导出PDF
  exportPdf: (quoteId: number, theme: string = 'blue'): string => {
    return `/api/v1/exports/quotes/${quoteId}/export/pdf?theme=${theme}`;
  },

  // 下载文件
  download: async (url: string, filename: string): Promise<void> => {
    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const blob = await response.blob();
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(link.href);
    } catch (error) {
      console.error('Download failed:', error);
      throw error;
    }
  },
};
