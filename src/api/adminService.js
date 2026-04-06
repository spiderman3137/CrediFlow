import { apiClient } from './apiClient';
import { unwrapApiResponse } from './responseUtils';

export const adminService = {
  // GET /api/admin/overview — ADMIN only
  getOverview: async () => {
    const response = await apiClient.get('/api/admin/overview');
    return unwrapApiResponse(response);
  },

  // GET /api/admin/users — ADMIN only (paginated)
  getAllUsers: async (params = {}) => {
    const response = await apiClient.get('/api/admin/users', { params });
    return unwrapApiResponse(response);
  },

  // GET /api/admin/audit-logs — ADMIN only
  getAuditLogs: async () => {
    const response = await apiClient.get('/api/admin/audit-logs');
    return unwrapApiResponse(response);
  },

  // GET /api/admin/loans — ADMIN only (paginated)
  getAllLoans: async (params = {}) => {
    const response = await apiClient.get('/api/admin/loans', { params });
    return unwrapApiResponse(response);
  },

  // GET /api/admin/transactions — ADMIN only (paginated)
  getAllTransactions: async (params = {}) => {
    const response = await apiClient.get('/api/admin/transactions', { params });
    return unwrapApiResponse(response);
  },
};
