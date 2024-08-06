import React from 'react';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import ListGroup from 'react-bootstrap/ListGroup';

const ServiceSystemCard = () => {
  return (
    <Card className="kartya">
      <Card.Img variant="top" src="/android-chrome-192x192.png" className='kepek'/>
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
  );
};

export default ServiceSystemCard;
