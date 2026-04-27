import { apiClient } from './apiClient';
import { unwrapApiResponse } from './responseUtils';

export const authService = {
  login: async (email, password) => {
    const response = await apiClient.post('/api/auth/login', { email, password });
    return unwrapApiResponse(response);
  },
  
  register: async (data) => {
    const response = await apiClient.post('/api/auth/register', data);
    return unwrapApiResponse(response);
  },

  refresh: async (refreshToken) => {
    const response = await apiClient.post('/api/auth/refresh', { refreshToken });
    return unwrapApiResponse(response);
  },

  getCurrentUser: async () => {
    const response = await apiClient.get('/api/auth/me');
    return unwrapApiResponse(response);
  },

  getCurrentUserWithToken: async (token) => {
    const response = await apiClient.get('/api/auth/me', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return unwrapApiResponse(response);
  },

  getOAuth2Failure: async () => {
    const response = await apiClient.get('/api/auth/oauth2/failure');
    return unwrapApiResponse(response);
  },

  logout: async () => {
    const response = await apiClient.post('/api/auth/logout');
    return unwrapApiResponse(response);
  },

  verifyEmail: async (token) => {
    const response = await apiClient.post(`/api/auth/verify-email?token=${token}`);
    return unwrapApiResponse(response);
  },

  forgotPassword: async (email) => {
    const response = await apiClient.post('/api/auth/forgot-password', { email });
    return unwrapApiResponse(response);
  },

  resetPassword: async (token, newPassword) => {
    const response = await apiClient.post('/api/auth/reset-password', { token, newPassword });
    return unwrapApiResponse(response);
  }
};
