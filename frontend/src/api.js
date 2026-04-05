import axios from 'axios';


const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';
const API = axios.create({ 
  baseURL: API_BASE  // Use variable! ✓
});
API.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});


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
   
    report: (callerId, transcript) => API.post('/logs/report', { callerId, transcript }),
    purge: () => API.delete('/purge-logs'),
  },
};

export default api;
