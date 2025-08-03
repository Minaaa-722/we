const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

// 获取所有产品数据的接口
router.get('/', productController.getAllProducts);

// 获取单个产品数据的接口（根据ID）
router.get('/:id', productController.getProductById);

module.exports = router;