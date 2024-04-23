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

    <Container>
      <Row>
        <Col><Card>
            <Card.Img variant="top" src="./public/android-chrome-192x192.png" />
            <Card.Body>
              <Card.Title>SZNR v3.0</Card.Title>
              <ListGroup variant="flush">
                <ListGroup.Item>Szolgálati Nyílvántartó Rendszer v3.0</ListGroup.Item>
                <ListGroup.Item>Szolgálatban töltött idő mérése</ListGroup.Item>
                <ListGroup.Item>Időösszesítő táblázat</ListGroup.Item>
              </ListGroup>
              <Button variant="primary">Belépés</Button>
            </Card.Body>
          </Card>
      </Col>
      <Col>
      <Card>
            <Card.Img variant="top" src="./public/android-chrome-192x192.png" />
            <Card.Body>
              <Card.Title>Állománydokumentáció</Card.Title>
              <ListGroup variant="flush">
                <ListGroup.Item>Cras justo odio</ListGroup.Item>
                <ListGroup.Item>Dapibus ac facilisis in</ListGroup.Item>
                <ListGroup.Item>Vestibulum at eros</ListGroup.Item>
              </ListGroup>
              <Button variant="primary">Go somewhere</Button>
            </Card.Body>
      </Card>
      </Col>
      </Row>
      <Row>
        <Col>
        <Card>
            <Card.Img variant="top" src="./public/android-chrome-192x192.png" />
            <Card.Body>
              <Card.Title>Card Title</Card.Title>
              <Card.Text>
                Some quick example text to build on the card title and make up the
                bulk of the card's content.
              </Card.Text>
              <Button variant="primary">Go somewhere</Button>
            </Card.Body>
        </Card>
        </Col>
        <Col>
        <Card>
            <Card.Img variant="top" src="./public/android-chrome-192x192.png" />
            <Card.Body>
              <Card.Title>Card Title</Card.Title>
              <Card.Text>
                Some quick example text to build on the card title and make up the
                bulk of the card's content.
              </Card.Text>
              <Button variant="primary">Go somewhere</Button>
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
