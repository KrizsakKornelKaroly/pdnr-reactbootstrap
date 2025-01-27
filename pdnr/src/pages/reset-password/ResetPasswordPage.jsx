import { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
  Form,
  Button,
  Alert,
  Card,
  InputGroup,
} from 'react-bootstrap';
import { Eye, EyeSlash } from 'react-bootstrap-icons';
import Layout from '../../components/Layout';
import { resetPassword } from '../../api/dutyApi';

const ResetPasswordPage = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [message, setMessage] = useState('');
  const [variant, setVariant] = useState('danger');
  const navigate = useNavigate();

  const handlePasswordReset = async (e) => {
    e.preventDefault();

    if (!token) {
      setMessage('Érvénytelen jelszó visszaállítási link.');
      setVariant('danger');
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessage('A jelszavak nem egyeznek!');
      setVariant('danger');
      return;
    }

    try {
      const response = await resetPassword(token, newPassword);
      setMessage(response.message);
      setVariant('success');

      // Only navigate if password reset was successful
      if (response.message) {
        setTimeout(() => {
          navigate('/belepes');
        }, 2000);
      }
    } catch (error) {
      setMessage(error.message);
      setVariant('danger');
    }
  };

  return (
    <Layout>
      <Card className="border-0 shadow-lg" style={{ maxWidth: '400px', margin: '0 auto' }}>
        <Card.Body className="p-5">
          <div className="text-center mb-4">
            <h2 className="fw-bold mb-0">Jelszó Visszaállítása</h2>
            <p className="text-muted">Adja meg az új jelszavát</p>
          </div>
          <Form onSubmit={handlePasswordReset}>
            <Form.Group controlId="formNewPassword" className="mb-3">
              <Form.Label>Új Jelszó</Form.Label>
              <InputGroup>
                <Form.Control
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Írja be új jelszavát"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  className="border-end-0"
                />
                <InputGroup.Text
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ cursor: 'pointer' }}
                  className="bg-white border-start-0"
                >
                  {showPassword ? <EyeSlash /> : <Eye />}
                </InputGroup.Text>
              </InputGroup>
            </Form.Group>

            <Form.Group controlId="formConfirmPassword" className="mb-4">
              <Form.Label>Jelszó megerősítése</Form.Label>
              <InputGroup>
                <Form.Control
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Erősítse meg a jelszavát"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="border-end-0"
                />
                <InputGroup.Text
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  style={{ cursor: 'pointer' }}
                  className="bg-white border-start-0"
                >
                  {showConfirmPassword ? <EyeSlash /> : <Eye />}
                </InputGroup.Text>
              </InputGroup>
            </Form.Group>

            <Button 
              variant="primary" 
              type="submit" 
              className="w-100 mb-3"
            >
              Jelszó Visszaállítása
            </Button>
          </Form>

          {message && (
            <Alert variant={variant} className="mt-3">
              {message}
            </Alert>
          )}
        </Card.Body>
      </Card>
    </Layout>
  );
};

export default ResetPasswordPage;

