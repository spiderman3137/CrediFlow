import { fileClient } from './apiClient';
import { saveBlob, unwrapApiResponse } from './responseUtils';

export const excelService = {
  downloadLoansExcel: async () => {
    const response = await fileClient.get('/api/excel/download/loans', {
      responseType: 'blob',
    });
    saveBlob(response, 'loans_report.xlsx');
  },

  uploadLoansExcel: async (file) => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fileClient.post('/api/excel/upload/loans', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return unwrapApiResponse(response);
  },
};
