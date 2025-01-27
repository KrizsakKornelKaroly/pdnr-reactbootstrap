import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import HomeCardComponent from './pages/home/HomeCardComponent';
import Layout from './components/Layout';

const serviceSystemCardData = {
  title: "SZNR v3.0",
  icon: "bi-shield-lock",
  listItems: [
    "Szolgálati Nyílvántartó Rendszer",
    "Szolgálatban töltött idő mérése",
    "Időösszesítő táblázat"
  ],
  buttonText: "Belépés"
};

const documentManagementCardData = {
  title: "Állománydokumentáció",
  icon: "bi-file-text",
  listItems: [
    "Teljes állománylista",
    "Eltöltött idők az állományban/rangon",
    "Rendfokozatok, figyelmeztetések"
  ],
  buttonText: "Belépés"
};

function App() {
  return (
    <Layout>
      <Container>
        <Row>
          <Col xs={12} md={6} className='kartyak'>
            <HomeCardComponent {...serviceSystemCardData} />
          </Col>
          <Col xs={12} md={6} className='kartyak'>
            <HomeCardComponent {...documentManagementCardData} />
          </Col>
        </Row>
      </Container>
    </Layout>
  );
}

export default App;