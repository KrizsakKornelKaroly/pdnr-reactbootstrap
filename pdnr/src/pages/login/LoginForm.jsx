import PropTypes from 'prop-types';
import { Form, Button } from 'react-bootstrap';

const LoginForm = ({ email, setEmail, password, setPassword, handleSubmit }) => {
  return (
    <Form className='login-form ' onSubmit={handleSubmit}>
      <Form.Group controlId="formBasicEmail">
        <Form.Label>Email cím</Form.Label>
        <Form.Control 
          type="email" 
          placeholder="Email" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)}  
        />
      </Form.Group>

      <Form.Group controlId="formBasicPassword">
        <Form.Label>Jelszó</Form.Label>
        <Form.Control 
          type="password" 
          placeholder="Jelszó" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
        />
      </Form.Group>

      <Button variant="primary" type="submit" className="w-100">
        Bejelentkezés
      </Button>
    </Form>
  );
};

LoginForm.propTypes = {
  email: PropTypes.string.isRequired,
  setEmail: PropTypes.func.isRequired,
  password: PropTypes.string.isRequired,
  setPassword: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
};

export default LoginForm;
