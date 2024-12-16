import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import HomeCardComponent from './pages/home/HomeCardComponent';

const serviceSystemCardData = {
  title: "SZNR v3.0",
  imageSrc: "/android-chrome-192x192.png",
  listItems: [
    "Szolgálati Nyílvántartó Rendszer",
    "Szolgálatban töltött idő mérése",
    "Időösszesítő táblázat"
  ],
  buttonText: "Belépés"
};

const documentManagementCardData = {
  title: "Állománydokumentáció",
  imageSrc: "/android-chrome-192x192.png",
  listItems: [
    "Teljes állománylista",
    "Eltöltött idők az állományban/rangon",
    "Rendfokozatok, figyelmeztetések"
  ],
  buttonText: "Belépés"
};

function App() {
  return (
    <>
      <h1 className='welcome'>Üdvözöllek a PDNR v1.0 rendszerben!</h1>

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
    </>
  );
}

export default App;