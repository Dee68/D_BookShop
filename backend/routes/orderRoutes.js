const express = require('express');
const router = express.Router();
const controller = require('../controllers/orderController');
const { auth, requireAdmin } = require('../middleware/authMiddleware');

router.post('/', auth, controller.createOrder);
router.get('/', auth, controller.getOrders);
router.get("/:id", auth, controller.getOrderById);
//router.get('/', auth, requireAdmin, controller.getAllOrders);
router.put('/:id/cancel', auth, controller.cancelOrder);
router.patch("/:id/status", auth, requireAdmin, controller.updateStatus);
//router.delete('/:id', controller.deleteOrder); 

module.exports = router;