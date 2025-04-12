import { useCallback, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { loginUser, logoutUser, checkAuth, clearError } from '../store/slices/authSlice';
import { stopDuty } from '../api/dutyApi';

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

  const logout = useCallback(async () => {
    try {
      // Try to stop duty if there is one, but don't let it block logout
      try {
        await stopDuty();
      } catch (dutyError) {
        // If the error is "No active duty found", we can safely ignore it
        // For any other error, we should log it but continue with logout
        if (dutyError.message !== "No active duty found") {
          console.error('Error stopping duty:', dutyError);
        }
      }

      // Always proceed with logout
      await dispatch(logoutUser()).unwrap();
      
      // Clear all auth state and redirect
      localStorage.clear();
      sessionStorage.clear();
      window.location.href = '/belepes';
    } catch (error) {
      console.error('Logout failed:', error);
      // Fallback cleanup
      localStorage.clear();
      sessionStorage.clear();
      window.location.reload();
    }
  }, [dispatch]);

  const refreshAuth = useCallback(async () => {
    try {
      const data = await dispatch(checkAuth()).unwrap();
      return data.isAuthenticated;
    } catch (error) {
      // 401 is expected for non-logged in users
      if (error?.status !== 401) {
        dispatch(logoutUser());
      }
      return false;
    }
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

