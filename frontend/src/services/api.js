import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';
export const AUTH_TOKEN_KEY = 'vinay_agri_auth_token_v1';

/**
 * Storage helpers for the application JWT token.
 * Note on security trade-offs:
 * - The backend currently issues JWTs via JSON response bodies.
 * - Storing the JWT in localStorage enables session persistence across page reloads in the SPA.
 * - If the backend is later upgraded to issue HttpOnly, Secure cookies, this layer can be adapted
 *   to rely on credentials without touching localStorage.
 */
export const getStoredToken = () => {
  try {
    return localStorage.getItem(AUTH_TOKEN_KEY);
  } catch (e) {
    console.warn('Could not read auth token from localStorage:', e);
    return null;
  }
};

export const setStoredToken = (token) => {
  try {
    if (token) {
      localStorage.setItem(AUTH_TOKEN_KEY, token);
    } else {
      localStorage.removeItem(AUTH_TOKEN_KEY);
    }
  } catch (e) {
    console.warn('Could not persist auth token to localStorage:', e);
  }
};

export const removeStoredToken = () => {
  try {
    localStorage.removeItem(AUTH_TOKEN_KEY);
  } catch (e) {
    console.warn('Could not remove auth token from localStorage:', e);
  }
};

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Attach application JWT if present
apiClient.interceptors.request.use(
  (config) => {
    const token = getStoredToken();
    if (token && !config.headers.Authorization) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Clean up token on unauthorized/forbidden when accessing auth endpoints
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      if (error.config?.url?.includes('/auth/me')) {
        removeStoredToken();
      }
    }
    return Promise.reject(error);
  }
);

// =============================================================================
// Authentication API Endpoints
// =============================================================================

/**
 * Exchange Google ID token for application JWT and user profile.
 * @param {string} idToken Google ID token credential
 * @returns {Promise<object>} ApiResponse<AuthResponseDto>
 */
export const authenticateWithGoogle = async (idToken) => {
  try {
    const response = await apiClient.post('/auth/google', { idToken });
    return response.data;
  } catch (error) {
    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      'Google authentication failed. Please try again.';
    throw new Error(message);
  }
};

/**
 * Retrieve profile of currently authenticated customer/dealer using JWT in Authorization header.
 * @returns {Promise<object>} ApiResponse<UserResponseDto>
 */
export const getCurrentUser = async () => {
  try {
    const response = await apiClient.get('/auth/me');
    return response.data;
  } catch (error) {
    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      'Session expired or invalid. Please sign in again.';
    throw new Error(message);
  }
};

// =============================================================================
// Existing Business / Catalog Endpoints
// =============================================================================

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

export const getCategories = async () => {
  try {
    const response = await apiClient.get('/categories');
    return response.data;
  } catch (error) {
    console.error('Failed to fetch categories list from backend:', error.message);
    throw error;
  }
};

export const getProducts = async (params = {}) => {
  try {
    const response = await apiClient.get('/products', { params });
    return response.data;
  } catch (error) {
    console.error('Failed to fetch products list from backend:', error.message);
    throw error;
  }
};

export default apiClient;
