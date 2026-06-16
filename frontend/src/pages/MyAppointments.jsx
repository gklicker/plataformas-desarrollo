import { useState, useEffect } from 'react';
import Container from 'react-bootstrap/Container';
import Alert from 'react-bootstrap/Alert';
import Spinner from 'react-bootstrap/Spinner';
import Stack from 'react-bootstrap/Stack';
import AppointmentCard from '../components/AppointmentCard';
import { api } from '../services/api';

export default function MyAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = () => {
    setLoading(true);
    api.get('/appointments/my')
      .then(d => setAppointments(d.results))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const handleCancel = async (id) => {
    if (!confirm('¿Cancelar este turno?')) return;
    try {
      await api.put(`/appointments/${id}/cancel`);
      load();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <Container className="py-5" style={{ maxWidth: 700 }}>
      <h2 className="page-title">Mis turnos</h2>
      {loading && <div className="text-center py-5"><Spinner animation="border" /></div>}
      {error && <Alert variant="danger">{error}</Alert>}
      {!loading && !error && appointments.length === 0 && (
        <Alert variant="info">No tenés turnos reservados aún.</Alert>
      )}
      <Stack gap={3}>
        {appointments.map(a => (
          <AppointmentCard key={a.id} appointment={a} onCancel={handleCancel} />
        ))}
      </Stack>
    </Container>
  );
}
