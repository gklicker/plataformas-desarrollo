const db = require('../../db');
const bcrypt = require('bcrypt');

exports.create = async ({ name, email, password }) => {
  const hashed = await bcrypt.hash(password, 10);
  const [result] = await db.query(
    'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
    [name, email, hashed]
  );
  return result.insertId;
};

exports.findByEmail = async (email) => {
  const [rows] = await db.query(
    'SELECT id, name, email, password, is_admin FROM users WHERE email = ?',
    [email]
  );
  return rows[0] || null;
};

exports.all = async () => {
  const [rows] = await db.query(
    'SELECT id, name, email, is_admin, created_at FROM users ORDER BY created_at DESC'
  );
  return rows;
};

exports.remove = async (id) => {
  const [result] = await db.query('DELETE FROM users WHERE id = ?', [id]);
  return result.affectedRows > 0;
};
