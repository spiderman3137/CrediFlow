import { apiClient } from './apiClient';
import { unwrapApiResponse } from './responseUtils';

export const analyticsService = {
  // GET /api/analytics/dashboard — ADMIN + ANALYST
  getDashboard: async () => {
    const response = await apiClient.get('/api/analytics/dashboard');
    return unwrapApiResponse(response);
  },

  // GET /api/analytics/loans/by-status — ADMIN + ANALYST
  getLoansByStatus: async () => {
    const response = await apiClient.get('/api/analytics/loans/by-status');
    return unwrapApiResponse(response);
  },

  // GET /api/analytics/loans/by-purpose — ADMIN + ANALYST
  getLoansByPurpose: async () => {
    const response = await apiClient.get('/api/analytics/loans/by-purpose');
    return unwrapApiResponse(response);
  },

  // GET /api/analytics/users/summary — ADMIN + ANALYST
  getUserSummary: async () => {
    const response = await apiClient.get('/api/analytics/users/summary');
    return unwrapApiResponse(response);
  },

  // GET /api/analytics/audit/recent — ADMIN + ANALYST
  getRecentAuditLogs: async () => {
    const response = await apiClient.get('/api/analytics/audit/recent');
    return unwrapApiResponse(response);
  },
};
