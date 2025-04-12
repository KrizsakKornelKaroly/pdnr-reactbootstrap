import { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { checkAuth, logoutUser } from '../store/slices/authSlice';

const SESSION_CHECK_INTERVAL = 5 * 60 * 1000; // 5 minutes

export const AuthProvider = ({ children }) => {
  const dispatch = useDispatch();
  const { isAuthenticated, lastChecked } = useSelector((state) => state.auth);

  // Initial auth check
  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  // Periodic session check
  useEffect(() => {
    let intervalId;
    
    if (isAuthenticated) {
      intervalId = setInterval(() => {
        dispatch(checkAuth());
      }, SESSION_CHECK_INTERVAL);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [dispatch, isAuthenticated]);

  // Check session after tab focus
  useEffect(() => {
    const handleFocus = () => {
      if (isAuthenticated && Date.now() - lastChecked > SESSION_CHECK_INTERVAL) {
        dispatch(checkAuth());
      }
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [dispatch, isAuthenticated, lastChecked]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      dispatch(checkAuth())
        .unwrap()
        .catch((error) => {
          if (error.status === 401) {
            dispatch(logoutUser());
            window.location.href = '/belepes?session=expired';
          }
        });
    }, SESSION_CHECK_INTERVAL);
  
    return () => clearInterval(intervalId);
  }, [dispatch, isAuthenticated]);
  
  return <>{children}</>;
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

