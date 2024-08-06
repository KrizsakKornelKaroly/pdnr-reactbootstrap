import React, { createContext, useState, useEffect } from 'react';
import { loginUser, logoutUser } from '../api/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthState, setIsAuthState] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const API_BASE_URL = "http://localhost:3000/v1"

  const checkAuth = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/check-auth`, { 
        credentials: 'include' 
      });
      if (response.ok) {
        const data = await response.json();
        setUser(data.userData);
        setIsAuthState(data.isAuth);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
    }
    setLoading(false);
  };

  const login = async (email, password) => {
    try {
      const userData = await loginUser(email, password);
      setUser(userData);
      return true;
    } catch (error) {
      console.error('Login failed:', error.message);
      return false;
    }
  };

  const logout = async () => {
    try {
      await logoutUser();
      setUser(null);
    } catch (error) {
      console.error('Logout failed:', error.message);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};