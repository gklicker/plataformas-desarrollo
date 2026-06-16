import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Spinner from 'react-bootstrap/Spinner';
import { api } from '../services/api';

export default function Book() {
  const [params] = useSearchParams();
  const navigate = useNavigate();

  const [masters, setMasters] = useState([]);
  const [masterServices, setMasterServices] = useState([]);
  const [slots, setSlots] = useState([]);

  const [form, setForm] = useState({
    master_id: params.get('master_id') || '',
    service_id: '',
    date: '',
    time: '',
    notes: '',
  });

  const [loadingSlots, setLoadingSlots] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    api.get('/masters').then(d => setMasters(d.results));
  }, []);

  useEffect(() => {
    if (!form.master_id) { setMasterServices([]); return; }
    api.get(`/masters/${form.master_id}`)
      .then(d => setMasterServices(d.result.services));
  }, [form.master_id]);

  useEffect(() => {
    if (!form.master_id || !form.date) { setSlots([]); return; }
    setLoadingSlots(true);
    api.get(`/appointments/available?master_id=${form.master_id}&date=${form.date}`)
      .then(d => setSlots(d.results))
      .finally(() => setLoadingSlots(false));
  }, [form.master_id, form.date]);

  const set = (field, value) => setForm(f => ({ ...f, [field]: value, ...(field === 'master_id' ? { service_id: '', time: '' } : {}), ...(field === 'date' ? { time: '' } : {}) }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await api.post('/appointments', {
        master_id: Number(form.master_id),
        service_id: Number(form.service_id),
        date: form.date,
        time: form.time,
        notes: form.notes || undefined,
      });
      setSuccess(true);
      setTimeout(() => navigate('/mis-turnos'), 1500);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <Container className="py-5" style={{ maxWidth: 600 }}>
      <h2 className="page-title">Reservar turno</h2>
      {success && <Alert variant="success">¡Turno reservado! Redirigiendo...</Alert>}
      {error && <Alert variant="danger">{error}</Alert>}

      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Maestro</Form.Label>
          <Form.Select value={form.master_id} onChange={e => set('master_id', e.target.value)} required>
            <option value="">Seleccioná un maestro</option>
            {masters.map(m => <option key={m.id} value={m.id}>{m.name} — {m.specialty}</option>)}
          </Form.Select>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Servicio</Form.Label>
          <Form.Select value={form.service_id} onChange={e => set('service_id', e.target.value)} required disabled={!form.master_id}>
            <option value="">Seleccioná un servicio</option>
            {masterServices.map(s => (
              <option key={s.id} value={s.id}>{s.name} — ${Number(s.price).toLocaleString('es-AR')} ({s.duration} min)</option>
            ))}
          </Form.Select>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Fecha</Form.Label>
          <Form.Control
            type="date" value={form.date} min={today}
            onChange={e => set('date', e.target.value)} required disabled={!form.master_id}
          />
        </Form.Group>

        {form.master_id && form.date && (
          <Form.Group className="mb-3">
            <Form.Label>Horario disponible</Form.Label>
            {loadingSlots ? (
              <div><Spinner size="sm" /> Cargando turnos...</div>
            ) : (
              <Row xs={3} sm={4} className="g-2 mt-1">
                {slots.map(slot => (
                  <Col key={slot.time}>
                    <Button
                      variant={form.time === slot.time ? 'dark' : 'outline-secondary'}
                      className="slot-btn w-100"
                      disabled={!slot.available}
                      onClick={() => set('time', slot.time)}
                      type="button"
                    >
                      {slot.time}
                    </Button>
                  </Col>
                ))}
              </Row>
            )}
          </Form.Group>
        )}

        <Form.Group className="mb-4">
          <Form.Label>Notas <span className="text-muted small">(opcional)</span></Form.Label>
          <Form.Control
            as="textarea" rows={2} value={form.notes}
            onChange={e => set('notes', e.target.value)}
            placeholder="Alguna indicación especial para el maestro"
          />
        </Form.Group>

        <div className="d-grid">
          <Button type="submit" className="btn-gold" disabled={submitting || !form.time}>
            {submitting ? 'Reservando...' : 'Confirmar turno'}
          </Button>
        </div>
      </Form>
    </Container>
  );
}
