const masterModel = require('../models/masterModel');

exports.index = async (req, res) => {
  try {
    const results = await masterModel.all();
    res.json({ success: true, results });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Error al obtener los maestros' });
  }
};

exports.show = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await masterModel.find(id);
    if (!result) return res.status(404).json({ success: false, message: 'Maestro no encontrado' });
    res.json({ success: true, result });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Error al obtener el maestro' });
  }
};

exports.store = async (req, res) => {
  if (!req.body) return res.status(400).json({ success: false, message: 'Petición incorrecta' });
  const { name = null, specialty = null, photo_url = null, service_ids = [] } = req.body;
  const errors = validate({ name, specialty });
  if (errors.length) return res.status(400).json({ success: false, message: 'Errores de validación', errors });
  try {
    const id = await masterModel.create({ name, specialty, photo_url, service_ids });
    res.json({ success: true, message: 'Maestro creado correctamente', id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Error al crear el maestro' });
  }
};

exports.update = async (req, res) => {
  const { id } = req.params;
  if (!req.body) return res.status(400).json({ success: false, message: 'Petición incorrecta' });
  const { name = null, specialty = null, photo_url = null, service_ids } = req.body;
  const errors = validate({ name, specialty });
  if (errors.length) return res.status(400).json({ success: false, message: 'Errores de validación', errors });
  try {
    await masterModel.update({ id, name, specialty, photo_url, service_ids });
    res.json({ success: true, message: 'Maestro actualizado correctamente' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Error al actualizar el maestro' });
  }
};

exports.destroy = async (req, res) => {
  const { id } = req.params;
  try {
    const deactivated = await masterModel.deactivate(id);
    if (!deactivated) return res.status(404).json({ success: false, message: 'Maestro no encontrado' });
    res.json({ success: true, message: 'Maestro desactivado correctamente' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Error al desactivar el maestro' });
  }
};

const validate = ({ name, specialty }) => {
  const errors = [];
  if (!name || name.trim() === '') errors.push('El nombre es requerido');
  if (!specialty || specialty.trim() === '') errors.push('La especialidad es requerida');
  return errors;
};
