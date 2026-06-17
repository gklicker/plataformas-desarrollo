import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import { useNavigate } from 'react-router-dom';

const initials = (name) =>
  name.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase();

export default function MasterCard({ master }) {
  const navigate = useNavigate();

  return (
    <Card className="h-100 text-center">
      <Card.Body className="d-flex flex-column p-4">
        <div className="master-avatar">{initials(master.name)}</div>
        <Card.Title className="mb-1">{master.name}</Card.Title>
        <Card.Text className="text-muted flex-grow-1" style={{ fontSize: '0.88rem' }}>
          {master.specialty}
        </Card.Text>
        <Button
          className="btn-gold mt-2"
          size="sm"
          onClick={() => navigate(`/reservar?master_id=${master.id}`)}
        >
          Reservar turno
        </Button>
      </Card.Body>
    </Card>
  );
}
