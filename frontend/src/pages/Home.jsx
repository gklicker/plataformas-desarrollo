import { Link } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';

const features = [
  { icon: '💈', title: 'Maestros profesionales', desc: 'Nuestro equipo tiene años de experiencia en corte, barba y coloración.' },
  { icon: '📅', title: 'Turnos online',          desc: 'Reservá cuando quieras. Elegí maestro, servicio y horario en minutos.' },
  { icon: '✨', title: 'Calidad garantizada',    desc: 'Productos profesionales y atención personalizada en cada visita.' },
];

export default function Home() {
  return (
    <>
      <div className="hero text-center">
        <Container>
          <h1 className="hero-brand">
            Corte <span className="accent">&amp;</span> Arte
          </h1>
          <hr className="hero-divider" />
          <p className="hero-sub mb-5">
            Tu barbería de confianza — turnos online, maestros profesionales
          </p>
          <div className="d-flex justify-content-center gap-3 flex-wrap">
            <Button as={Link} to="/reservar" className="btn-gold px-4 py-2">
              Reservar turno
            </Button>
            <Button as={Link} to="/servicios" variant="outline-light" className="px-4 py-2">
              Ver servicios
            </Button>
          </div>
        </Container>
      </div>

      <hr className="section-divider" />

      <Container className="py-5">
        <Row className="g-4 text-center">
          {features.map(f => (
            <Col md={4} key={f.title}>
              <div className="p-4">
                <div className="feature-icon">{f.icon}</div>
                <h5 className="mb-2">{f.title}</h5>
                <p className="text-muted mb-0" style={{ fontSize: '0.93rem' }}>{f.desc}</p>
              </div>
            </Col>
          ))}
        </Row>
      </Container>
    </>
  );
}
