import React, { createContext, useState, useEffect } from "react";
import PropTypes from "prop-types";
import { loginUser, logoutUser } from "../api/dutyApi";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthState, setIsAuthState] = useState(false);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    checkAuth();
  }, []);

  const API_BASE_URL = "http://localhost:3000/v1";

  const checkAuth = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/check-auth`, {
        credentials: "include",
      });
      if (response.ok) {
        const data = await response.json();
        setUser(data.userData);
        setIsAuthState(data.isAuth);
      } else {
        setIsAuthState(false);
      }
    } catch (error) {
      console.error("Auth check failed:", error);
      setIsAuthState(false);
    }
  };

  const login = async (email, password) => {
    try {
      const userData = await loginUser(email, password);
      setUser(userData);
      setIsAuthState(true);
      return true;
    } catch (error) {
      console.error("Login failed:", error.message);
      return false;
    }
  };

  const logout = async () => {
    try {
      await logoutUser();
      setUser(null);
      setIsAuthState(false);
    } catch (error) {
      console.error("Logout failed:", error.message);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isAuthState, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
