// api.ts
import axios from 'axios';

// Create an instance of Axios
const api = axios.create({
  baseURL: 'https://cc3e497d.qdhgtch.com:2345/api/v1', // Base URL for your API
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add middleware to inject authorization token in headers
api.interceptors.request.use(
  (config) => {
    const authToken = localStorage.getItem('authToken');
    if (authToken) {
      const loginInfo = JSON.parse(authToken);
      config.headers.Authorization = `${loginInfo?.data?.token_type} ${loginInfo?.data?.access_token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;