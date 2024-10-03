import {useState} from 'react';
import { Container, Form, Button, Alert, Card } from 'react-bootstrap';
import axios from 'axios';

const RequestPasswordPage = () => {

  const [userEmail, setEmail] = useState('')
  const [message, setMessage] = useState('');
  const [variant, setVariant] = useState('danger'); // For alert styling

 const handleRequestPassword = async (e) => {
  e.preventDefault();

  try {
    await axios.post('http://localhost:3000/v1/request-password-reset', {
     userEmail,
   });
   setMessage('Jelszóemlékeztető elküldve! (Spam mappát is nézze meg)');
   setVariant('success');

 } catch (error) {
   setMessage(error.response?.data || 'Something went wrong!');
   setVariant('danger');
 }
 };

  return (
    <Container className="d-flex justify-content-center align-items-center vh-100">
    <Card style={{ width: '100%', maxWidth: '400px' }} className="p-4 shadow">
      <h2 className="text-center mb-4">Kérjen jelszóemlékeztetőt</h2>
      <Form onSubmit={handleRequestPassword}>
        <Form.Group controlId="formNewPassword" className="mb-3">
          <Form.Label>Email cím</Form.Label>
          <Form.Control
            type="email"
            placeholder="Irja be email címét"
            value={userEmail}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </Form.Group>

        <Button variant="primary" type="submit" className="w-100">
          Küldés
        </Button>
      </Form>

      {message && (
        <Alert variant={variant} className="mt-3">
          {message}
        </Alert>
      )}
    </Card>
  </Container>
  )
}

export default RequestPasswordPage