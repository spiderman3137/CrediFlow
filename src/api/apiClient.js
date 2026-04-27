import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://loanmanagement-backend-production.up.railway.app';

export const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add the auth token
apiClient.interceptors.request.use(
  (config) => {
    const userStr = localStorage.getItem('crediflow_user');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        if (user && user.token) {
          config.headers.Authorization = `Bearer ${user.token}`;
        }
      } catch (err) {
        console.error('Failed to parse user from localStorage', err);
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const fileClient = axios.create({
  baseURL: BASE_URL,
});

fileClient.interceptors.request.use((config) => {
  const userStr = localStorage.getItem('crediflow_user');
  if (userStr) {
    try {
      const user = JSON.parse(userStr);
      if (user?.token) {
        config.headers.Authorization = `Bearer ${user.token}`;
      }
    } catch (error) {
      console.error('Failed to parse file client user', error);
    }
  }

  return config;
});

// Response interceptor to handle global errors like 401
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      // Optional: Handle token expiration
      // Object window isn't the best place but a quick redirect can be done 
      // if needed, or handled in AuthContext later.
    }
    return Promise.reject(error);
  }
);
