import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const authService = {
  login: (username, password) => api.post('/auth/login', { username, password }),
  register: (username, password) => api.post('/auth/register', { username, password }),
};

export const datasetService = {
  upload: (formData) => api.post('/datasets/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  list: () => api.get('/datasets/list'),
  preview: (filename) => api.get(`/datasets/preview/${filename}`),
  getCorrelation: (filename) => api.get(`/datasets/correlation/${filename}`),
  getDistributions: (filename) => api.get(`/datasets/distributions/${filename}`),
};

export const modelService = {
  train: (data) => api.post('/models/train', data),
  list: () => api.get('/models/list'),
  delete: (id) => api.delete(`/models/delete/${id}`),
};

export const predictService = {
  predict: (data) => api.post('/predict/', data),
  batchPredict: (formData) => api.post('/predict/batch', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  history: () => api.get('/predict/history'),
  submitFeedback: (data) => api.post('/predict/feedback', data),
};

export default api;
