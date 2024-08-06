import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../css/LoginPage.css';
import LoginForm from './LoginForm';
import { loginUser } from '../../api/api';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = useCallback(async (event) => {
    event.preventDefault();
    try {
      setError(null);
      await loginUser(email, password);
      navigate('/test');
    } catch (err) {
      setError(err.message);
      console.error('Login failed:', err);
    }
  }, [email, password, navigate]);

  return (
    <Container className="login-container">
      <Row className="justify-content-md-center">
        <Col>
          <h2>Belépés</h2>
          <LoginForm
            email={email}
            setEmail={setEmail}
            password={password}
            setPassword={setPassword}
            handleSubmit={handleSubmit}
          />
          {error && <p className="error">{error}</p>}
        </Col>
      </Row>
    </Container>
  );
};

export default LoginPage;