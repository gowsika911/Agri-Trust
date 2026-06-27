import axios from 'axios';

// Base URL for all API calls
const API = axios.create({
  baseURL: 'http://localhost:5000/api',
});

// Automatically add token to every request
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ── Auth APIs ──────────────────────────────
export const registerUser = (data) => API.post('/auth/register', data);
export const loginUser = (data) => API.post('/auth/login', data);
export const getProfile = () => API.get('/auth/profile');

// ── Crop APIs ──────────────────────────────
export const createCrop = (data) => API.post('/crops', data);
export const getAllCrops = () => API.get('/crops');
export const getMyCrops = () => API.get('/crops/my-crops');
export const getCropById = (id) => API.get(`/crops/${id}`);

// ── Supply Chain APIs ──────────────────────
export const getSupplyChain = (cropId) => API.get(`/supply/${cropId}`);
export const getSupplyChainSummary = (cropId) => API.get(`/supply/${cropId}/summary`);
export const addSupplyChainStep = (cropId, data) => API.put(`/supply/${cropId}/add-step`, data);
export const updateCropStatus = (cropId, data) => API.put(`/supply/${cropId}/status`, data);