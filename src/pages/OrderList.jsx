import React, { useEffect, useState } from'react';
import { useNavigate } from'react-router-dom';
import { useSelector } from'react-redux';
import axios from 'axios';
import '../styles/orderList.css';

const OrderList = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const userId = user?.id;
  const [orders, setOrders] = useState([]);
  
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrders = async () => {
      if (!userId) {
        setError('无法获取用户信息，请先登录');
        setIsLoading(false);
        return;
      }
      try {
        setIsLoading(true);
        const backendUrl = 'http://localhost:3000';
        const token = localStorage.getItem('userToken');

        // 获取用户订单列表
        const response = await axios.get(
          `${backendUrl}/api/orders/user-orders/${userId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        
        const orderData = Array.isArray(response.data) ? response.data : [];
        
        setOrders(orderData);
        console.log(orderData); // 检查订单数据
        
        
        
        setError('');
      } catch (err) {
        console.error('获取订单列表失败:', err);
        setError(err.response?.data?.message || '获取订单列表失败，请稍后重试');
      } finally {
        setIsLoading(false);
      }
    };

    // // 获取订单评论状态的函数
    // const fetchCommentStatuses = async (orders, backendUrl, token) => {
    //   const statusMap = {};
      
    //   for (const order of orders) {
    //     try {
    //       // 假设后端有一个检查订单是否已评论的接口
    //       const response = await axios.get(
    //         `${backendUrl}/api/comments/check/${order.id}`,
    //         { headers: { Authorization: `Bearer ${token}` } }
    //       );
    //       statusMap[order.id] = response.data.hasComment;
    //     } catch (err) {
    //       console.error(`获取订单 ${order.id} 的评论状态失败:`, err);
    //       statusMap[order.id] = false; // 默认未评论
    //     }
    //   }
      
    //   setCommentStatus(statusMap);
    // };

    fetchOrders();
  }, [userId]);

  // 点击订单跳转到订单详情页
  const handleOrderClick = (orderId) => {
    navigate(`/order-details/${orderId}`);
  };

  // 跳转到评论页面
  const handleCommentClick = (orderId) => {
    navigate(`/comment/${orderId}`);
  };

  // 返回上一页
  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className="order-list-page">
      {isLoading && (
        <div className="loading-overlay">
          <div className="loading-spinner"></div>
          <p>正在加载订单列表，请稍候...</p>
        </div>
      )}
      {error && (
        <div className="error-message">
          <p>{error}</p>
          <button onClick={() => window.location.reload()}>重试</button>
        </div>
      )}
      {!isLoading &&!error && orders.length === 0 && (
        <div className="no-orders-message">
          <p>暂无订单，快去选购心仪的商品吧！</p>
          <button onClick={() => navigate('/')} className="go-shopping-btn">
            去购物
          </button>
          <button className="back-btn" onClick={handleGoBack}>
            返回
          </button>
        </div>
      )}
      {!isLoading &&!error && orders.length > 0 && (
        <>
          <h2 className="order-list-title">我的订单列表</h2>
          <button className="back-btn" onClick={handleGoBack}>
            返回
          </button>
          <table className="order-table">
            <thead>
              <tr>
                <th className="order-table-header">状态</th>
                <th className="order-table-header">总金额</th>
                <th className="order-table-header">创建时间</th>
                <th className="order-table-header">评论状态</th>
                <th className="order-table-header">操作</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} className="order-table-row">
                  <td className="order-table-cell">
                    {order.status === 1? '待拆盒' : '已拆盒'}
                  </td>
                  <td className="order-table-cell">¥{order.amount}</td>
                  <td className="order-table-cell">
                    {new Date(order.created_at).toLocaleString()}
                  </td>
                  <td className="order-table-cell">
                    {order.hasComments===true? (
                      <span className="comment-status commented">已评论</span>
                    ) : (
                      <span className="comment-status not-commented">未评论</span>
                    )}
                  </td>
                  <td className="order-table-cell">
                    <button
                      onClick={() => handleOrderClick(order.id)}
                      className="order-table-button"
                    >
                      查看详情
                    </button>
                    {/* 只有已拆盒且未评论的订单才显示"去评论"按钮 */}
                    {
                      <button
                        onClick={() => handleCommentClick(order.id)}
                        className="order-table-button comment-button"
                        disabled={order.hasComments === true}
                      >
                        去评论
                      </button>
                    }
                    
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
};

export default OrderList;
