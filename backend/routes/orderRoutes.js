const express = require('express');
const router = express.Router();
const controller = require('../controllers/orderController');
const { auth, requireAdmin } = require('../middleware/authMiddleware');

router.post('/', auth, controller.createOrder);
router.get('/:user_id', controller.getUserOrders);
router.put('/:id/cancel', auth, controller.cancelOrder);
//router.delete('/:id', controller.deleteOrder); 

module.exports = router;