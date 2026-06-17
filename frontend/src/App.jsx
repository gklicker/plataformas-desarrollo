import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AuthProvider from './contexts/AuthContext';
import AppNavbar from './components/AppNavbar';
import { ProtectedRoute, AdminRoute } from './components/ProtectedRoute';

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Services from './pages/Services';
import Masters from './pages/Masters';
import Book from './pages/Book';
import MyAppointments from './pages/MyAppointments';
import Admin from './pages/Admin';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppNavbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/registro" element={<Register />} />
          <Route path="/servicios" element={<Services />} />
          <Route path="/maestros" element={<Masters />} />
          <Route path="/reservar" element={<ProtectedRoute><Book /></ProtectedRoute>} />
          <Route path="/mis-turnos" element={<ProtectedRoute><MyAppointments /></ProtectedRoute>} />
          <Route path="/admin" element={<AdminRoute><Admin /></AdminRoute>} />
          <Route path="*" element={<div className="text-center py-5"><h1>404 — Página no encontrada</h1></div>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
