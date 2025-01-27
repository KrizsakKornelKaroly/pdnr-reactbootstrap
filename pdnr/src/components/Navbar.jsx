import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const AppNavbar = () => {
  const { logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    logout();
    navigate('/belepes');
  };

  return (
    <Navbar 
      expand="lg" 
      className="navbar-glass"
    >
      <Container>
        <Navbar.Brand as={Link} to="/" className="d-flex align-items-center">
          <img
            src="/android-chrome-192x192.png"
            width="32"
            height="32"
            className="d-inline-block align-top me-2"
            alt="Logo"
          />
          <span className="brand-text-span">PDNR</span>
        </Navbar.Brand>
        <Navbar.Toggle 
          aria-controls="basic-navbar-nav"
          className="custom-toggler"
        />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            {isAuthenticated && (
              <Nav.Link as={Link} to="/duty" className="nav-link-custom">
                <i className="bi bi-clock me-2"></i>
                Duty
              </Nav.Link>
            )}
          </Nav>
          {isAuthenticated && (
            <Button 
              onClick={handleLogout}
              variant="outline-light"
              className="nav-button"
            >
              <i className="bi bi-box-arrow-right me-2"></i>
              Kijelentkezés
            </Button>
          )}
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default AppNavbar;

