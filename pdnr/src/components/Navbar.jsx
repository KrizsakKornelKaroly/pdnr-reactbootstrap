import { Navbar, Nav, Container, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useEffect, useState } from "react";
import LoadingSpinner from "./LoadingSpinner.jsx";
import LazyLoad from "react-lazyload";

const AppNavbar = () => {
  const { logout, isAuthenticated } = useAuth();

  const handleLogout = async () => {
    logout();
  };

  const [isPreloading, setIsPreloading] = useState(false);

  useEffect(() => {
    const preloadRoutes = async () => {
      setIsPreloading(true);
      try {
        if (isAuthenticated) {
          await import("../pages/duty/DutyPage.jsx");
        }
        await import("../pages/login/LoginPage.jsx");
      } finally {
        setIsPreloading(false);
      }
    };
    preloadRoutes();
  }, [isAuthenticated]);

  // Add loading indicator in Navbar
  {
    isPreloading && (
      <div className="navbar-preloader">
        <LoadingSpinner size="sm" variant="primary" />
      </div>
    );
  }

  return (
    <Navbar expand="lg" className="navbar-glass">
      <Container>
        <Navbar.Brand as={Link} to="/" className="d-flex align-items-center">
          <LazyLoad
            once
            offset={100}
            placeholder={<div className="logo-placeholder" />}
          >
            <img
              src="/android-chrome-192x192.png"
              width="32"
              height="32"
              className="d-inline-block align-top me-2"
              loading="lazy"
              alt="Logo"
            />
          </LazyLoad>
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
