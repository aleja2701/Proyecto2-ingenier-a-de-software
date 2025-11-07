import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Servicios para Pacientes
export const patientService = {
  getAll: () => api.get('/patients/'),
  getById: (id: string) => api.get(`/patients/${id}/`),
  create: (data: any) => api.post('/patients/', data),
  update: (id: string, data: any) => api.put(`/patients/${id}/`, data),
  delete: (id: string) => api.delete(`/patients/${id}/`),
};

// Servicios para Especialistas
export const specialistService = {
  getAll: () => api.get('/specialists/'),
  getById: (id: string) => api.get(`/specialists/${id}/`),
  create: (data: any) => api.post('/specialists/', data),
  update: (id: string, data: any) => api.put(`/specialists/${id}/`, data),
  delete: (id: string) => api.delete(`/specialists/${id}/`),
};

// Servicios para Resultados
export const resultService = {
  getAll: () => api.get('/results/'),
  getById: (id: string) => api.get(`/results/${id}/`),
  create: (data: any) => api.post('/results/', data),
  update: (id: string, data: any) => api.put(`/results/${id}/`, data),
  delete: (id: string) => api.delete(`/results/${id}/`),
  getByAdmissionCode: (code: string) => api.get(`/results/?admission_code=${code}`),
};