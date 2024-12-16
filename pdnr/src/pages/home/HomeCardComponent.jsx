import PropTypes from 'prop-types';
import { Card, ListGroup } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const HomeCardComponent = ({ title, imageSrc, listItems, buttonText }) => {
  return (
    <Card className="kartya">
      <Card.Img variant="top" src={imageSrc} className='kepek' loading="lazy" />
      <Card.Body className='kartya-content'>
        <Card.Title>{title}</Card.Title>
        <ListGroup variant="flush" className="list-group">
          {listItems.map((item, index) => (
            <ListGroup.Item key={index}>{item}</ListGroup.Item>
          ))}
        </ListGroup>
        <Link to="/belepes" className="btn btn-primary" style={{ color: 'white' }}>
          {buttonText}
        </Link>
      </Card.Body>
    </Card>
  );
};
HomeCardComponent.propTypes = {
  title: PropTypes.string.isRequired,
  imageSrc: PropTypes.string.isRequired,
  listItems: PropTypes.arrayOf(PropTypes.string).isRequired,
  buttonText: PropTypes.string.isRequired,
};

export default HomeCardComponent;
