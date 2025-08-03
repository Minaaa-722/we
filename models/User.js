// models/User.js（原生 MySQL 驱动版）
const connection = require('../config/db'); // 引入数据库连接

class User {
  constructor(data) {
    this.id = data.id;
    this.username = data.username;
    this.password = data.password;
    this.created_at = data.created_at;
  }

  // 示例：查询所有用户
  static getAll(callback) {
    const query = 'SELECT * FROM users';
    connection.query(query, (err, results) => {
      if (err) return callback(err);
      const users = results.map(row => new User(row));
      callback(null, users);
    });
  }

  // 示例：根据 ID 查询用户
  static getById(id, callback) {
    const query = 'SELECT * FROM users WHERE id =?';
    connection.query(query, [id], (err, results) => {
      if (err) return callback(err);
      if (results.length === 0) return callback(new Error('User not found'));
      callback(null, new User(results[0]));
    });
  }

  // 示例：创建用户（需自行实现参数校验）
  static create(data, callback) {
    const { username, password } = data;
    const query = 'INSERT INTO users (username, password) VALUES (?,?)';
    connection.query(query, [username, password], (err, result) => {
      if (err) return callback(err);
      // 返回插入后的用户信息（含自增 ID）
      this.getById(result.insertId, callback);
    });
  }
}

module.exports = User;