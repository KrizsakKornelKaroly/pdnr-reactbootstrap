import React from 'react';
import { Container, Row, Col, Card, Button, ListGroup } from 'react-bootstrap';

const DocumentManagementCard = () => {
  return (
    <Container>
      <Row>
        <Col>
          <Card className="kartya">
            <Card.Img variant="top" src="/android-chrome-192x192.png" className='kepek' loading="lazy" />
            <Card.Body className='kartya-content'>
              <Card.Title>Állománydokumentáció</Card.Title>
              <ListGroup variant="flush" className="list-group">
                <ListGroup.Item>Teljes állománylista</ListGroup.Item>
                <ListGroup.Item>Eltöltött idők az állományban/rangon</ListGroup.Item>
                <ListGroup.Item>Rendfokozatok, figyelmeztetések</ListGroup.Item>
              </ListGroup>
              <Button variant="primary">Belépés</Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default DocumentManagementCard;