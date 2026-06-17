import Card from 'react-bootstrap/Card';
import Badge from 'react-bootstrap/Badge';

const getIcon = (name = '') => {
  const n = name.toLowerCase();
  if (n.includes('barba') || n.includes('afeitado')) return '🪒';
  if (n.includes('color') || n.includes('mecha') || n.includes('rayito')) return '🎨';
  if (n.includes('peinado')) return '💇';
  if (n.includes('ceja') || n.includes('bigote')) return '✨';
  return '✂️';
};

export default function ServiceCard({ service }) {
  return (
    <Card className="h-100 service-card">
      <Card.Body className="d-flex flex-column p-4">
        <span className="service-icon">{getIcon(service.name)}</span>
        <Card.Title className="mb-1">{service.name}</Card.Title>
        {service.description && (
          <Card.Text className="text-muted flex-grow-1" style={{ fontSize: '0.88rem' }}>
            {service.description}
          </Card.Text>
        )}
        <div className="d-flex justify-content-between align-items-center mt-3 pt-2 border-top">
          <span className="fw-bold text-gold fs-5">
            ${Number(service.price).toLocaleString('es-AR')}
          </span>
          <Badge bg="secondary" style={{ fontWeight: 500 }}>{service.duration} min</Badge>
        </div>
      </Card.Body>
    </Card>
  );
}
