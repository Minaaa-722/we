const mysql = require('mysql2/promise');

// 使用你修改后的配置
const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: 'CMLcml123+', // 替换为你的密码
  database: 'blindbox'
};

// 测试连接
async function testConnection() {
  try {
    const connection = await mysql.createConnection(dbConfig);
    console.log('数据库连接成功！');
    connection.end();
  } catch (error) {
    console.error('连接失败:', error);
  }
}

testConnection();
