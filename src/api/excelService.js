import { fileClient } from './apiClient';
import { saveBlob, unwrapApiResponse } from './responseUtils';

export const excelService = {
  // ─── LOAN EXPORT ──────────────────────────────────────────────────────────
  // GET /api/excel/download/loans — ADMIN + ANALYST
  downloadLoansExcel: async () => {
    const response = await fileClient.get('/api/excel/download/loans', {
      responseType: 'blob',
    });
    saveBlob(response, 'loans_report.xlsx');
  },

  // ─── PAYMENT EXPORT ───────────────────────────────────────────────────────
  // GET /api/excel/download/payments — ADMIN + ANALYST
  downloadPaymentsExcel: async () => {
    const response = await fileClient.get('/api/excel/download/payments', {
      responseType: 'blob',
    });
    saveBlob(response, 'payments_report.xlsx');
  },

  // ─── USER EXPORT ──────────────────────────────────────────────────────────
  // GET /api/excel/download/users — ADMIN only
  downloadUsersExcel: async () => {
    const response = await fileClient.get('/api/excel/download/users', {
      responseType: 'blob',
    });
    saveBlob(response, 'users_report.xlsx');
  },

  // ─── TEMPLATE DOWNLOADS ───────────────────────────────────────────────────
  // GET /api/excel/download/template/users — ADMIN only
  downloadUsersTemplate: async () => {
    const response = await fileClient.get('/api/excel/download/template/users', {
      responseType: 'blob',
    });
    saveBlob(response, 'users_upload_template.xlsx');
  },

  // GET /api/excel/download/template/loans — ADMIN only
  downloadLoansTemplate: async () => {
    const response = await fileClient.get('/api/excel/download/template/loans', {
      responseType: 'blob',
    });
    saveBlob(response, 'loans_upload_template.xlsx');
  },

  // ─── BULK UPLOADS ─────────────────────────────────────────────────────────
  // POST /api/excel/upload/loans — ADMIN only
  uploadLoansExcel: async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await fileClient.post('/api/excel/upload/loans', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return unwrapApiResponse(response);
  },

  // POST /api/excel/upload/users — ADMIN only
  uploadUsersExcel: async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await fileClient.post('/api/excel/upload/users', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return unwrapApiResponse(response);
  },
};
