const router = require('express').Router();
const appointmentController = require('../controllers/appointmentController');
const { requireAuth, requireAdmin } = require('../middlewares/auth');

router.get('/appointments/available', appointmentController.available);
router.get('/appointments/my', requireAuth, appointmentController.myAppointments);
router.get('/appointments', requireAdmin, appointmentController.index);
router.post('/appointments', requireAuth, appointmentController.store);
router.put('/appointments/:id/cancel', requireAuth, appointmentController.cancel);
router.put('/appointments/:id/status', requireAdmin, appointmentController.updateStatus);

module.exports = router;
