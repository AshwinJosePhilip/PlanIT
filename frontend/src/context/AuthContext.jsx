import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import * as api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in on mount
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('userData');
    if (token && userData) {
      setIsAuthenticated(true);
      setUser(JSON.parse(userData));
    }
    setLoading(false);
  }, []);  const login = async (email, password) => {
    try {
      const response = await api.login(email, password);
      const { token, ...userData } = response;
      
      if (!token || !userData._id) {
        throw new Error('Invalid credentials');
      }

      setIsAuthenticated(true);
      setUser(userData);
      localStorage.setItem('token', token);
      localStorage.setItem('userData', JSON.stringify(userData));
      toast.success(`Welcome ${userData.name}!`);
      return true;
    } catch (error) {
      const errorMessage = error.message || 'Login failed. Please try again.';
      toast.error(errorMessage);
      console.error('Login error:', error);
      return false;
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('userData');
    toast.info('You have been logged out successfully');
  };

  if (loading) {
    return null;
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};