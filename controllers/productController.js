const connection = require('../config/db');

// 工具函数：校验是否为正整数
const isPositiveInteger = (value) => {
  return /^\d+$/.test(value) && Number(value) > 0;
};


exports.getAllProducts = (req, res) => {
  const query = 'SELECT * FROM products';
  connection.query(query, (err, results) => {
    if (err) {
      console.error('查询产品失败:', err);
      return res.status(500).json({ 
        code: 500, 
        message: '获取产品数据失败' 
      });
    }

    // 直接使用驱动自动解析的 JSON 字段（已转为数组/对象）
    const products = results.map(product => ({
     ...product,
      price: Number(product.price), // 仅转换数字类型
      originalPrice: Number(product.originalPrice),
      isHot: Boolean(product.isHot), // 转换布尔类型
      isNew: Boolean(product.isNew),
      // 关键：删除 JSON.parse，直接使用字段值
      images: product.images || [], 
      detailImages: product.detailImages || [],
      styles: product.styles || []
    }));

    res.status(200).json({
      code: 200,
      message: '产品列表获取成功',
      data: products
    });
  });
};

// 根据ID获取单个产品
// productController.js 中的 getProductById 方法
exports.getProductById = (req, res) => {
  const productId = req.params.id;
  const query = 'SELECT * FROM products WHERE id = ?';
  
  connection.query(query, [productId], (err, results) => {
    if (err) {
      console.error('查询单个产品失败:', err);
      return res.status(500).json({ error: '获取产品数据失败' });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: '产品不存在' });
    }

    // 关键修复：直接使用驱动自动解析的 JSON 字段，无需手动 parse
    const product = {
     ...results[0],
      price: Number(results[0].price),
      originalPrice: Number(results[0].originalPrice),
      // 移除 JSON.parse，直接赋值
      images: results[0].images || [],
      detailImages: results[0].detailImages || [],
      styles: results[0].styles || []
    };

    res.json(product);
  });
};
