import { apiClient } from './apiClient';
import { unwrapApiResponse } from './responseUtils';

export const adminService = {
  getOverview: async () => {
    const response = await apiClient.get('/api/admin/overview');
    return unwrapApiResponse(response);
  },
};
