const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const { auth, requireAdmin } = require('../middleware/authMiddleware');

router.get('/', categoryController.getCategories);
router.post('/', auth, requireAdmin, categoryController.addCategory);
router.get("/store", categoryController.getStoreCategories);
router.get('/:id', categoryController.getCategoryById);
router.put('/:id', auth, requireAdmin, categoryController.updateCategory);
router.delete('/:id', auth, requireAdmin, categoryController.deleteCategory);

module.exports = router;