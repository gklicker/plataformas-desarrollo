const router = require('express').Router();
const serviceController = require('../controllers/serviceController');
const { requireAdmin } = require('../middlewares/auth');

router.get('/services', serviceController.index);
router.get('/services/:id', serviceController.show);
router.post('/services', requireAdmin, serviceController.store);
router.put('/services/:id', requireAdmin, serviceController.update);
router.delete('/services/:id', requireAdmin, serviceController.destroy);

module.exports = router;
