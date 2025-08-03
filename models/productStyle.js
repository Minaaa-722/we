// 功能：定义盲盒款式模型，关联商品表，包含概率字段
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/db.js'); // 数据库连接

class ProductStyle extends Model {}

ProductStyle.init({
  // 款式ID（自增）
  id: {
    type: DataTypes.BIGINT.UNSIGNED,
    primaryKey: true,
    autoIncrement: true,
  },
  // 关联的商品ID
  product_id: {
    type: DataTypes.BIGINT.UNSIGNED,
    allowNull: false,
    references: {
      model: 'products', // 关联 products 表
      key: 'id',
    },
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  },
  // 款式名称（如“基础款”“隐藏款”）
  name: {
    type: DataTypes.VARCHAR(64),
    allowNull: false,
  },
  // 款式图片地址
  image: {
    type: DataTypes.VARCHAR(255),
    allowNull: true,
  },
  // 抽中概率（百分比，如 5 代表 5%）
  probability: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
}, {
  sequelize,
  modelName: 'ProductStyle',
  tableName: 'product_styles', // 数据库表名
  timestamps: true, // 自动维护 createdAt/updatedAt
});

module.exports = ProductStyle;