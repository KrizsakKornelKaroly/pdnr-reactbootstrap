import React, { useState, useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const API_BASE_URL = 'http://localhost:3000/v1'; // Adjust as needed

const ProtectedPage = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/check-auth`, {
          credentials: 'include'
        });
        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
        } else {
          // If not authenticated, redirect to login
          navigate('/belepes');
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        navigate('/belepes');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [navigate]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return null; // This should not be reached due to the redirect, but just in case
  }

  return (
    <Container>
      <Row className="justify-content-md-center mt-5">
        <Col md={6}>
          <h2>Welcome, {user.username || user.email}!</h2>
          <p>This is a protected page. You can only see this if you're authenticated.</p>
        </Col>
      </Row>
    </Container>
  );
};

export default ProtectedPage;