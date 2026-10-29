import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 8000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const checkHealth = async () => {
  try {
    const response = await apiClient.get('/health');
    return response.data;
  } catch (error) {
    console.warn('API Health check could not reach backend at ' + API_BASE_URL, error.message);
    throw error;
  }
};

export const getFirms = async () => {
  try {
    const response = await apiClient.get('/firms');
    return response.data;
  } catch (error) {
    console.error('Failed to fetch firms list from backend:', error.message);
    throw error;
  }
};

export const getFirmByCode = async (code) => {
  try {
    const response = await apiClient.get(`/firms/${code}`);
    return response.data;
  } catch (error) {
    console.error(`Failed to fetch firm with code ${code}:`, error.message);
    throw error;
  }
};

export default apiClient;
