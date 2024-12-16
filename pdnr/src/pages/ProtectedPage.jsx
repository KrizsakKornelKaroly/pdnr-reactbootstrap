import { useEffect, useContext } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext'; // Import AuthContext

const ProtectedPage = () => {
  const { isAuthState, user, loading } = useContext(AuthContext); // Get auth context data
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthState) {
      // If the user is not authenticated, redirect to login
      navigate('/belepes');
    }
  }, [isAuthState, navigate]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!isAuthState) {
    return null; // Prevent rendering of protected page until user is authenticated
  }

  return (
    <Container>
      <Row className="justify-content-md-center mt-5">
        <Col md={6}>
          <h2>Welcome, {user.username || user.email}!</h2>
          <p>This is a protected page. You can only see this if you&apos;re authenticated.</p>
        </Col>
      </Row>
    </Container>
  );
};

export default ProtectedPage;
