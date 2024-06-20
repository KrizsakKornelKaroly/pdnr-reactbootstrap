import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import '../css/LoginPage.css'

const LoginPage = () => {
  const handleSubmit = (event) => {
    event.preventDefault();
  };

  return (
    <Container className="login-container">
      <Row className="justify-content-center">
        <Col xs={10} sm={8} md={6} lg={4} xl={3} className="login-box">
          <h2 className="text-center mb-4">Login</h2>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="formEmail">
              <Form.Label>Email address</Form.Label>
              <Form.Control type="email" placeholder="Enter email" required />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control type="password" placeholder="Password" required />
            </Form.Group>

            <Button variant="primary" type="submit" className="w-100">
              Sign in
            </Button>
          </Form>
          <div className="text-center mt-3">
            <a href="#!">Forgot password?</a>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default LoginPage;
