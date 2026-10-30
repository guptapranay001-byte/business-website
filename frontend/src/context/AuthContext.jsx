import React, { useState, useEffect, useCallback } from 'react';
import { AuthContext } from './AuthContextDef';
import {
  authenticateWithGoogle,
  getCurrentUser,
  getStoredToken,
  setStoredToken,
  removeStoredToken,
} from '../services/api';

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => getStoredToken());
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Restore session from localStorage on application load
  useEffect(() => {
    let isSubscribed = true;

    async function restoreSession() {
      const storedToken = getStoredToken();
      if (!storedToken) {
        if (isSubscribed) {
          setIsLoading(false);
        }
        return;
      }

      try {
        const response = await getCurrentUser();
        if (isSubscribed && response?.data) {
          setUser(response.data);
          setToken(storedToken);
        }
      } catch (err) {
        console.warn('Session restoration failed or token expired:', err.message);
        if (isSubscribed) {
          removeStoredToken();
          setUser(null);
          setToken(null);
        }
      } finally {
        if (isSubscribed) {
          setIsLoading(false);
        }
      }
    }

    restoreSession();

    return () => {
      isSubscribed = false;
    };
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  /**
   * Authenticate using Google ID Token credential
   * @param {string} idToken Google ID token
   */
  const loginWithGoogle = useCallback(async (idToken) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await authenticateWithGoogle(idToken);
      const authData = response?.data;

      if (authData?.token && authData?.user) {
        setStoredToken(authData.token);
        setToken(authData.token);
        setUser(authData.user);
        return authData;
      } else {
        throw new Error('Authentication response was incomplete.');
      }
    } catch (err) {
      const message = err.message || 'Google authentication failed';
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Sign out: clear token, user profile, and local storage
   */
  const logout = useCallback(() => {
    removeStoredToken();
    setUser(null);
    setToken(null);
    setError(null);

    // Disable Google auto-select prompt for future visits until user explicitly signs in again
    if (typeof window !== 'undefined' && window.google?.accounts?.id?.disableAutoSelect) {
      try {
        window.google.accounts.id.disableAutoSelect();
      } catch (e) {
        console.debug('Google disableAutoSelect call failed:', e);
      }
    }
  }, []);

  const value = {
    user,
    token,
    isAuthenticated: Boolean(user && token),
    isLoading,
    error,
    clearError,
    loginWithGoogle,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
