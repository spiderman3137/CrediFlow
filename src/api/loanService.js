import { apiClient } from './apiClient';
import { unwrapApiResponse } from './responseUtils';

export const loanService = {
  applyForLoan: async (loanData) => {
    const response = await apiClient.post('/api/loans/apply', loanData);
    return unwrapApiResponse(response);
  },

  applyWorkflowLoan: async (loanData) => {
    const response = await apiClient.post('/api/loan-workflow/apply', loanData);
    return unwrapApiResponse(response);
  },

  getMyLoans: async (params = {}) => {
    const response = await apiClient.get('/api/loans/my-loans', { params });
    return unwrapApiResponse(response);
  },

  getAllLoans: async (params = {}) => {
    const response = await apiClient.get('/api/loans', { params });
    return unwrapApiResponse(response);
  },

  getLoansByStatus: async (status, params = {}) => {
    const response = await apiClient.get(`/api/loans/status/${status}`, { params });
    return unwrapApiResponse(response);
  },

  getLoanById: async (id) => {
    const response = await apiClient.get(`/api/loans/${id}`);
    return unwrapApiResponse(response);
  },

  updateLoanStatus: async (id, status, lenderNote = '') => {
    const response = await apiClient.put(`/api/loans/${id}/status`, null, {
      params: { status, lenderNote }
    });
    return unwrapApiResponse(response);
  },
  
  evaluateAndAutoApprove: async (loanId) => {
    const response = await apiClient.post(`/api/platform/evaluate/${loanId}`);
    return unwrapApiResponse(response);
  },
  
  approveLoan: async (loanId, remarks = '') => {
    const response = await apiClient.post(`/api/loan-workflow/${loanId}/approve`, null, {
      params: { remarks }
    });
    return unwrapApiResponse(response);
  },
  
  rejectLoan: async (loanId, remarks = '') => {
    const response = await apiClient.post(`/api/loan-workflow/${loanId}/reject`, null, {
      params: { remarks }
    });
    return unwrapApiResponse(response);
  }
};
