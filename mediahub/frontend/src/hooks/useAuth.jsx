import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load auth keys on mount
    const savedToken = localStorage.getItem('mediahub_token');
    const savedUser = localStorage.getItem('mediahub_user');
    
    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const response = await api.post('/login', { email, password });
      const { token, user: userData } = response.data;
      
      localStorage.setItem('mediahub_token', token);
      localStorage.setItem('mediahub_user', JSON.stringify(userData));
      
      setToken(token);
      setUser(userData);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || 'Login failed. Please try again.'
      };
    }
  };

  const register = async (name, email, password) => {
    try {
      const response = await api.post('/register', { name, email, password });
      const { token, user: userData } = response.data;
      
      localStorage.setItem('mediahub_token', token);
      localStorage.setItem('mediahub_user', JSON.stringify(userData));
      
      setToken(token);
      setUser(userData);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || 'Registration failed. Please try again.'
      };
    }
  };

  const loginWithGoogle = async (name, email) => {
    try {
      const response = await api.post('/login/google', { name, email });
      const { token, user: userData } = response.data;
      
      localStorage.setItem('mediahub_token', token);
      localStorage.setItem('mediahub_user', JSON.stringify(userData));
      
      setToken(token);
      setUser(userData);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || 'Google login failed.'
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('mediahub_token');
    localStorage.removeItem('mediahub_user');
    setToken(null);
    setUser(null);
  };

  const upgradeSubscription = async (plan) => {
    try {
      const response = await api.post('/subscription', { plan });
      // Update local storage user profile with updated role or sub details
      // Get fresh stats or sub info
      const updatedUser = { ...user, subscription: response.data.subscription };
      // In our DB model, subscription is tracked separately.
      // We'll update the local storage copy if we want.
      return { success: true, message: response.data.message };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || 'Subscription update failed.'
      };
    }
  };

  const isAuthenticated = !!token;
  const isAdmin = user?.role === 'admin';

  const value = {
    user,
    token,
    loading,
    login,
    register,
    loginWithGoogle,
    logout,
    upgradeSubscription,
    isAuthenticated,
    isAdmin,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
