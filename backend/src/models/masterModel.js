const db = require('../../db');

exports.all = async () => {
  const [rows] = await db.query(
    'SELECT id, name, specialty, photo_url, is_active FROM masters WHERE is_active = TRUE ORDER BY name'
  );
  return rows;
};

exports.find = async (id) => {
  const [rows] = await db.query(
    `SELECT m.id, m.name, m.specialty, m.photo_url, m.is_active,
            s.id AS service_id, s.name AS service_name, s.price, s.duration
     FROM masters m
     LEFT JOIN master_services ms ON ms.master_id = m.id
     LEFT JOIN services s ON s.id = ms.service_id AND s.is_active = TRUE
     WHERE m.id = ?`,
    [id]
  );
  if (!rows.length) return null;
  const { id: mid, name, specialty, photo_url, is_active } = rows[0];
  const services = rows
    .filter(r => r.service_id)
    .map(r => ({ id: r.service_id, name: r.service_name, price: r.price, duration: r.duration }));
  return { id: mid, name, specialty, photo_url, is_active, services };
};

exports.create = async ({ name, specialty, photo_url, service_ids = [] }) => {
  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();
    const [result] = await conn.query(
      'INSERT INTO masters (name, specialty, photo_url) VALUES (?, ?, ?)',
      [name, specialty, photo_url || null]
    );
    const masterId = result.insertId;
    if (service_ids.length) {
      const values = service_ids.map(sid => [masterId, sid]);
      await conn.query('INSERT INTO master_services (master_id, service_id) VALUES ?', [values]);
    }
    await conn.commit();
    return masterId;
  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    conn.release();
  }
};

exports.update = async ({ id, name, specialty, photo_url, service_ids }) => {
  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();
    await conn.query(
      'UPDATE masters SET name = ?, specialty = ?, photo_url = ? WHERE id = ?',
      [name, specialty, photo_url || null, id]
    );
    if (service_ids !== undefined) {
      await conn.query('DELETE FROM master_services WHERE master_id = ?', [id]);
      if (service_ids.length) {
        const values = service_ids.map(sid => [id, sid]);
        await conn.query('INSERT INTO master_services (master_id, service_id) VALUES ?', [values]);
      }
    }
    await conn.commit();
  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    conn.release();
  }
};

exports.deactivate = async (id) => {
  const [result] = await db.query('UPDATE masters SET is_active = FALSE WHERE id = ?', [id]);
  return result.affectedRows > 0;
};
