const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const productController = require('../controllers/productController');
const { auth, requireAdmin } = require('../middleware/authMiddleware');

router.post(
  '/',
  auth,
  requireAdmin,
  upload.array('images', 5),
  productController.createProduct
);
router.put('/:id', auth, requireAdmin, upload.array('images', 5),productController.updateProduct);
router.delete('/:id', auth, requireAdmin, productController.deleteProduct);

router.get('/', productController.getProducts);
router.get('/:id', productController.getProduct);

//router.put('/:id', productController.updateProduct);
//router.put('/:id', upload.array('images', 5), productController.updateProduct);
//router.delete('/:id', productController.deleteProduct);

module.exports = router;