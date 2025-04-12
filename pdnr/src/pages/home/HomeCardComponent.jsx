import { useMemo } from 'react';
import PropTypes from "prop-types";
import { Card, ListGroup } from "react-bootstrap";
import { Link } from "react-router-dom";
import LazyLoad from "react-lazyload";
import LoadingSpinner from "../../components/LoadingSpinner";

const HomeCardComponent = ({ title, listItems, buttonText }) => {
  const mappedListItems = useMemo(() => 
    listItems.map((item, index) => (
      <ListGroup.Item 
        key={index} 
        className="d-flex align-items-center border-0 ps-0 py-2"
      >
        <i className="bi bi-check-circle-fill me-3"></i>
        <span className="list-item-text">{item}</span>
      </ListGroup.Item>
    )),
    [listItems]
  );

  return (
    <Card className="home-card h-100">
      <Card.Body className="d-flex flex-column p-4">
        <div className="card-header-wrapper mb-4 d-flex justify-content-between align-items-start">
          <Card.Title className="card-title mb-2">{title}</Card.Title>
          <div className="icon-circle mb-3">
            <LazyLoad
              height={80}
              offset={100}
              placeholder={<LoadingSpinner size="sm" />}
            >
              <img
                src="/android-chrome-192x192.png"
                alt="icon"
                width="80"
                height="80"
                loading="lazy"
                srcSet="/android-chrome-192x192.png 192w, /android-chrome-512x512.png 512w"
                sizes="80px"
              />
            </LazyLoad>
          </div>
        </div>

        <ListGroup variant="flush" className="card-list flex-grow-1 mb-4">
          {mappedListItems}
        </ListGroup>

        <Link
          to="/belepes"
          className="card-button d-flex align-items-center justify-content-center gap-2 mt-auto"
        >
          <span>{buttonText}</span>
          <i className="bi bi-arrow-right-circle-fill"></i>
        </Link>
      </Card.Body>
    </Card>
  );
};

HomeCardComponent.propTypes = {
  title: PropTypes.string.isRequired,
  icon: PropTypes.string.isRequired,
  listItems: PropTypes.arrayOf(PropTypes.string).isRequired,
  buttonText: PropTypes.string.isRequired,
};

export default HomeCardComponent;
