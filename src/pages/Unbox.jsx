import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { unboxOrder } from '../store/order/orderSlice';
import '../styles/unbox.css'; // 引入对应的样式文件，你可根据实际需求创建并定义样式

const Unbox = () => {
  const { id } = useParams(); // 获取订单 ID
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { unboxResult, loading, error } = useSelector((state) => state.order);

  useEffect(() => {
    // 页面加载时执行拆盒操作（调用 Redux 的异步 action）
    dispatch(unboxOrder(id)).unwrap();
  }, [dispatch, id]);

  // 返回上一页（订单详情页）的函数
  const handleGoBack = () => {
    navigate(-1);
  };

  // 如果正在加载，展示加载提示
  if (loading) {
    return (
      <div className="unbox-loading">
        <div className="loading-spinner"></div>
        <p>正在拆盒，请稍候...</p>
      </div>
    );
  }

  // 如果有错误，展示错误信息
  if (error) {
    return (
      <div className="unbox-error">
        <p>{error}</p>
        <button onClick={handleGoBack}>返回上一页</button>
      </div>
    );
  }

  // 如果拆盒结果不存在（可能是接口未返回等情况），暂不展示内容
  if (!unboxResult) {
    return null;
  }
  console.log(unboxResult);

  return (
    <div>
    <div className="unbox-container">
      <h2 className="unbox-title">拆盒结果</h2>
      <div className="unbox-result">
        {unboxResult.openedStyles.map((style, index) => (
          <div key={index} className="unboxed-style-item">
            <p className="style-name">{style.name}</p>
            <img src={style.image} alt={style.name} className="style-image" />
            {/* 这里可以根据需要展示对应的盲盒款式图片等更多信息，假设图片地址在 style.image 字段中 */}
            {/* <img src={style.image} alt={style.selected_style_name} className="style-image" /> */}
          </div>
        ))}
      </div>
      
    </div>
        <button className="back-btn" onClick={handleGoBack}>
            返回订单详情
        </button>   
  </div>
  );
};

export default Unbox;