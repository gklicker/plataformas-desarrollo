const db = require('../../db');

const SLOT_START = 9;
const SLOT_END = 18;
const SLOT_INTERVAL = 30;

exports.availableSlots = async ({ master_id, date }) => {
  const [taken] = await db.query(
    "SELECT TIME_FORMAT(time, '%H:%i') AS time FROM appointments WHERE master_id = ? AND date = ? AND status != 'cancelled'",
    [master_id, date]
  );
  const takenSet = new Set(taken.map(r => r.time));
  const slots = [];
  for (let h = SLOT_START; h < SLOT_END; h++) {
    for (let m = 0; m < 60; m += SLOT_INTERVAL) {
      const label = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
      slots.push({ time: label, available: !takenSet.has(label) });
    }
  }
  return slots;
};

exports.isSlotTaken = async ({ master_id, date, time }) => {
  const [rows] = await db.query(
    "SELECT id FROM appointments WHERE master_id = ? AND date = ? AND time = ? AND status != 'cancelled'",
    [master_id, date, time]
  );
  return rows.length > 0;
};

exports.masterOffersService = async ({ master_id, service_id }) => {
  const [rows] = await db.query(
    'SELECT 1 FROM master_services WHERE master_id = ? AND service_id = ?',
    [master_id, service_id]
  );
  return rows.length > 0;
};

exports.create = async ({ user_id, master_id, service_id, date, time, notes }) => {
  const [result] = await db.query(
    'INSERT INTO appointments (user_id, master_id, service_id, date, time, notes) VALUES (?, ?, ?, ?, ?, ?)',
    [user_id, master_id, service_id, date, time, notes || null]
  );
  return result.insertId;
};

exports.all = async () => {
  const [rows] = await db.query(
    `SELECT a.id, u.name AS client, m.name AS master, s.name AS service,
            a.date, TIME_FORMAT(a.time, '%H:%i') AS time, a.status, a.notes, a.created_at
     FROM appointments a
     JOIN users u ON u.id = a.user_id
     JOIN masters m ON m.id = a.master_id
     JOIN services s ON s.id = a.service_id
     ORDER BY a.date DESC, a.time DESC`
  );
  return rows;
};

exports.myAppointments = async (user_id) => {
  const [rows] = await db.query(
    `SELECT a.id, m.name AS master, m.specialty, s.name AS service, s.price,
            a.date, TIME_FORMAT(a.time, '%H:%i') AS time, a.status, a.notes
     FROM appointments a
     JOIN masters m ON m.id = a.master_id
     JOIN services s ON s.id = a.service_id
     WHERE a.user_id = ?
     ORDER BY a.date DESC, a.time DESC`,
    [user_id]
  );
  return rows;
};

exports.find = async (id) => {
  const [rows] = await db.query('SELECT * FROM appointments WHERE id = ?', [id]);
  return rows[0] || null;
};

exports.cancel = async (id) => {
  const [result] = await db.query(
    "UPDATE appointments SET status = 'cancelled' WHERE id = ?",
    [id]
  );
  return result.affectedRows > 0;
};

exports.updateStatus = async ({ id, status }) => {
  const [result] = await db.query(
    'UPDATE appointments SET status = ? WHERE id = ?',
    [status, id]
  );
  return result.affectedRows > 0;
};
