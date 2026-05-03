const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { auth, requireAdmin } = require('../middleware/authMiddleware');

router.post('/register', userController.registerUser);
router.post('/login', userController.loginUser);
router.get('/', auth, requireAdmin,userController.getAllUsers);
router.patch("/:id/role", auth, requireAdmin, userController.updateUserRole);
router.delete("/:id", auth, requireAdmin, userController.deleteUser);

module.exports = router;