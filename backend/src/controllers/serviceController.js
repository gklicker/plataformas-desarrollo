const serviceModel = require('../models/serviceModel');

exports.index = async (req, res) => {
  try {
    const results = await serviceModel.all();
    res.json({ success: true, results });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Error al obtener los servicios' });
  }
};

exports.show = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await serviceModel.find(id);
    if (!result) return res.status(404).json({ success: false, message: 'Servicio no encontrado' });
    res.json({ success: true, result });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Error al obtener el servicio' });
  }
};

exports.store = async (req, res) => {
  if (!req.body) return res.status(400).json({ success: false, message: 'Petición incorrecta' });
  const { name = null, description = null, price = null, duration = null } = req.body;
  const errors = validate({ name, price, duration });
  if (errors.length) return res.status(400).json({ success: false, message: 'Errores de validación', errors });
  try {
    const id = await serviceModel.create({ name, description, price, duration });
    res.json({ success: true, message: 'Servicio creado correctamente', id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Error al crear el servicio' });
  }
};

exports.update = async (req, res) => {
  const { id } = req.params;
  if (!req.body) return res.status(400).json({ success: false, message: 'Petición incorrecta' });
  const { name = null, description = null, price = null, duration = null } = req.body;
  const errors = validate({ name, price, duration });
  if (errors.length) return res.status(400).json({ success: false, message: 'Errores de validación', errors });
  try {
    const updated = await serviceModel.update({ id, name, description, price, duration });
    if (!updated) return res.status(404).json({ success: false, message: 'Servicio no encontrado' });
    res.json({ success: true, message: 'Servicio actualizado correctamente' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Error al actualizar el servicio' });
  }
};

exports.destroy = async (req, res) => {
  const { id } = req.params;
  try {
    const deactivated = await serviceModel.deactivate(id);
    if (!deactivated) return res.status(404).json({ success: false, message: 'Servicio no encontrado' });
    res.json({ success: true, message: 'Servicio desactivado correctamente' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Error al desactivar el servicio' });
  }
};

const validate = ({ name, price, duration }) => {
  const errors = [];
  if (!name || name.trim() === '') errors.push('El nombre es requerido');
  if (price === null || isNaN(price) || price < 0) errors.push('El precio no es válido');
  if (duration === null || isNaN(duration) || duration <= 0) errors.push('La duración no es válida');
  return errors;
};
