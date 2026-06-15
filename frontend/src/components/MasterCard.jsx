import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import { useNavigate } from 'react-router-dom';

export default function MasterCard({ master }) {
  const navigate = useNavigate();

  return (
    <Card className="h-100 shadow-sm text-center">
      <Card.Body className="d-flex flex-column">
        <div
          className="rounded-circle bg-dark d-flex align-items-center justify-content-center mx-auto mb-3"
          style={{ width: 72, height: 72, fontSize: '2rem' }}
        >
          ✂
        </div>
        <Card.Title>{master.name}</Card.Title>
        <Card.Text className="text-muted small flex-grow-1">{master.specialty}</Card.Text>
        <Button
          variant="outline-dark"
          size="sm"
          onClick={() => navigate(`/reservar?master_id=${master.id}`)}
        >
          Reservar turno
        </Button>
      </Card.Body>
    </Card>
  );
}
