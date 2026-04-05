import { apiClient } from './apiClient';
import { unwrapApiResponse } from './responseUtils';

export const paymentService = {
  makePayment: async (loanId, paymentData) => {
    const response = await apiClient.post(`/api/payments/loan/${loanId}`, paymentData);
    return unwrapApiResponse(response);
  },

  getPaymentsByLoan: async (loanId, params = {}) => {
    const response = await apiClient.get(`/api/payments/loan/${loanId}`, { params });
    return unwrapApiResponse(response);
  },

  getPaymentById: async (id) => {
    const response = await apiClient.get(`/api/payments/${id}`);
    return unwrapApiResponse(response);
  }
};
