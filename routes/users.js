// users.js
var express = require('express');
var router = express.Router();
// 直接引入控制器的路由对象
const userRoutes = require('../controllers/usersController');

// 将控制器中的所有路由挂载到 /users 路径下
router.use('/', userRoutes);

// 保留原有的 GET /users 接口（如果需要）
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

module.exports = router;