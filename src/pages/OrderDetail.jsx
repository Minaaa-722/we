// src/pages/OrderDetail.jsx
import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchOrderById, unboxOrder } from '../store/order/orderSlice';
import '../styles/orderDetail.css';

const OrderDetail = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { current: order, loading, error } = useSelector((state) => state.order);

  useEffect(() => {
    dispatch(fetchOrderById(orderId)); // 获取订单详情
  }, [dispatch, orderId]);

  const handleUnbox = async () => {
    await dispatch(unboxOrder(orderId)).unwrap();
    navigate(`/${orderId}/unbox`); // 跳转拆盒结果页

    

  };

  const handleGoBack = () => {
    navigate(-1);
  };

  if (loading) return <div>加载中...</div>;
  if (error) return <div>错误：{error}</div>;
  if (!order) return <div>订单不存在</div>;
  console.log('订单详情数据:', order);
  

  return (
    <div className="order-detail-container">
      <h2>订单 {order.id}</h2>
      <p>状态：{order.status === 0 ? '已拆盒' : '待拆盒'}</p>
        <p>总金额：¥{order.amount}</p>
      <p>创建时间：{new Date(order.created_at).toLocaleString()}</p>
      <p>收件人：{order.userInfo?.name||order.user_info.name||'暂无'}</p>
      <p>收货地址：{order.userInfo?.address||order.user_info.address||'暂无'}</p>
        <p>联系电话：{order.userInfo?.number||order.user_info.number||'暂无'}</p>
    
      <button onClick={handleUnbox} >
        查看拆盒结果
      </button>

      {/* 展示订单商品、地址等信息 */}
      <button className="back-btn" onClick={handleGoBack}>
        返回
      </button>
    </div>
    
  );
};

export default OrderDetail;