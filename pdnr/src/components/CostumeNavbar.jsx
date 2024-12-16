import { useContext, useEffect } from 'react';
import { Navbar, Nav, Button } from 'react-bootstrap';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const CustomNavbar = () => {
  const { user, checkAuth, isAuthState, login, logoutUser } = useContext(AuthContext);
  console.log(user);
  console.log("is auth", isAuthState);
  
  const handleLogout = () => {
    logoutUser();
    window.location.reload();
  };

  useEffect(() => {
    checkAuth();
  
  }, [checkAuth])
  

  return (
    <Navbar bg="light" variant="light" expand="lg" className="border border-primary">
      <Navbar.Brand href="#home" className="text-decoration-none">PDNR</Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="ml-auto d-flex align-items-center">
          {isAuthState ? (
            <>
              <Nav.Item className="mr-3">
                <span className="navbar-text">Szia, {user.icName}</span>
              </Nav.Item>
              <Button variant="outline-primary" onClick={handleLogout}>Kijelentkezés</Button>
            </>
          ) : (
            <Link to="/belepes" className="btn btn-outline-primary text-decoration-none" onClick={login}>Bejelentkezés</Link>
          )}
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default CustomNavbar;
