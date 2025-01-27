import PropTypes from 'prop-types';
import { Container } from 'react-bootstrap';
import AppNavbar from './Navbar';

const Layout = ({ children }) => {
  return (
    <div className="min-vh-100 d-flex flex-column">
      <AppNavbar />
      <div className="flex-grow-1 d-flex align-items-center justify-content-center py-5">
        <Container className="px-4">
          {children}
        </Container>
      </div>
      <footer className="py-3 text-center">
        <Container>
          <p className="mb-0" style={{color: 'white'}}>&copy; {new Date().getFullYear()} PDNR-LSPD <a style={{color: 'white'}} href="mailto:arrppdnr@gmail.com">Kapcsolat</a></p>
        </Container>
      </footer>
    </div>
  );
};
Layout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Layout;

