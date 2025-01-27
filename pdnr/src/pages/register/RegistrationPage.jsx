import { useState } from 'react';
import { Form, Button, Alert, Card } from 'react-bootstrap';
import { registerUser } from '../../api/dutyApi';
import Layout from '../../components/Layout';

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
    <Layout>
      <Card className="border-0 shadow-lg" style={{ maxWidth: '500px', margin: '0 auto' }}>
        <Card.Body className="p-5">
          <div className="text-center mb-4">
            <h2 className="fw-bold mb-0">Regisztráció</h2>
          </div>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formICName" className="mb-3">
              <Form.Label>IC Név</Form.Label>
              <Form.Control
                type="text"
                name="ic_name"
                value={formData.ic_name}
                onChange={handleChange}
                required
                placeholder="pl. John Doe"
              />
            </Form.Group>
            <Form.Group controlId="formSteamName" className="mb-3">
              <Form.Label>Steam ID</Form.Label>
              <Form.Control
                type="text"
                name="steam_name"
                value={formData.steam_name}
                onChange={handleChange}
                required
                placeholder="pl. steam:123456789"
              />
            </Form.Group>
            <Form.Group controlId="formDCName" className="mb-3">
              <Form.Label>Discord Név</Form.Label>
              <Form.Control
                type="text"
                name="dc_name"
                value={formData.dc_name}
                onChange={handleChange}
                required
                placeholder="pl. JohnDoe"
              />
            </Form.Group>
            <Form.Group controlId="formEmail" className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="pl. jhondoe@example.com"
              />
            </Form.Group>
            <Form.Group controlId="formPassword" className="mb-3">
              <Form.Label>Jelszó</Form.Label>
              <Form.Control
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="Kis és nagybetű, Min. 8 karakter, Speciális karakter, Szám"
              />
            </Form.Group>
            <Form.Group controlId="formOTPCode" className="mb-4">
              <Form.Label>OTP Kód</Form.Label>
              <Form.Control
                type="text"
                name="otpCode"
                value={formData.otpCode}
                onChange={handleChange}
                required
                placeholder="6 jegyű szám amit kaptál tőlünk"
              />
            </Form.Group>
            <Button variant="primary" type="submit" className="w-100 mb-3" style={{
              background: 'linear-gradient(to right,#64b5f6,rgb(46, 136, 209))',
              border: 'none',
            }}>
              Regisztrálok
            </Button>
          </Form>
          {error && <Alert variant="danger" className="mt-3">{error}</Alert>}
          {success && <Alert variant="success" className="mt-3">{success}</Alert>}
        </Card.Body>
      </Card>
    </Layout>
  );
};

export default RegistrationPage;