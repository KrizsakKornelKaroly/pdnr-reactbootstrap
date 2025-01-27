import { useCallback, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { loginUser, logoutUser, checkAuth, clearError } from '../store/slices/authSlice';

export const useAuth = () => {
  const dispatch = useDispatch();
  const { user, isAuthenticated, loading, error } = useSelector((state) => state.auth);
  const [loginLoading, setLoginLoading] = useState(false);

  const login = useCallback(async (email, password) => {
    setLoginLoading(true);
    try {
      await dispatch(loginUser({ email, password })).unwrap();
      return true;
    } catch (error) {
      return false;
    } finally {
      setLoginLoading(false);
    }
  }, [dispatch]);

  const logout = useCallback(() => {
    dispatch(logoutUser());
  }, [dispatch]);

  const refreshAuth = useCallback(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  return {
    user,
    isAuthenticated,
    loading,
    loginLoading,
    error,
    login,
    logout,
    refreshAuth,
    clearError: () => dispatch(clearError()),
  };
};

