import axios from 'axios';
import ENDPOINTS from '../endpoints';

const apiClient = axios.create({
  baseURL: ENDPOINTS.baseUrl, // Set your base API URL
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to conditionally add the token and custom headers
apiClient.interceptors.request.use(
  (config) => {
    // Conditionally add the token to the Authorization header
    if (config.token) {
      config.headers.Authorization = `Bearer ${config.token}`;
    }

    // Conditionally add any custom headers
    if (config.customHeaders) {
      config.headers = { ...config.headers, ...config.customHeaders };
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default apiClient;
