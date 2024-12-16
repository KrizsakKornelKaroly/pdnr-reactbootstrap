import React from 'react';
import { Container, Row, Col, Card, Button, ListGroup } from 'react-bootstrap';

const ServiceSystemCard = () => {
  return (
    <Container>
      <Row>
        <Col>
          <Card className="kartya">
            <Card.Img variant="top" src="/android-chrome-192x192.png" className='kepek' loading="lazy" />
            <Card.Body className='kartya-content'>
              <Card.Title>SZNR v3.0</Card.Title>
              <ListGroup variant="flush" className="list-group">
                <ListGroup.Item>Szolgálati Nyílvántartó Rendszer</ListGroup.Item>
                <ListGroup.Item>Szolgálatban töltött idő mérése</ListGroup.Item>
                <ListGroup.Item>Időösszesítő táblázat</ListGroup.Item>
              </ListGroup>
              <Button variant="primary">Belépés</Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default ServiceSystemCard;