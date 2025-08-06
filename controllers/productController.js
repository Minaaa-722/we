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

// 新增：按名称搜索产品的接口方法
exports.searchProducts = async (req, res) => {
  // 从查询参数中获取搜索关键词

  const searchQuery = req.query.query || '';


  // 如果搜索关键词为空，返回空结果
  if (!searchQuery.trim()) {
    return res.status(200).json({
      code: 200,
      message: '搜索关键词为空',
      data: [],
      total: 0
    });
  }



  // 使用LIKE进行模糊搜索，匹配产品名称
  // 注意：不同数据库的LIKE语法可能略有不同，这里使用通用写法
  const query = 'SELECT * FROM products WHERE name LIKE ?';

  try {
    // 在搜索词前后添加%实现模糊匹配
    const [results] = await pool.query(query, [`%${searchQuery}%`]);

    console.log(`搜索结果: ${results}`);

    // 处理产品数据，与其他接口保持一致的格式
    const products = (Array.isArray(results) ? results : []).map(product => ({
      ...product,
      price: Number(product.price) || 0,
      originalPrice: Number(product.originalPrice) || 0,
      isHot: Boolean(product.isHot),
      isNew: Boolean(product.isNew),
      images: product.images || [],
      detailImages: product.detailImages || [],
      styles: product.styles || []
    }));

    res.status(200).json({
      code: 200,
      message: '产品搜索成功',
      data: products,
      total: products.length,
      searchQuery: searchQuery  // 返回搜索关键词，方便前端展示
    });
  } catch (err) {
    console.error('产品搜索失败:', err.stack);
    res.status(500).json({
      code: 500,
      message: '产品搜索失败',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};

exports.getCommentsByProductId = async (req, res) => {
  const productId = req.params.id;
  const query = 'SELECT * FROM comments WHERE product_id = ?';

  try {
    const [results] = await pool.query(query, [productId]);
    console.log(`查询评论结果: ${results[0]}`);

    res.status(200).json({
      code: 200,
      message: '评论获取成功',
      data: results
    });
  } catch (err) {
    console.error('查询评论失败:', err.stack);
    res.status(500).json({
      code: 500,
      message: '获取评论数据失败',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
}


