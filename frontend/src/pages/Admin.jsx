import { useState, useEffect } from 'react';
import Container from 'react-bootstrap/Container';
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Alert from 'react-bootstrap/Alert';
import Badge from 'react-bootstrap/Badge';
import { api } from '../services/api';

const STATUS_LABELS = {
  pending: 'Pendiente', confirmed: 'Confirmado',
  cancelled: 'Cancelado', completed: 'Completado',
};

// ── Masters ──────────────────────────────────────────────────────────────────
function MastersTab() {
  const [masters, setMasters] = useState([]);
  const [show, setShow] = useState(false);
  const [form, setForm] = useState({ name: '', specialty: '' });
  const [error, setError] = useState(null);

  const load = () => api.get('/masters').then(d => setMasters(d.results));
  useEffect(() => { load(); }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      await api.post('/masters', form);
      setShow(false);
      setForm({ name: '', specialty: '' });
      load();
    } catch (err) { setError(err.message); }
  };

  const handleDeactivate = async (id) => {
    if (!confirm('¿Desactivar este maestro?')) return;
    await api.delete(`/masters/${id}`);
    load();
  };

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5 className="mb-0">Maestros</h5>
        <Button className="btn-gold" size="sm" onClick={() => setShow(true)}>+ Agregar maestro</Button>
      </div>
      <Table hover responsive>
        <thead className="table-dark">
          <tr><th>Nombre</th><th>Especialidad</th><th>Estado</th><th></th></tr>
        </thead>
        <tbody>
          {masters.map(m => (
            <tr key={m.id}>
              <td>{m.name}</td>
              <td>{m.specialty}</td>
              <td><Badge bg={m.is_active ? 'success' : 'secondary'}>{m.is_active ? 'Activo' : 'Inactivo'}</Badge></td>
              <td>
                {m.is_active && (
                  <Button variant="outline-danger" size="sm" onClick={() => handleDeactivate(m.id)}>Desactivar</Button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={show} onHide={() => setShow(false)}>
        <Modal.Header closeButton><Modal.Title>Nuevo maestro</Modal.Title></Modal.Header>
        <Form onSubmit={handleSave}>
          <Modal.Body>
            {error && <Alert variant="danger">{error}</Alert>}
            <Form.Group className="mb-3">
              <Form.Label>Nombre</Form.Label>
              <Form.Control value={form.name} onChange={e => setForm(f => ({...f, name: e.target.value}))} required />
            </Form.Group>
            <Form.Group>
              <Form.Label>Especialidad</Form.Label>
              <Form.Control value={form.specialty} onChange={e => setForm(f => ({...f, specialty: e.target.value}))} required />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShow(false)}>Cancelar</Button>
            <Button type="submit" className="btn-gold">Guardar</Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  );
}

// ── Services ─────────────────────────────────────────────────────────────────
function ServicesTab() {
  const [services, setServices] = useState([]);
  const [show, setShow] = useState(false);
  const [form, setForm] = useState({ name: '', description: '', price: '', duration: '' });
  const [error, setError] = useState(null);

  const load = () => api.get('/services').then(d => setServices(d.results));
  useEffect(() => { load(); }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      await api.post('/services', { ...form, price: Number(form.price), duration: Number(form.duration) });
      setShow(false);
      setForm({ name: '', description: '', price: '', duration: '' });
      load();
    } catch (err) { setError(err.message); }
  };

  const handleDeactivate = async (id) => {
    if (!confirm('¿Desactivar este servicio?')) return;
    await api.delete(`/services/${id}`);
    load();
  };

  const set = (field, value) => setForm(f => ({ ...f, [field]: value }));

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5 className="mb-0">Servicios</h5>
        <Button className="btn-gold" size="sm" onClick={() => setShow(true)}>+ Agregar servicio</Button>
      </div>
      <Table hover responsive>
        <thead className="table-dark">
          <tr><th>Nombre</th><th>Precio</th><th>Duración</th><th></th></tr>
        </thead>
        <tbody>
          {services.map(s => (
            <tr key={s.id}>
              <td>{s.name}</td>
              <td>${Number(s.price).toLocaleString('es-AR')}</td>
              <td>{s.duration} min</td>
              <td>
                <Button variant="outline-danger" size="sm" onClick={() => handleDeactivate(s.id)}>Desactivar</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={show} onHide={() => setShow(false)}>
        <Modal.Header closeButton><Modal.Title>Nuevo servicio</Modal.Title></Modal.Header>
        <Form onSubmit={handleSave}>
          <Modal.Body>
            {error && <Alert variant="danger">{error}</Alert>}
            <Form.Group className="mb-3">
              <Form.Label>Nombre</Form.Label>
              <Form.Control value={form.name} onChange={e => set('name', e.target.value)} required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Descripción</Form.Label>
              <Form.Control as="textarea" rows={2} value={form.description} onChange={e => set('description', e.target.value)} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Precio ($)</Form.Label>
              <Form.Control type="number" min="0" step="0.01" value={form.price} onChange={e => set('price', e.target.value)} required />
            </Form.Group>
            <Form.Group>
              <Form.Label>Duración (min)</Form.Label>
              <Form.Control type="number" min="1" value={form.duration} onChange={e => set('duration', e.target.value)} required />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShow(false)}>Cancelar</Button>
            <Button type="submit" className="btn-gold">Guardar</Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  );
}

// ── Appointments ──────────────────────────────────────────────────────────────
function AppointmentsTab() {
  const [appointments, setAppointments] = useState([]);

  const load = () => api.get('/appointments').then(d => setAppointments(d.results));
  useEffect(() => { load(); }, []);

  const handleStatus = async (id, status) => {
    await api.put(`/appointments/${id}/status`, { status });
    load();
  };

  const ST_BADGE = { pending: 'warning', confirmed: 'primary', cancelled: 'secondary', completed: 'success' };

  return (
    <>
      <h5 className="mb-3">Todos los turnos</h5>
      <Table hover responsive>
        <thead className="table-dark">
          <tr><th>Cliente</th><th>Maestro</th><th>Servicio</th><th>Fecha</th><th>Hora</th><th>Estado</th><th></th></tr>
        </thead>
        <tbody>
          {appointments.map(a => (
            <tr key={a.id}>
              <td>{a.client}</td>
              <td>{a.master}</td>
              <td>{a.service}</td>
              <td>{new Date(a.date).toLocaleDateString('es-AR', { timeZone: 'UTC' })}</td>
              <td>{a.time}</td>
              <td><Badge bg={ST_BADGE[a.status]}>{STATUS_LABELS[a.status]}</Badge></td>
              <td>
                <Form.Select size="sm" value={a.status} onChange={e => handleStatus(a.id, e.target.value)} style={{ minWidth: 130 }}>
                  {Object.entries(STATUS_LABELS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                </Form.Select>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────
export default function Admin() {
  return (
    <Container className="py-5">
      <h2 className="page-title">Panel de administración</h2>
      <Tabs defaultActiveKey="appointments" className="mb-4">
        <Tab eventKey="appointments" title="Turnos">
          <AppointmentsTab />
        </Tab>
        <Tab eventKey="masters" title="Maestros">
          <MastersTab />
        </Tab>
        <Tab eventKey="services" title="Servicios">
          <ServicesTab />
        </Tab>
      </Tabs>
    </Container>
  );
}
