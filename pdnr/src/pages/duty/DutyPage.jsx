import { useState, useEffect, useCallback, useRef } from 'react';
import { Button, Alert, Container, Row, Col, Card } from 'react-bootstrap';
import { AlertCircle, CheckCircle } from 'lucide-react';
import { fetchLastEndedDuty } from '../../api/dutyApi'; // Adjust the path as needed

const DutyPage = () => {
  const [isOnDuty, setIsOnDuty] = useState(false);
  const [dutyStartTime, setDutyStartTime] = useState(null);
  const [error, setError] = useState(null);
  const [lastActionTime, setLastActionTime] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [lastEndedDutyDate, setLastEndedDutyDate] = useState(null);
  const [totalDutyTime, setTotalDutyTime] = useState(0);
  const [lastDutyDuration, setLastDutyDuration] = useState(0);
  const requestRef = useRef();

  const RATE_LIMIT_DELAY = 5000; // 5 seconds between actions
  const AUTO_STOP_DURATION = 4 * 60 * 60 * 1000; // 4 hours in milliseconds

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { lastEndedDutyDate, totalDutyTime, lastDutyDuration } = await fetchLastEndedDuty();
        setLastEndedDutyDate(lastEndedDutyDate);
        setTotalDutyTime(totalDutyTime);
        setLastDutyDuration(lastDutyDuration);
      } catch (e) {
        setError(e.message);
      }
    };

    fetchData();
  }, []);

  const handleAction = useCallback(async (action) => {
    const now = Date.now();
    if (now - lastActionTime < RATE_LIMIT_DELAY) {
      setError('Kérjük, várjon, mielőtt újabb műveletet végezne.');
      return;
    }

    setLastActionTime(now);
    setError(null);

    try {
      const response = await fetch(`http://localhost:3000/v1/${action}Duty`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include' // Include cookies in the request
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      
      if (action === 'start') {
        setIsOnDuty(true);
        setDutyStartTime(now);
        setElapsedTime(0); // Az eltelt idő visszaállítása
      } else {
        setIsOnDuty(false);
        setDutyStartTime(null);
        const { lastEndedDutyDate, totalDutyTime, lastDutyDuration } = await fetchLastEndedDuty(); // Fetch the last ended duty date after stopping
        setLastEndedDutyDate(lastEndedDutyDate);
        setTotalDutyTime(totalDutyTime);
        setLastDutyDuration(lastDutyDuration);
      }
    } catch (e) {
      setError(`Nem sikerült ${action} szolgálat: ${e.message}`);
    }
  }, [lastActionTime]);

  const startDuty = () => handleAction('start');
  const stopDuty = useCallback(() => handleAction('stop'), [handleAction]);

  const saveCurrentTimeAndStopDuty = useCallback(() => {
    if (isOnDuty) {
      handleAction('stop');
    }
  }, [isOnDuty, handleAction]);

  useEffect(() => {
    let timer;
    if (isOnDuty && dutyStartTime) {
      timer = setTimeout(() => {
        stopDuty();
        setError(`A szolgálat automatikusan leállt ${AUTO_STOP_DURATION / 3600000} óra után.`);
      }, AUTO_STOP_DURATION);
    }
    return () => clearTimeout(timer);
  }, [isOnDuty, dutyStartTime, stopDuty, AUTO_STOP_DURATION]);

  useEffect(() => {
    const handleBeforeUnload = (event) => {
      saveCurrentTimeAndStopDuty();
      event.preventDefault();
      event.returnValue = ''; // Required for Chrome to show the confirmation dialog
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [saveCurrentTimeAndStopDuty]);

  const updateElapsedTime = useCallback(() => {
    if (isOnDuty && dutyStartTime) {
      setElapsedTime(Date.now() - dutyStartTime);
      requestRef.current = requestAnimationFrame(updateElapsedTime);
    }
  }, [isOnDuty, dutyStartTime]);

  useEffect(() => {
    if (isOnDuty && dutyStartTime) {
      requestRef.current = requestAnimationFrame(updateElapsedTime);
    }
    return () => cancelAnimationFrame(requestRef.current);
  }, [isOnDuty, dutyStartTime, updateElapsedTime]);

  const formatTime = (milliseconds) => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const formatDate = (date) => {
    if (!date) return 'N/A';
    return date.toLocaleDateString('hu-HU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  return (
    <Container className="p-4">
      <h2 className="mb-4">Szolgálat Vezérlés</h2>
      <Row className="mb-3">
        <Col>
          <Button 
            onClick={startDuty} 
            disabled={isOnDuty} 
            variant="success" 
            className="me-2"
          >
            Szolgálat Indítása
          </Button>
          <Button 
            onClick={stopDuty} 
            disabled={!isOnDuty} 
            variant="danger"
          >
            Szolgálat Leállítása
          </Button>
        </Col>
      </Row>
      {isOnDuty && (
        <Row className="mb-3">
          <Col>
            <Alert variant="info" className="d-flex align-items-center">
              <CheckCircle className="me-2" />
              Jelenleg szolgálatban: {formatTime(elapsedTime)}
            </Alert>
          </Col>
        </Row>
      )}
      {error && (
        <Row>
          <Col>
            <Alert variant="warning" className="d-flex align-items-center">
              <AlertCircle className="me-2" />
              {error}
            </Alert>
          </Col>
        </Row>
      )}
      <Row>
        <Col md={4}>
          <Card className="mb-3">
            <Card.Body>
              <Card.Title>Utolsó befejezett szolgálat</Card.Title>
              <Card.Text>{formatDate(lastEndedDutyDate)}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="mb-3">
            <Card.Body>
              <Card.Title>Összes szolgálati idő</Card.Title>
              <Card.Text>{formatTime(totalDutyTime * 1000)}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="mb-3">
            <Card.Body>
              <Card.Title>Utolsó szolgálati időtartam</Card.Title>
              <Card.Text>{formatTime(lastDutyDuration * 1000)}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default DutyPage;