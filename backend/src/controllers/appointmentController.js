const appointmentModel = require('../models/appointmentModel');

exports.available = async (req, res) => {
  const { master_id = null, date = null } = req.query;
  if (!master_id || !date) {
    return res.status(400).json({ success: false, message: 'Se requieren master_id y date' });
  }
  try {
    const results = await appointmentModel.availableSlots({ master_id, date });
    res.json({ success: true, results });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Error al obtener los turnos disponibles' });
  }
};

exports.index = async (req, res) => {
  try {
    const results = await appointmentModel.all();
    res.json({ success: true, results });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Error al obtener los turnos' });
  }
};

exports.myAppointments = async (req, res) => {
  try {
    const results = await appointmentModel.myAppointments(req.user.id);
    res.json({ success: true, results });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Error al obtener tus turnos' });
  }
};

exports.store = async (req, res) => {
  if (!req.body) return res.status(400).json({ success: false, message: 'Petición incorrecta' });
  const { master_id = null, service_id = null, date = null, time = null, notes = null } = req.body;
  const errors = validate({ master_id, service_id, date, time });
  if (errors.length) return res.status(400).json({ success: false, message: 'Errores de validación', errors });
  try {
    const offers = await appointmentModel.masterOffersService({ master_id, service_id });
    if (!offers) {
      return res.status(400).json({ success: false, message: 'El maestro no ofrece ese servicio' });
    }
    const taken = await appointmentModel.isSlotTaken({ master_id, date, time });
    if (taken) {
      return res.status(409).json({ success: false, message: 'El turno seleccionado ya no está disponible' });
    }
    const id = await appointmentModel.create({ user_id: req.user.id, master_id, service_id, date, time, notes });
    res.json({ success: true, message: 'Turno reservado correctamente', id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Error al reservar el turno' });
  }
};

exports.cancel = async (req, res) => {
  const { id } = req.params;
  try {
    const appointment = await appointmentModel.find(id);
    if (!appointment) return res.status(404).json({ success: false, message: 'Turno no encontrado' });
    if (!req.user.is_admin && appointment.user_id !== req.user.id) {
      return res.status(403).json({ success: false, message: 'No tenés permiso para cancelar este turno' });
    }
    if (appointment.status === 'cancelled') {
      return res.status(400).json({ success: false, message: 'El turno ya está cancelado' });
    }
    await appointmentModel.cancel(id);
    res.json({ success: true, message: 'Turno cancelado correctamente' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Error al cancelar el turno' });
  }
};

exports.updateStatus = async (req, res) => {
  const { id } = req.params;
  const { status = null } = req.body || {};
  const VALID = ['pending', 'confirmed', 'cancelled', 'completed'];
  if (!status || !VALID.includes(status)) {
    return res.status(400).json({ success: false, message: `Estado no válido. Valores permitidos: ${VALID.join(', ')}` });
  }
  try {
    const updated = await appointmentModel.updateStatus({ id, status });
    if (!updated) return res.status(404).json({ success: false, message: 'Turno no encontrado' });
    res.json({ success: true, message: 'Estado del turno actualizado correctamente' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Error al actualizar el estado del turno' });
  }
};

const timeRegex = /^\d{2}:\d{2}$/;
const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
const validate = ({ master_id, service_id, date, time }) => {
  const errors = [];
  if (!master_id) errors.push('El maestro es requerido');
  if (!service_id) errors.push('El servicio es requerido');
  if (!date || !dateRegex.test(date)) errors.push('La fecha no es válida (formato: YYYY-MM-DD)');
  if (!time || !timeRegex.test(time)) errors.push('El horario no es válido (formato: HH:MM)');
  return errors;
};
