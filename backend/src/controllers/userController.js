const userModel = require('../models/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
  if (!req.body) return res.status(400).json({ success: false, message: 'Petición incorrecta' });
  const { name = null, email = null, password = null } = req.body;
  const errors = validate({ name, email, password });
  if (errors.length) return res.status(400).json({ success: false, message: 'Errores de validación', errors });
  try {
    await userModel.create({ name, email, password });
    res.json({ success: true, message: 'Usuario registrado correctamente' });
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ success: false, message: 'El correo electrónico ya está registrado' });
    }
    console.error(err);
    res.status(500).json({ success: false, message: 'Error al registrar el usuario' });
  }
};

exports.login = async (req, res) => {
  if (!req.body) return res.status(400).json({ success: false, message: 'Petición incorrecta' });
  const { email = null, password = null } = req.body;
  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Correo y contraseña son requeridos' });
  }
  try {
    const user = await userModel.findByEmail(email);
    if (!user) return res.status(401).json({ success: false, message: 'Credenciales incorrectas' });
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ success: false, message: 'Credenciales incorrectas' });
    const payload = { id: user.id, name: user.name, is_admin: user.is_admin === 1 };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '8h' });
    res.json({ success: true, message: 'Inicio de sesión exitoso', name: user.name, is_admin: user.is_admin === 1, token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Error al iniciar sesión' });
  }
};

exports.index = async (req, res) => {
  try {
    const results = await userModel.all();
    res.json({ success: true, results });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Error al obtener los usuarios' });
  }
};

exports.destroy = async (req, res) => {
  const { id } = req.params;
  try {
    const deleted = await userModel.remove(id);
    if (!deleted) return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
    res.json({ success: true, message: 'Usuario eliminado correctamente' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Error al eliminar el usuario' });
  }
};

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const validate = ({ name, email, password }) => {
  const errors = [];
  if (!name || name.trim() === '') errors.push('El nombre es requerido');
  if (!email || !emailRegex.test(email.trim())) errors.push('El correo electrónico no es válido');
  if (!password || password.length < 6) errors.push('La contraseña debe tener al menos 6 caracteres');
  return errors;
};
