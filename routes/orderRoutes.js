const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

router.post('/confirm', orderController.createOrder);         // 创建订单
router.get('/order-details/:orderId', orderController.getOrderById);    // 获取订单
router.get('/user-orders/:userId',orderController.getUserOrders);
router.post('/:orderId/unbox', orderController.unboxOrder); // 拆盒

module.exports = router;