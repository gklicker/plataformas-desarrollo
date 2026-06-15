import Card from 'react-bootstrap/Card';
import Badge from 'react-bootstrap/Badge';

export default function ServiceCard({ service }) {
  return (
    <Card className="h-100 shadow-sm">
      <Card.Body>
        <Card.Title>{service.name}</Card.Title>
        {service.description && (
          <Card.Text className="text-muted small">{service.description}</Card.Text>
        )}
        <div className="d-flex justify-content-between align-items-center mt-3">
          <span className="fs-5 fw-bold text-success">${Number(service.price).toLocaleString('es-AR')}</span>
          <Badge bg="secondary">{service.duration} min</Badge>
        </div>
      </Card.Body>
    </Card>
  );
}
