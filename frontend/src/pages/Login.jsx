import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';
import Card from 'react-bootstrap/Card';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../services/api';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const data = await api.post('/users/login', form);
      login({ name: data.name, is_admin: data.is_admin }, data.token);
      navigate(data.is_admin ? '/admin' : '/');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="py-5" style={{ maxWidth: 460 }}>
      <Card className="shadow-sm">
        <Card.Body className="p-4">
          <h2 className="page-title mb-4">Iniciar sesión</h2>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Correo electrónico</Form.Label>
              <Form.Control
                type="email" name="email" value={form.email}
                onChange={handleChange} required placeholder="tu@correo.com"
              />
            </Form.Group>
            <Form.Group className="mb-4">
              <Form.Label>Contraseña</Form.Label>
              <Form.Control
                type="password" name="password" value={form.password}
                onChange={handleChange} required placeholder="••••••"
              />
            </Form.Group>
            <div className="d-grid">
              <Button type="submit" className="btn-gold" disabled={loading}>
                {loading ? 'Ingresando...' : 'Iniciar sesión'}
              </Button>
            </div>
          </Form>
          <p className="text-center mt-3 text-muted small">
            ¿No tenés cuenta? <Link to="/registro">Registrate</Link>
          </p>
        </Card.Body>
      </Card>
    </Container>
  );
}
