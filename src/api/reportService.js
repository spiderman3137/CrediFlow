import { fileClient } from './apiClient';
import { saveBlob } from './responseUtils';

export const reportService = {
  downloadFinancialSummaryPdf: async () => {
    const response = await fileClient.get('/api/reports/financial-summary/pdf', {
      responseType: 'blob',
    });
    saveBlob(response, 'financial-summary.pdf');
  },

  downloadFinancialSummaryCsv: async () => {
    const response = await fileClient.get('/api/reports/financial-summary/csv', {
      responseType: 'blob',
    });
    saveBlob(response, 'financial-summary.csv');
  },
};
