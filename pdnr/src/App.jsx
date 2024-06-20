import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import ServiceSystemCard from './pages/home/ServiceSystemCard';
import DocumentManagementCard from './pages/home/DocumentManagementCard';

function App() {
  return (
    <>
      <h1 className='welcome'>Üdvözöllek a PDNR v1.0 rendszerben!</h1>

      <Container>
        <Row>
          <Col className='kartyak'>
            <ServiceSystemCard />
          </Col>
          <Col className='kartyak'>
            <DocumentManagementCard />
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default App;
