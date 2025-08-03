const express = require('express');
const router = express.Router();
const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// 连接池配置（保持不变）
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'CMLcml123+',
  database: 'blindbox',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

const JWT_SECRET = process.env.JWT_SECRET || 'your_secret_key';

// 新增：权限验证中间件（验证token并解析用户ID）
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // 提取 Bearer token

  if (!token) {
    return res.status(401).json({ code: 401, message: '未提供认证token' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ code: 403, message: 'token无效或已过期' });
    }
    req.user = user; // 将解析的用户信息挂载到req
    next();
  });
};

// 登录接口（保持不变）
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ 
      code: 400, 
      message: '用户名和密码为必填项' 
    });
  }

  try {
    // 使用连接池获取连接
    const [rows] = await pool.execute(
      'SELECT id, username, password FROM users WHERE username = ?',
      [username]
    );

    if (rows.length === 0) {
      return res.status(401).json({ 
        code: 401, 
        message: '用户名或密码错误' 
      });
    }

    const user = rows[0];
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ 
        code: 401, 
        message: '用户名或密码错误' 
      });
    }

    // 生成 JWT（包含用户ID和用户名）
    const token = jwt.sign(
      { userId: user.id, username: user.username },
      JWT_SECRET,
      { expiresIn: '2h' }
    );

    // 响应格式：与前端 authSlice 预期一致
    res.json({
      code: 200,
      message: '登录成功',
      data: {
        user: { 
          id: user.id, 
          username: user.username 
        },
        token: token
      }
    });

  } catch (error) {
    console.error('登录失败:', error);
    res.status(500).json({ 
      code: 500, 
      message: '服务器内部错误，请稍后重试' 
    });
  }
});

// 注册接口（保持不变）
router.post('/register', async (req, res) => {
  const { username, password } = req.body;
  
  if (!username || !password) {
    return res.status(400).json({ 
      code: 400,
      message: '用户名和密码为必填项' 
    });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // 检查用户名是否已存在
    const [existingUsers] = await pool.execute(
      'SELECT id FROM users WHERE username = ?',
      [username]
    );
    if (existingUsers.length > 0) {
      return res.status(400).json({ 
        code: 400, 
        message: '用户名已存在' 
      });
    }

    // 插入新用户
    const [result] = await pool.execute(
      'INSERT INTO users (username, password) VALUES (?, ?)',
      [username, hashedPassword]
    );

    res.json({ 
      code: 200, 
      message: '注册成功', 
      data: { userId: result.insertId } 
    });
  } catch (error) {
    console.error('注册失败:', error);
    res.status(500).json({ 
      code: 500, 
      message: '注册失败，请重试',
      error: process.env.NODE_ENV === 'development' ? error.message : ''
    });
  }
});

// 登出接口（保持不变）
router.post('/logout', (req, res) => {
  res.json({
    code: 200,
    message: '登出成功',
    data: null
  });
});

// 新增：修改用户名接口（PUT /api/users/:userId/username）
router.put('/:userId/username', authenticateToken, async (req, res) => {
  const { userId } = req.params;
  const { newUsername } = req.body;
  
  // 1. 验证参数
  if (!newUsername || newUsername.trim().length === 0) {
    return res.status(400).json({ code: 400, message: '新用户名不能为空' });
  }
  
  // 2. 验证用户权限（token中的用户ID需与路径中的userId一致）
  if (req.user.userId.toString() !== userId) {
    return res.status(403).json({ code: 403, message: '无权限修改此用户信息' });
  }

  try {
    // 3. 检查新用户名是否已被占用
    const [existingUsers] = await pool.execute(
      'SELECT id FROM users WHERE username = ?',
      [newUsername.trim()]
    );
    if (existingUsers.length > 0) {
      return res.status(400).json({ code: 400, message: '用户名已被占用' });
    }

    // 4. 更新数据库
    await pool.execute(
      'UPDATE users SET username = ? WHERE id = ?',
      [newUsername.trim(), userId]
    );

    res.json({ 
      code: 200, 
      success: true, 
      message: '用户名修改成功' 
    });

  } catch (error) {
    console.error('修改用户名失败:', error);
    res.status(500).json({ 
      code: 500, 
      message: '修改失败，请重试' 
    });
  }
});

// 新增：修改密码接口（PUT /api/users/:userId/password）
router.put('/:userId/password', authenticateToken, async (req, res) => {
  const { userId } = req.params;
  const { oldPassword, newPassword } = req.body;
  
  // 1. 验证参数
  if (!oldPassword || !newPassword) {
    return res.status(400).json({ code: 400, message: '旧密码和新密码不能为空' });
  }
  
  if (newPassword.length < 6) {
    return res.status(400).json({ code: 400, message: '新密码长度不能少于6位' });
  }

  // 2. 验证用户权限
  if (req.user.userId.toString() !== userId) {
    return res.status(403).json({ code: 403, message: '无权限修改此用户信息' });
  }

  try {
    // 3. 获取当前用户密码并验证旧密码
    const [rows] = await pool.execute(
      'SELECT password FROM users WHERE id = ?',
      [userId]
    );
    if (rows.length === 0) {
      return res.status(404).json({ code: 404, message: '用户不存在' });
    }

    const user = rows[0];
    const isOldPasswordValid = await bcrypt.compare(oldPassword, user.password);
    if (!isOldPasswordValid) {
      return res.status(400).json({ code: 400, message: '旧密码不正确' });
    }

    // 4. 加密新密码并更新数据库
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    await pool.execute(
      'UPDATE users SET password = ? WHERE id = ?',
      [hashedNewPassword, userId]
    );

    res.json({ 
      code: 200, 
      success: true, 
      message: '密码修改成功' 
    });

  } catch (error) {
    console.error('修改密码失败:', error);
    res.status(500).json({ 
      code: 500, 
      message: '修改失败，请重试' 
    });
  }
});

module.exports = router;