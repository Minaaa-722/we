// 引入通用请求工具request.js（路径根据实际项目结构调整）
import request from '../utils/request';

// 订单相关API方法
const orderAPI = {
  // 创建订单
  createOrder: async (orderData) => {
    return await request.post('/orders/confirm', orderData);
  },
  
  // 根据ID获取订单详情
  getOrderById: async (orderId) => {
    return await request.get(`/orders/order-details/${orderId}`);
  },
  
  // 拆盒操作
  unboxOrder: async (orderId) => {
    return await request.post(`/orders/${orderId}/unbox`);
  },
  
  // 获取用户的所有订单
  getUserOrders: async (userId) => {
    return await request.get(`/orders/user-orders/${userId}`);
  },

  // 评论
  addComment: async (orderId,commentData) => {
    return await request.post(`/orders/comment/${orderId}`,commentData);
  }
  
};

export default orderAPI;