import axios from 'axios';

// Local Flask API runs on port 5093. In production, we use the host domain.
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5093/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Attach JWT Token if logged in
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('mediahub_token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Catch 401 unauthorized errors to clear stale storage
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('mediahub_token');
      localStorage.removeItem('mediahub_user');
      // If we are on dashboard or settings page, redirect to login
      if (window.location.pathname.startsWith('/dashboard') || window.location.pathname.startsWith('/admin')) {
        window.location.href = '/login?expired=true';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
