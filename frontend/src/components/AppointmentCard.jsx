import Card from 'react-bootstrap/Card';
import Badge from 'react-bootstrap/Badge';
import Button from 'react-bootstrap/Button';

const STATUS_LABELS = {
  pending:   { label: 'Pendiente',  bg: 'warning', text: 'dark' },
  confirmed: { label: 'Confirmado', bg: 'primary',  text: 'white' },
  cancelled: { label: 'Cancelado',  bg: 'secondary',text: 'white' },
  completed: { label: 'Completado', bg: 'success',  text: 'white' },
};

export default function AppointmentCard({ appointment, onCancel }) {
  const st = STATUS_LABELS[appointment.status] || STATUS_LABELS.pending;
  const date = new Date(appointment.date).toLocaleDateString('es-AR', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC'
  });

  return (
    <Card className="shadow-sm">
      <Card.Body>
        <div className="d-flex justify-content-between align-items-start">
          <div>
            <h6 className="mb-1 fw-bold">{appointment.service}</h6>
            <p className="mb-1 text-muted small">
              {appointment.master} &bull; {date} a las {appointment.time}
            </p>
            {appointment.notes && (
              <p className="mb-1 text-muted small fst-italic">"{appointment.notes}"</p>
            )}
            {appointment.price && (
              <span className="text-success fw-bold">${Number(appointment.price).toLocaleString('es-AR')}</span>
            )}
          </div>
          <div className="d-flex flex-column align-items-end gap-2">
            <Badge bg={st.bg} text={st.text}>{st.label}</Badge>
            {appointment.status !== 'cancelled' && appointment.status !== 'completed' && onCancel && (
              <Button variant="outline-danger" size="sm" onClick={() => onCancel(appointment.id)}>
                Cancelar
              </Button>
            )}
          </div>
        </div>
      </Card.Body>
    </Card>
  );
}
