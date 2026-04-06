import { apiClient } from './apiClient';
import { unwrapApiResponse } from './responseUtils';

export const riskService = {
  getUserRiskScore: async (userId) => {
    const response = await apiClient.get(`/api/risk/users/${userId}`);
    return unwrapApiResponse(response);
  },
};
