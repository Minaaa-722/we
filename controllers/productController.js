// 引入数据库连接池
const pool = require('../config/db');

exports.getAllProducts = async (req, res) => {
  const query = 'SELECT * FROM products';
  console.log("正在查询产品列表");

  try {
    // 对于某些数据库驱动，查询结果可能包含在数组的第一个元素中
    const [results] = await pool.query(query);

    // 确保results是数组，如果不是则初始化为空数组
    const products = (Array.isArray(results) ? results : []).map(product => ({
      ...product,
      price: Number(product.price) || 0,  // 提供默认值避免NaN
      originalPrice: Number(product.originalPrice) || 0,
      isHot: Boolean(product.isHot),
      isNew: Boolean(product.isNew),
      images: product.images || [],
      detailImages: product.detailImages || [],
      styles: product.styles || []
    }));


    res.status(200).json({
      code: 200,
      message: '产品列表获取成功',
      data: products,
      total: products.length  // 增加总数信息，方便前端分页
    });
  } catch (err) {
    console.error('查询产品失败:', err.stack);  // 输出完整错误栈
    res.status(500).json({
      code: 500,
      message: '获取产品数据失败',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined  // 开发环境返回错误详情
    });
  }
};

exports.getProductById = async (req, res) => {
  const productId = req.params.id;
  const query = 'SELECT * FROM products WHERE id = ?';
  
  try {
    const [results] = await pool.query(query, [productId]);
    
    if (results.length === 0) {
      return res.status(404).json({ 
        code: 404,
        message: '产品不存在' 
      });
    }
    
    const product = {
     ...results[0],
      price: Number(results[0].price) || 0,
      originalPrice: Number(results[0].originalPrice) || 0,
      images: results[0].images || [],
      detailImages: results[0].detailImages || [],
      styles: results[0].styles || []
    };
    
    res.status(200).json({
      code: 200,
      message: '产品获取成功',
      data: product
    });
  } catch (err) {
    console.error('查询单个产品失败:', err.stack);
    res.status(500).json({ 
      code: 500, 
      message: '获取产品数据失败',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};
    