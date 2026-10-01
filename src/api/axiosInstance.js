import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: ലോഗിൻ ചെയ്ത ശേഷം ബാക്കെൻഡിലേക്ക് പോകുന്ന എല്ലാ റിക്വസ്റ്റിലും JWT Token സ്വയം ചേർക്കാൻ
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

export default API;
