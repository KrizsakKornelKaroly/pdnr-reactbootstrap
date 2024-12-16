import { useState, useEffect, createContext } from 'react';
import PropTypes from 'prop-types';
import { loginUser, logoutUser, fetchAuthStatus } from '../api/dutyApi';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthState, setIsAuthState] = useState(false);
  const [authLoading, setAuthLoading] = useState(true); // Start loading on component mount
  const [loginLoading, setLoginLoading] = useState(false);
  const [error, setError] = useState(null);

  // Use useEffect to call checkAuth once when the app starts
  useEffect(() => {
    const checkAuthenticationStatus = async () => {
      try {
        const data = await fetchAuthStatus();
        setUser(data.userData);
        setIsAuthState(data.isAuth); // Automatically sets isAuthState based on the user's data
        setError(null); // Reset error if authentication is successful
      } catch (error) {
        console.error('Auth check failed:', error);
        setIsAuthState(false);
        setError(error.message || 'Failed to authenticate.');
      } finally {
        setAuthLoading(false); // Set loading to false when finished
      }
    };

    checkAuthenticationStatus();
  }, []); // Run once when the component mounts

  const login = async (email, password) => {
    setLoginLoading(true);
    try {
      const userData = await loginUser(email, password);
      setUser(userData);
      setIsAuthState(true); // Set the user as authenticated after login
      setError(null); // Reset any previous errors
      return true;
    } catch (error) {
      console.error('Login failed:', error.message);
      setError(error.message || 'Login failed.');
      return false;
    } finally {
      setLoginLoading(false);
    }
  };

  const logout = async () => {
    try {
      await logoutUser(); // Perform API logout
      setUser(null);
      setIsAuthState(false); // Set authenticated state to false after logout
      setError(null);
    } catch (error) {
      console.error('Logout failed:', error.message);
      setError(error.message || 'Logout failed.');
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthState,
        checkAuth: fetchAuthStatus, // Provided fetchAuthStatus directly for context consumers
        login,
        logout,
        authLoading,
        loginLoading,
        error,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

