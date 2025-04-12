import PropTypes from 'prop-types';
import '../css/LoadingSpinner.css';

const LoadingSpinner = ({ fullScreen, size = 'md', variant = 'primary' }) => {
  const sizeClasses = {
    sm: 'spinner-sm',
    md: 'spinner-md',
    lg: 'spinner-lg'
  };

  return (
    <div className={`loading-spinner ${fullScreen ? 'full-screen' : ''}`}>
      <div 
        className={`spinner-border text-${variant} ${sizeClasses[size]}`} 
        role="status"
      >
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  );
};

LoadingSpinner.propTypes = {
  fullScreen: PropTypes.bool,
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  variant: PropTypes.oneOf(['primary', 'secondary', 'success', 'danger', 'warning', 'info', 'light', 'dark'])
};

export default LoadingSpinner;