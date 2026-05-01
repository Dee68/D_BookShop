const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const productController = require('../controllers/productController');

router.get('/', productController.getProducts);
router.get('/:id', productController.getProduct);
//router.post('/', productController.createProduct);
// multiple images upload
router.post('/', upload.array('images', 5), productController.createProduct);
//router.put('/:id', productController.updateProduct);
router.put('/:id', upload.array('images', 5), productController.updateProduct);
router.delete('/:id', productController.deleteProduct);

module.exports = router;