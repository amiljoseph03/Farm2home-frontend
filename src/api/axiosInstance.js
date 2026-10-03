import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api/v1',
  withCredentials: true,
});

// dynamic token interceptor - ഓരോ റിക്വസ്റ്റിലും ലേറ്റസ്റ്റ് Token അയക്കുന്നു
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      // Bearer token ചേർക്കുന്നു
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

export default API;
