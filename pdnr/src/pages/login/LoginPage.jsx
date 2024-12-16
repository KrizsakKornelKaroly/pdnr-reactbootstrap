import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Button, Container, Card, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { loginUser } from '../../api/dutyApi';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null); // Fix for error handling
  const navigate = useNavigate();

  const handleSubmit = useCallback(async (event) => {
    event.preventDefault();
    try {
      setError(null); // Clear previous errors
      await loginUser(email, password); // Call login API
      navigate('/duty'); // Redirect on success
    } catch (err) {
      setError( err?.message || 'Login failed!'); // Capture error
      console.error('Login failed:', err);
    }
  }, [email, password, navigate]);

  return (
    <Container className="d-flex justify-content-center align-items-center vh-100">
      <Card style={{ width: '100%', maxWidth: '400px' }} className="p-4 shadow">
        <h2 className="text-center mb-4">Bejelentkezés</h2>

        {/* Show an error alert if login fails */}
        {error && (
          <Alert variant="danger" className="text-center">
            {error}
          </Alert>
        )}

        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="formBasicEmail" className="mb-3">
            <Form.Label>Email cím</Form.Label>
            <Form.Control 
              type="email" 
              placeholder="Email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required
            />
          </Form.Group>

          <Form.Group controlId="formBasicPassword" className="mb-3">
            <Form.Label>Jelszó</Form.Label>
            <Form.Control 
              type="password" 
              placeholder="Jelszó" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required
            />
          </Form.Group>

          <div className="text-end mb-3">
            <Link to='/request-password'>Elfelejtettem a jelszavam</Link>
          </div>

          <Button variant="primary" type="submit" className="w-100">
            Bejelentkezés
          </Button>
        </Form>
      </Card>
    </Container>
  );
};

export default LoginForm;
