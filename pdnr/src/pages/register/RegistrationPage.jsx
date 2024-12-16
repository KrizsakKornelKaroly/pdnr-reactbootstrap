import { useState } from 'react';
import { Form, Button, Container, Row, Col, Alert } from 'react-bootstrap';
import { registerUser } from '../../api/dutyApi';
import 'bootstrap/dist/css/bootstrap.min.css';

const RegistrationPage = () => {
  const [formData, setFormData] = useState({
    ic_name: '',
    steam_name: '',
    dc_name: '',
    email: '',
    password: '',
    otpCode: ''
  });

  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      await registerUser(
        formData.ic_name,
        formData.steam_name,
        formData.dc_name,
        formData.email,
        formData.password,
        formData.otpCode
      );
      setSuccess('Registration successful!');
    } catch (err) {
      if (err.response && err.response.data && err.response.data.error) {
        setError(err.response.data.error);
      } else {
        setError(err.message);
      }
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
      <Row className="w-100">
        <Col md={{ span: 6, offset: 3 }}>
          <div style={{ backgroundColor: '#f8f9fa', padding: '20px', borderRadius: '10px' }}>
            <h1 className="text-center">Register</h1>
            <Form onSubmit={handleSubmit}>
              <Form.Group controlId="formICName">
                <Form.Label>IC Name</Form.Label>
                <Form.Control
                  type="text"
                  name="ic_name"
                  value={formData.ic_name}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
              <Form.Group controlId="formSteamName">
                <Form.Label>Steam Name</Form.Label>
                <Form.Control
                  type="text"
                  name="steam_name"
                  value={formData.steam_name}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
              <Form.Group controlId="formDCName">
                <Form.Label>Discord Name</Form.Label>
                <Form.Control
                  type="text"
                  name="dc_name"
                  value={formData.dc_name}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
              <Form.Group controlId="formEmail">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
              <Form.Group controlId="formPassword">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
              <Form.Group controlId="formOTPCode">
                <Form.Label>OTP Code</Form.Label>
                <Form.Control
                  type="text"
                  name="otpCode"
                  value={formData.otpCode}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
              <Button variant="primary" type="submit" block>
                Register
              </Button>
            </Form>
            {error && <Alert variant="danger" className="mt-3">{error}</Alert>}
            {success && <Alert variant="success" className="mt-3">{success}</Alert>}
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default RegistrationPage;