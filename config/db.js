const mysql = require('mysql2');

const dbConfig = {
    host: 'localhost', // 数据库主机地址，一般本地开发为 'localhost'，如果是远程数据库则填写对应的 IP 地址
    user: 'root', // 数据库用户名，这里使用 root 用户示例，实际根据你的数据库设置情况而定
    password: 'CMLcml123+', // 填写你设置的 root 用户密码
    database: 'blindbox', // 要使用的数据库名称，这里先假设创建了名为 'product_order_db' 的数据库，后续会创建
};

const connection = mysql.createConnection(dbConfig);

// 连接数据库
connection.connect((err) => {
    if (err) {
        console.error('数据库连接失败：', err);
    } else {
        console.log('数据库连接成功');
    }
});

module.exports = connection;