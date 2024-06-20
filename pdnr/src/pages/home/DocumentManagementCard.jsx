import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import ListGroup from 'react-bootstrap/ListGroup';

const DocumentManagementCard = () => {
  return (
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
  );
};

export default DocumentManagementCard;
