import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import 'bootstrap/dist/css/bootstrap.min.css';
import ListGroup from 'react-bootstrap/ListGroup';

function App() {
  return (
    <>
    <h1>Üdvözöllek a PDNR v1.0 rendszerben!</h1>

    <Container>
      <Row>
        <Col className='kartyak'>
          <Card>
            <Card.Img variant="top" src="/android-chrome-192x192.png" className='kepek'/>
            <Card.Body>
              <Card.Title>SZNR v3.0</Card.Title>
              <ListGroup variant="flush">
                <ListGroup.Item>Szolgálati Nyílvántartó Rendszer</ListGroup.Item>
                <ListGroup.Item>Szolgálatban töltött idő mérése</ListGroup.Item>
                <ListGroup.Item>Időösszesítő táblázat</ListGroup.Item>
              </ListGroup>
              <Button variant="primary" className='gombok'>Belépés</Button>
            </Card.Body>
          </Card>
      </Col>
      <Col className='kartyak'>
      <Card>
            <Card.Img variant="top" src="/android-chrome-192x192.png" className='kepek'/>
            <Card.Body>
              <Card.Title>Állománydokumentáció</Card.Title>
              <ListGroup variant="flush">
                <ListGroup.Item>Teljes állománylista</ListGroup.Item>
                <ListGroup.Item>Eltöltött idők az állományban/rangon</ListGroup.Item>
                <ListGroup.Item>Rendfokozatok, figyelmeztetések</ListGroup.Item>
              </ListGroup>
              <Button variant="primary" className='gombok'>Belépés</Button>
            </Card.Body>
      </Card>
      </Col>
      </Row>

    </Container>

      {/*
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
  </p> */}
    </>
  )
}

export default App
