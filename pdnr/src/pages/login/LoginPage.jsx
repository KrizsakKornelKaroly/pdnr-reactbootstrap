import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useState } from 'react';
import { Form, Button, Alert, Card } from 'react-bootstrap';
import { useAuth } from '../../hooks/useAuth';
import Layout from '../../components/Layout';

const LoginPage = () => {
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const { login, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;

    const success = await login(email, password);
    if (success) {
      setError(null);
      const from = location.state?.from?.pathname || "/";
      navigate(from, { replace: true });
    }
    else {
      e.target.password.value = "";
      e.target.password.focus();
      setError("Hibás email cím vagy jelszó.");
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Layout>
      <div className="login-container">
        <Card className="login-card">
          <Card.Body className="p-4 p-md-5">
            <div className="text-center mb-4">
              <div className="auth-logo-wrapper mb-4">
                <i className="bi bi-shield-lock auth-icon"></i>
              </div>
              <h2 className="auth-title">Bejelentkezés</h2>
              <p className="auth-subtitle">Jelentkezzen be a fiókjába</p>
            </div>
            
            <Form onSubmit={handleSubmit}>
              <Form.Group controlId="formEmail" className="mb-3">
                <Form.Label className="auth-label">Email cím</Form.Label>
                <div className="input-group">
                  <span className="input-group-text">
                    <i className="bi bi-envelope"></i>
                  </span>
                  <Form.Control
                    type="email"
                    name="email"
                    placeholder="Írja be az email címét"
                    required
                    className="auth-input"
                  />
                </div>
              </Form.Group>

              <Form.Group controlId="formPassword" className="mb-4">
                <Form.Label className="auth-label">Jelszó</Form.Label>
                <div className="input-group">
                  <span className="input-group-text">
                    <i className="bi bi-key"></i>
                  </span>
                  <Form.Control
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Írja be a jelszavát"
                    required
                    className="auth-input"
                  />
                  <button
                    type="button"
                    className="input-group-text password-toggle"
                    onClick={togglePasswordVisibility}
                    tabIndex="-1"
                  >
                    <i className={`bi bi-eye${showPassword ? '-slash' : ''}`}></i>
                  </button>
                </div>
              </Form.Group>

              <Button 
                variant="primary" 
                type="submit" 
                className="auth-button w-100" 
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Bejelentkezés...
                  </>
                ) : (
                  <>
                    <i className="bi bi-box-arrow-in-right me-2"></i>
                    Bejelentkezés
                  </>
                )}
              </Button>
            </Form>

            {error && (
              <Alert variant="danger" className="auth-alert mt-3">
                <i className="bi bi-exclamation-circle me-2"></i>
                {error}
              </Alert>
            )}

            <div className="text-center mt-4">
              <Link to="/request-password" className="auth-link">
                <i className="bi bi-question-circle me-1"></i>
                Elfelejtette a jelszavát?
              </Link>
            </div>
          </Card.Body>
        </Card>
      </div>
    </Layout>
  );
};

export default LoginPage;

