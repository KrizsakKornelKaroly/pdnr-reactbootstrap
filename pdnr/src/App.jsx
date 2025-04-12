import { lazy, Suspense } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Layout from './components/Layout';
import { useMemo } from 'react';
import LoadingSpinner from './components/LoadingSpinner';

const HomeCardComponent = lazy(() => import('./pages/home/HomeCardComponent'));

function App() {
  const serviceSystemCardData = useMemo(() => ({
    title: "SZNR v3.0",
    icon: "bi-shield-lock",
    listItems: [
      "Szolgálati Nyílvántartó Rendszer",
      "Szolgálatban töltött idő mérése",
      "Időösszesítő táblázat"
    ],
    buttonText: "Belépés"
  }), []);

  const documentManagementCardData = useMemo(() => ({
    title: "Állománydokumentáció",
    icon: "bi-file-text",
    listItems: [
      "Teljes állománylista",
      "Eltöltött idők az állományban/rangon",
      "Rendfokozatok, figyelmeztetések"
    ],
    buttonText: "Belépés"
  }), []);

  return (
    <Layout>
      <Container>
        <Row>
          <Col xs={12} md={6} className='kartyak'>
            <Suspense fallback={<LoadingSpinner />}>
              <HomeCardComponent {...serviceSystemCardData} />
            </Suspense>
          </Col>
          <Col xs={12} md={6} className='kartyak'>
            <Suspense fallback={<LoadingSpinner />}>
              <HomeCardComponent {...documentManagementCardData} />
            </Suspense>
          </Col>
        </Row>
      </Container>
    </Layout>
  );
}

export default App;