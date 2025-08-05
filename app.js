require('dotenv').config();
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes'); // 修正产品路由路径
const cors = require('cors');


var app = express();

// view engine setup
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173', // 允许的前端域名
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// API路由
app.use('/', indexRouter);
app.use('/api/users', usersRouter);
app.use('/api/products', productRoutes); // 修正产品路由路径
app.use('/api/orders', orderRoutes); // 添加订单路由


// 404处理
app.use(function(req, res, next) {
  next(createError(404));
});

// 统一错误处理
app.use(function(err, req, res, next) {
  // 开发环境返回详细错误，生产环境隐藏细节
  const errorResponse = {
    code: err.status || 500,
    message: err.message || '服务器内部错误',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  };

  res.status(err.status || 500).json(errorResponse);
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`后端服务器运行在 http://localhost:${port}`);
  console.log(`允许的前端域名: ${process.env.FRONTEND_URL || 'http://localhost:5173'}`);
});

module.exports = app;
