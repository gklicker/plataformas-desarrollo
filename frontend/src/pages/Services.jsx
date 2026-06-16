import { useState, useEffect } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Spinner from 'react-bootstrap/Spinner';
import Alert from 'react-bootstrap/Alert';
import ServiceCard from '../components/ServiceCard';
import { api } from '../services/api';

export default function Services() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    api.get('/services')
      .then(data => setServices(data.results))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <Container className="py-5">
      <h2 className="page-title">Nuestros servicios</h2>
      {loading && <div className="text-center py-5"><Spinner animation="border" /></div>}
      {error && <Alert variant="danger">{error}</Alert>}
      <Row xs={1} sm={2} lg={3} className="g-4">
        {services.map(s => (
          <Col key={s.id}>
            <ServiceCard service={s} />
          </Col>
        ))}
      </Row>
    </Container>
  );
}
