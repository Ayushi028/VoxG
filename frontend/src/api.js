import axios from 'axios';

// 🔥 FIXED: Match your backend PORT 5001
const API = axios.create({ 
  baseURL: 'http://localhost:5000/api'  
});

API.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// 🔥 Response interceptor - DEBUG ALL CALLS
API.interceptors.response.use(
  (response) => {
    console.log(`✅ ${response.config.method?.toUpperCase()} ${response.config.url}: ${response.status}`);
    return response;
  },
  (error) => {
    console.error(`❌ ${error.config?.method?.toUpperCase()} ${error.config?.url}:`, error.message);
    return Promise.reject(error);
  }
);

export const api = {
  auth: {
    login: (email, password) => API.post('/auth/login', { email, password }),
    register: (email, password) => API.post('/auth/register', { email, password }),
  },
  keywords: {
    getAll: () => API.get('/keywords'),
    add: (word) => API.post('/keywords', { word }),
  },
  logs: {
    getAll: () => API.get('/logs'),
    // 🔥 FIXED: Use /logs/report endpoint + correct params
    report: (callerId, transcript) => API.post('/logs/report', { callerId, transcript }),
    purge: () => API.delete('/purge-logs'),
  },
};

export default api;