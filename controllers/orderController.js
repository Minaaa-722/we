const pool = require('../config/db'); // 导入连接池
// 工具函数：按概率抽选款式
const selectStyleByProbability = (styles) => {
  const totalProbability = styles.reduce((sum, style) => sum + style.probability, 0);
  let random = Math.floor(Math.random() * totalProbability);

  for (const style of styles) {
    if (random < style.probability) {
      return style;
    }
    random -= style.probability;
  }
  return styles[0]; // 兜底方案
};

// 创建订单（生成订单时抽选款式）
exports.createOrder = async (req, res) => {
  const {
    userId,
    productId,
    quantity,
    userName,
    address,
    number
  } = req.body;

  try {
    // 从连接池获取连接
    const connection = await pool.getConnection();
    await connection.beginTransaction();

    console.log("开始创建订单");

    // 1. 查询商品（含库存和款式）
    const [productRows] = await connection.execute(
      'SELECT * FROM products WHERE id = ? FOR UPDATE',
      [productId]
    );
    if (productRows.length === 0) {
      await connection.rollback();
      return res.status(404).json({
        error: '商品不存在',
        productId
      });
    }
    const product = productRows[0];
    const styles = product.styles;

    // 2. 库存校验（含具体缺额提示）
    if (product.remaining < quantity) {
      await connection.rollback();
      return res.status(400).json({
        error: `库存不足，当前库存${product.remaining}，需要${quantity}`,
        needed: quantity,
        available: product.remaining
      });
    }

    // 3. 按概率抽选款式
    const selectedStyles = [];
    for (let i = 0; i < quantity; i++) {
      const style = selectStyleByProbability(styles);
      selectedStyles.push(style);
    }

  

    // 4. 构建用户信息（对齐前端入参）
    const userInfo = {
      name: userName || '匿名用户',
      address: address || '',
      number: number || '',
      selected_styles:selectedStyles
       
    };

    // 5. 生成订单号 & 写入数据库
    const orderNo = `ORD${Date.now()}${Math.floor(Math.random() * 1000)}`;
    const [orderResult] = await connection.execute(
      `INSERT INTO orders (
        user_id, 
        amount, 
        quantity, 
        product_id, 
        product_styles, 
        user_info, 
        status
      ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        userId,
        product.price * quantity,
        quantity,
        productId,
        JSON.stringify(styles),
        JSON.stringify(userInfo),
        1
      ]
    );
    const orderId = orderResult.insertId;

    // 6. 扣减库存（原子操作避免超卖）
    await connection.execute(
      'UPDATE products SET remaining = remaining - ? WHERE id = ? AND remaining >= ?',
      [quantity, productId, quantity]
    );

    await connection.commit();
    // 释放连接回连接池
    connection.release();
    console.log("订单创建成功，订单号:", orderNo);
    // 7. 返回前端需要的完整数据
    res.status(201).json({
      orderId,
      orderNo,
      product: {
        id: product.id,
        name: product.name,
        price: product.price,
        
      },
      userInfo: {
        name: userInfo.name,
        address: userInfo.address,
        number: userInfo.number
      },
      selectedStyles,
      status: 1,
      totalAmount: product.price * quantity,
      quantity: quantity,
      createdAt: new Date().toISOString()
    });


  } catch (err) {
    console.error('创建订单失败:', err);
    // 细化错误响应
    if (err.code === 'ER_NO_REFERENCED_ROW_2') { 
      res.status(400).json({ 
        error: '用户信息无效，请检查 userId',
        detail: err.message 
      });
    } else {
      res.status(500).json({ 
        error: '服务器内部错误',
        detail: err.message 
      });
    }
  } 
};

// 拆盒操作（仅更新状态，展示已抽中的款式）
exports.unboxOrder = async (req, res) => {
  const { orderId } = req.params;
  try {
    const connection = await pool.getConnection();
    await connection.beginTransaction();

    // 1. 查询订单信息（包含已抽中的款式信息在 user_info 字段的 JSON 数据中）
    const [orderRows] = await connection.execute(
      'SELECT * FROM orders WHERE id = ?',
      [orderId]
    );
    if (orderRows.length === 0) {
      await connection.rollback();
      return res.status(404).json({ error: '订单不存在' });
    }
    const order = orderRows[0];
    const userInfo = order.user_info;
    const selectedStyles = userInfo.selected_styles;
    
    const orderStatus = order.status;

  

    // 2. 更新订单状态
    await connection.execute(
      'UPDATE orders SET status = 0 WHERE id = ?',
      [orderId]
    );

    await connection.commit();
    connection.release();

    res.json({
      success: true,
      openedStyles: selectedStyles
    });
  } catch (err) {
    console.error('拆盒失败:', err);
    res.status(500).json({ error: '服务器内部错误' });
  } 
};

// 新增：获取用户订单列表
exports.getUserOrders = async (req, res) => {
  const { userId } = req.params;
  console.log(`获取用户 ${userId} 的订单列表`);
  try {
    const [result] = await pool.execute(
      `SELECT id, amount, status, created_at, user_info
       FROM orders 
       WHERE user_id = ? 
       ORDER BY created_at DESC`,
      [userId]
    );
    const orders = result || [];

    if (orders.length === 0) {
      return res.status(200).json({
        hasOrders: false,
        message: '没有找到订单'
      });
    }

    const ordersWithItems = orders.map(order => {
      let userInfo = {};
      if (order.user_info) {
        try {
          userInfo = order.user_info;
        } catch (parseErr) {
          console.error('解析user_info失败:', parseErr);
          userInfo = {};
        }
      }

      return {
        ...order,
        selectedStyles: userInfo.selected_styles || [],
        statusText: order.status === 1 ? '待拆盒' : '已拆盒'
      };
    });

    res.json(ordersWithItems);
  } catch (err) {
    console.error('获取订单列表失败:', err);
    res.status(500).json({ error: '服务器内部错误' });
  } 
};

// 新增：获取订单详情
exports.getOrderById = async (req, res) => {
  const { orderId } = req.params;
  try {
    const [orderRows] = await pool.execute(
      'SELECT * FROM orders WHERE id = ?',
      [orderId]
    );

    if (orderRows.length === 0) {
      return res.status(404).json({ error: '订单不存在' });
    }

    const order = orderRows[0];
    const userInfo = order.user_info;
    const productStyles = order.product_styles;

    res.json({
      ...order,
      selectedStyles: userInfo.selected_styles || [],
      productStyles,
      statusText: order.status === 1 ? '待拆盒' : '已拆盒'
    });
  } catch (err) {
    console.error('获取订单详情失败:', err);
    res.status(500).json({ error: '服务器内部错误' });
  } 
};