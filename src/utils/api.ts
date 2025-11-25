// src/utils/api.ts
import axios from 'axios';

// Ensure this matches your backend server URL
const API_URL = 'http://localhost:5000/api';

export const api = axios.create({
  baseURL: API_URL,
});

// --- Timeline APIs ---
export const getTimeline = () => api.get('/timeline');
export const createTimelineEvent = (formData: FormData) => 
  api.post('/timeline', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
export const deleteTimelineEvent = (id: string) => api.delete(`/timeline/${id}`);

// --- Wish APIs ---
export const getWishes = () => api.get('/wishes'); // For users (only approved)
export const getAllWishes = () => api.get('/wishes/admin/all'); // For admin (all)
export const sendWish = (formData: FormData) => 
  api.post('/wishes', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
export const likeWish = (id: string) => api.put(`/wishes/${id}/like`);
export const approveWish = (id: string) => api.put(`/wishes/${id}/approve`);

// --- Mosaic APIs ---
export const saveMosaic = (imageBase64: string) => api.post('/mosaic', { imageBase64 });
export const getLatestMosaic = () => api.get('/mosaic');