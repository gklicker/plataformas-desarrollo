const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

require('./db');

app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ success: true, message: 'Corte & Arte API funcionando' });
});

app.use(require('./src/routes/userRoutes'));
app.use(require('./src/routes/masterRoutes'));
app.use(require('./src/routes/serviceRoutes'));
app.use(require('./src/routes/appointmentRoutes'));

app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Ruta no encontrada' });
});

app.listen(PORT, () => {
  console.log(`Servidor iniciado en http://localhost:${PORT}`);
});
