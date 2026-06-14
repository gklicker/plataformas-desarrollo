const db = require('../../db');

exports.all = async () => {
  const [rows] = await db.query(
    'SELECT id, name, description, price, duration FROM services WHERE is_active = TRUE ORDER BY name'
  );
  return rows;
};

exports.find = async (id) => {
  const [rows] = await db.query(
    'SELECT id, name, description, price, duration, is_active FROM services WHERE id = ?',
    [id]
  );
  return rows[0] || null;
};

exports.create = async ({ name, description, price, duration }) => {
  const [result] = await db.query(
    'INSERT INTO services (name, description, price, duration) VALUES (?, ?, ?, ?)',
    [name, description || null, price, duration]
  );
  return result.insertId;
};

exports.update = async ({ id, name, description, price, duration }) => {
  const [result] = await db.query(
    'UPDATE services SET name = ?, description = ?, price = ?, duration = ? WHERE id = ?',
    [name, description || null, price, duration, id]
  );
  return result.affectedRows > 0;
};

exports.deactivate = async (id) => {
  const [result] = await db.query('UPDATE services SET is_active = FALSE WHERE id = ?', [id]);
  return result.affectedRows > 0;
};
