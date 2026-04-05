import { apiClient } from './apiClient';
import { unwrapApiResponse } from './responseUtils';

export const analyticsService = {
  getDashboard: async () => {
    const response = await apiClient.get('/api/analytics/dashboard');
    return unwrapApiResponse(response);
  },
};
