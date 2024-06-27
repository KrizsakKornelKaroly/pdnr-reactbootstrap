import { useState, useCallback } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../css/LoginPage.css'; // Adjust the path based on your project structure
import { loginUser } from '../../api/api';
import LoginForm from './LoginForm';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = useCallback(async (event) => {
    event.preventDefault();
    setError('');
    setSuccess('');

    try {
      const data = await loginUser(email, password);
      setSuccess(data.message);
      console.log('Login successful:', data);
    } catch (error) {
      setError(error.message);
      console.error('Login failed:', error);
    }
  }, [email, password]);

  return (
    <Container>
      <Row>
        <Col>
          <h2>Login</h2>
          <LoginForm
            email={email}
            setEmail={setEmail}
            password={password}
            setPassword={setPassword}
            handleSubmit={handleSubmit}
          />
          {error && <p>{error}</p>}
          {success && <p>{success}</p>}
        </Col>
      </Row>
    </Container>
  );
};

export default LoginPage;
