const router = require('express').Router();
const masterController = require('../controllers/masterController');
const { requireAdmin } = require('../middlewares/auth');

router.get('/masters', masterController.index);
router.get('/masters/:id', masterController.show);
router.post('/masters', requireAdmin, masterController.store);
router.put('/masters/:id', requireAdmin, masterController.update);
router.delete('/masters/:id', requireAdmin, masterController.destroy);

module.exports = router;
