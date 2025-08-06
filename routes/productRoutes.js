const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

// 手动打印所有路由
console.log('注册路由：');
console.log('GET / → getAllProducts');
console.log('GET /:id → getProductById');


router.get('/', productController.getAllProducts);
router.get('/search', productController.searchProducts);

router.get('/:id', productController.getProductById);
router.get('/:id/comments',productController.getCommentsByProductId);


module.exports = router;