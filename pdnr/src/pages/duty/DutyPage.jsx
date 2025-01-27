import { useState, useEffect, useCallback, useRef } from 'react';
import { Button, Alert, Container, Row, Col, Card } from 'react-bootstrap';
import { AlertCircle, CheckCircle } from 'lucide-react';
import { fetchLastEndedDuty, startDuty, stopDuty } from '../../api/dutyApi';
import Layout from '../../components/Layout';

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
  const afkTimeoutRef = useRef();

  const RATE_LIMIT_DELAY = 5000; // 5 seconds between actions
  const AFK_TIMEOUT = 4 * 60 * 60 * 1000; // 4 hours (for testing)

  // Function to handle duty end (both manual and automatic)
  const handleDutyEnd = useCallback(async () => {
    try {
      const data = await stopDuty();
      setIsOnDuty(false);
      setDutyStartTime(null);
      setLastEndedDutyDate(new Date());
      setTotalDutyTime(data.totalDutyTime || 0);
      setLastDutyDuration(data.lastDutyDuration || 0);
      
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    } catch (e) {
      setError(e.message);
    }
  }, []);

  // Clear AFK timeout on unmount
  useEffect(() => {
    return () => {
      if (afkTimeoutRef.current) {
        clearTimeout(afkTimeoutRef.current);
      }
    };
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
      if (action === 'start') {
        const response = await startDuty();
        if (response.success) {
          setIsOnDuty(true);
          setDutyStartTime(now);
          setElapsedTime(0);

          // Set up AFK detection
          afkTimeoutRef.current = setTimeout(() => {
            setError('A szolgálat automatikusan leállt inaktivitás miatt.');
            setIsOnDuty(false);
          }, AFK_TIMEOUT);
        }
      } else {
        await handleDutyEnd();
        if (afkTimeoutRef.current) {
          clearTimeout(afkTimeoutRef.current);
        }
      }
    } catch (e) {
      setError(`Nem sikerült ${action === 'start' ? 'elindítani' : 'leállítani'} a szolgálatot: ${e.message}`);
    }
  }, [lastActionTime, handleDutyEnd, AFK_TIMEOUT]);

  // Update elapsed time using server timestamp
  const updateElapsedTime = useCallback(() => {
    if (isOnDuty && dutyStartTime) {
      setElapsedTime(Math.floor((Date.now() - dutyStartTime) / 1000)); // Update elapsed time in seconds
      requestRef.current = requestAnimationFrame(updateElapsedTime); // Continue updating each frame
    }
  }, [isOnDuty, dutyStartTime]);

  useEffect(() => {
    if (isOnDuty && dutyStartTime) {
      requestRef.current = requestAnimationFrame(updateElapsedTime);
    }
    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [isOnDuty, dutyStartTime, updateElapsedTime]);

  useEffect(() => {
    console.log("Elapsed Time:", elapsedTime);
  }, [elapsedTime]);

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { lastEndedDutyDate, totalDutyTime, lastDutyDuration } = await fetchLastEndedDuty();
        setLastEndedDutyDate(new Date(lastEndedDutyDate));
        setTotalDutyTime(totalDutyTime);
        setLastDutyDuration(lastDutyDuration);
      } catch (e) {
        setError(e.message);
      }
    };
    fetchData();
  }, []);

  // Add beforeunload event listener to warn the user before they leave the page
  useEffect(() => {
    const handleBeforeUnload = (event) => {
      if (isOnDuty) {
        const message = 'A szolgálat még aktív. Biztos, hogy el akarja hagyni az oldalt?';
        event.returnValue = message; // Standard for most browsers
        return message; // For some browsers like older versions of Chrome
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [isOnDuty]);

  return (
    <Layout>
      <Container className="py-5">
        <Row className="justify-content-center mb-5">
          <Col lg={8} className="text-center">
            <h2 className="display-6 mb-4 fw-bold" style={{ color: '#2b95ff' }}>Szolgálat Vezérlés</h2>
            <div className="d-flex gap-3 justify-content-center">
              <Button 
                onClick={() => handleAction('start')} 
                disabled={isOnDuty} 
                variant="primary" 
                size="lg"
                className="px-4 py-2"
              >
                <i className="bi bi-play-circle me-2"></i>
                Szolgálat Indítása
              </Button>
              <Button 
                onClick={() => handleAction('stop')} 
                disabled={!isOnDuty} 
                variant="danger"
                size="lg"
                className="px-4 py-2"
              >
                <i className="bi bi-stop-circle me-2"></i>
                Szolgálat Leállítása
              </Button>
            </div>
          </Col>
        </Row>

        {isOnDuty && (
          <Row className="justify-content-center mb-4">
            <Col lg={8}>
              <Alert variant="info" className="d-flex align-items-center justify-content-center p-4">
                <CheckCircle size={24} className="me-3" />
                <span className="fs-5">Jelenleg szolgálatban: <strong>{formatTime(elapsedTime)}</strong></span>
              </Alert>
            </Col>
          </Row>
        )}

        {error && (
          <Row className="justify-content-center mb-4">
            <Col lg={8}>
              <Alert variant="danger" className="d-flex align-items-center justify-content-center p-4">
                <AlertCircle size={24} className="me-3" />
                <span className="fs-5">{error}</span>
              </Alert>
            </Col>
          </Row>
        )}

        <Row className="g-4">
          <Col lg={4}>
            <Card className="h-100 text-center p-4">
              <Card.Body>
                <div className="mb-3">
                  <i className="bi bi-clock-history fs-1 text-primary"></i>
                </div>
                <Card.Title className="mb-3">Utolsó befejezett szolgálat</Card.Title>
                <Card.Text className="fs-5">{formatDate(lastEndedDutyDate)}</Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col lg={4}>
            <Card className="h-100 text-center p-4">
              <Card.Body>
                <div className="mb-3">
                  <i className="bi bi-hourglass-split fs-1 text-primary"></i>
                </div>
                <Card.Title className="mb-3">Összes szolgálati idő</Card.Title>
                <Card.Text className="fs-5">{formatTime(totalDutyTime)}</Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col lg={4}>
            <Card className="h-100 text-center p-4">
              <Card.Body>
                <div className="mb-3">
                  <i className="bi bi-clock fs-1 text-primary"></i>
                </div>
                <Card.Title className="mb-3">Legutóbbi szolgálat hossza</Card.Title>
                <Card.Text className="fs-5">{formatTime(lastDutyDuration)}</Card.Text>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </Layout>
  );
};

export default DutyPage;
