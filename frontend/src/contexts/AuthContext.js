// src/contexts/AuthContext.jsx - FIXED
import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const login = async (email, password) => {
    try {
      console.log('🔐 Attempting login:', email); // 👈 DEBUG
      
      const response = await api.auth.login(email, password); // 👈 Axios response
      const data = response.data; // 👈 EXTRACT .data
      
      console.log('✅ Login response:', data); // 👈 DEBUG
      
      if (data.success) {
        localStorage.setItem('token', data.token);
        setUser({ email: data.user.email });
        return { success: true };
      }
      return { success: false, error: data.error || 'Invalid credentials' };
    } catch (error) {
      console.error('❌ Login error:', error.response?.data || error.message);
      return { 
        success: false, 
        error: error.response?.data?.error || 'Network error' 
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};