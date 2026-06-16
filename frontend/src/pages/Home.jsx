import { Link } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';

export default function Home() {
  return (
    <>
      <div className="hero text-center">
        <Container>
          <h1>✂ Corte <span className="accent">&amp;</span> Arte</h1>
          <p className="lead mb-4">Tu barbería de confianza. Turnos online, maestros profesionales.</p>
          <Button as={Link} to="/reservar" className="btn-gold me-3 px-4 py-2">
            Reservar turno
          </Button>
          <Button as={Link} to="/servicios" variant="outline-light" className="px-4 py-2">
            Ver servicios
          </Button>
        </Container>
      </div>

      <Container className="py-5">
        <Row className="g-4 text-center">
          <Col md={4}>
            <div className="p-4">
              <div className="fs-1 mb-3">💈</div>
              <h5>Maestros profesionales</h5>
              <p className="text-muted">Nuestro equipo cuenta con años de experiencia en corte, barba y coloración.</p>
            </div>
          </Col>
          <Col md={4}>
            <div className="p-4">
              <div className="fs-1 mb-3">📅</div>
              <h5>Turnos online</h5>
              <p className="text-muted">Reservá tu turno cuando quieras, elegí maestro, servicio y horario.</p>
            </div>
          </Col>
          <Col md={4}>
            <div className="p-4">
              <div className="fs-1 mb-3">⭐</div>
              <h5>Calidad garantizada</h5>
              <p className="text-muted">Usamos productos de primera calidad para que salgas satisfecho.</p>
            </div>
          </Col>
        </Row>
      </Container>
    </>
  );
}
