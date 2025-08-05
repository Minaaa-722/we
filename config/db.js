// config/db.js
const mysql = require('mysql2/promise'); // 明确使用 Promise 版本

const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: 'CMLcml123+',
  database: 'blindbox',
  waitForConnections: true,
  connectionLimit: 10, // 连接池大小
  queueLimit: 0
};

// 创建 Promise 连接池（推荐生产环境）
const pool = mysql.createPool(dbConfig);

// 导出连接池（或按需导出单个连接）
module.exports = pool;