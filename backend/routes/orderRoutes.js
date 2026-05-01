const express = require('express');
const router = express.Router();
const controller = require('../controllers/orderController');

router.post('/', controller.createOrder);
router.get('/:user_id', controller.getUserOrders);
router.put('/:id/cancel', controller.cancelOrder);
//router.delete('/:id', controller.deleteOrder); 

module.exports = router;