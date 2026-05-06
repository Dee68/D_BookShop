const express = require('express');
const router = express.Router();

const adminController = require('../controllers/adminController');
const dashboardController = require('../controllers/dashboardController');
const { auth, requireAdmin } = require('../middleware/authMiddleware');

// protect all admin routes
router.get('/stats', auth, requireAdmin, adminController.getStats);
router.get('/orders', auth, requireAdmin, adminController.getAllOrders);
router.get('/users', auth, requireAdmin, adminController.getAllUsers);

//analytic
router.get("/stats/sales", auth, requireAdmin, dashboardController.getSalesStats);
router.get("/stats/orders", auth, requireAdmin, dashboardController.getOrderStatusStats);
router.get("/stats/system", auth, requireAdmin, dashboardController.getSystemStats);

//orders

router.patch('/orders/:id/status', auth, requireAdmin, adminController.updateOrderStatus);

router.post('/orders/:id/cancel', auth, requireAdmin, adminController.cancelOrder);

router.patch('/users/:id/promote', auth, requireAdmin, adminController.promoteUser);

module.exports = router;