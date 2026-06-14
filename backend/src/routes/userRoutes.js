const router = require('express').Router();
const userController = require('../controllers/userController');
const { requireAdmin } = require('../middlewares/auth');

router.post('/users/register', userController.register);
router.post('/users/login', userController.login);
router.get('/users', requireAdmin, userController.index);
router.delete('/users/:id', requireAdmin, userController.destroy);

module.exports = router;
