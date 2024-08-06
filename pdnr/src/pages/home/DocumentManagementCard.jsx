import React from 'react';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import ListGroup from 'react-bootstrap/ListGroup';

const DocumentManagementCard = () => {
  return (
    <Card className="kartya">
      <Card.Img variant="top" src="/android-chrome-192x192.png" className='kepek'/>
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
  );
};

export default DocumentManagementCard;
