import { useState } from 'react';
import { Form, Button, Alert, Card } from 'react-bootstrap';
import { requestPassword } from '../../api/dutyApi';
import Layout from '../../components/Layout';

const RequestPasswordPage = () => {
  const [userEmail, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [variant, setVariant] = useState('danger');

  const handleRequestPassword = async (e) => {
    e.preventDefault();

    try {
      const response = await requestPassword(userEmail);
      setMessage(response);
      setVariant('success');
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
            <h2 className="fw-bold mb-0">Jelszó-emlékeztető</h2>
            <p className="text-muted">Írja be az email címét a jelszó-emlékeztető küldéséhez</p>
          </div>
          <Form onSubmit={handleRequestPassword}>
            <Form.Group controlId="formEmail" className="mb-4">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="Email cím"
                value={userEmail}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </Form.Group>
            <Button variant="primary" type="submit" className="w-100 mb-3" style={{
            }}>
              Jelszó-emlékeztető Küldése
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

export default RequestPasswordPage;

