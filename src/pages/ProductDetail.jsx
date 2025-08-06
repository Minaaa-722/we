import React, { useState, useEffect } from'react';
import { useParams, Link, useNavigate } from'react-router-dom';
import '../styles/productDetail.css';

const ProductDetail = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [currentDetailImage, setCurrentDetailImage] = useState(0);
  const [remaining, setRemaining] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [comments, setComments] = useState([]); // 新增：存储产品评论
  const [commentsLoading, setCommentsLoading] = useState(false); // 新增：评论加载状态
  const navigate = useNavigate();

  // 检查用户是否已登录
  const isLoggedIn = () => {
    const token = localStorage.getItem('userToken');
    return !!token;
  };

  // 新增：获取产品评论
  const fetchProductComments = async () => {
    if (!productId) return;
    
    try {
      setCommentsLoading(true);
      const response = await fetch(`http://localhost:3000/api/products/${productId}/comments`);
      
      if (response.ok) {
        const data = await response.json();
        console.log('获取评论数据:', data);
        setComments(data.data || []);
      } else {
        console.error('获取评论失败:', response.statusText);
      }
    } catch (err) {
      console.error('获取评论请求失败:', err);
    } finally {
      setCommentsLoading(false);
    }
  };

  useEffect(() => {
    const fetchProductDetail = async () => {
      try {
        if (!productId || isNaN(Number(productId))) {
          setError('无效的商品ID');
          setLoading(false);
          return;
        }

        const response = await fetch(`http://localhost:3000/api/products/${Number(productId)}`);
        
        console.log('接口响应状态:', response.status);
        if (!response.ok) {
          if (response.status === 404) {
            setError('商品不存在或已下架');
          } else if (response.status === 500) {
            setError('服务器内部错误，请稍后重试');
          } else {
            setError(`获取失败（状态码：${response.status}）`);
          }
          setLoading(false);
          return;
        }
        
        const data = await response.json();
        if (!data) {
          setError('商品数据格式错误');
          setLoading(false);
          return;
        }
        console.log('商品数据:', data);
        setProduct(data.data);
        setRemaining(data.data.remaining);
        setSelectedImage(data.data.images?.[0] || '');
        setError('');
      } catch (error) {
        console.error('请求失败:', error);
        setError('网络请求失败，请检查后端是否运行');
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetail();
    fetchProductComments(); // 新增：获取评论
  }, [productId]);

  // 处理数量变更
  const handleQuantityChange = (type) => {
    if (type === 'increase' && quantity < remaining) {
      setQuantity(prev => prev + 1);
    } else if (type === 'decrease' && quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  // 其他辅助函数保持不变
  const handleThumbnailClick = (image) => {
    setSelectedImage(image);
  };

  const openDetailModal = () => {
    setShowModal(true);
    setCurrentDetailImage(0);
  };

  const closeDetailModal = () => {
    setShowModal(false);
  };

  const navigateDetailImages = (direction) => {
    if (!product || !product.detailImages) return;
    
    if (direction === 'next') {
      setCurrentDetailImage(prev => 
        prev === product.detailImages.length - 1? 0 : prev + 1
      );
    } else {
      setCurrentDetailImage(prev => 
        prev === 0? product.detailImages.length - 1 : prev - 1
      );
    }
  };

  const handleModalOutsideClick = (e) => {
    if (e.target === e.currentTarget) {
      closeDetailModal();
    }
  };

  const canAddToCart = () => {
    return product && product.remaining > 0;
  };

  const getButtonClassName = (buttonType) => {
    if (!canAddToCart()) {
      return buttonType === 'buy-now-btn'? 'buy-now-btn disabled' : 'add-to-cart-btn disabled';
    }
    return buttonType === 'buy-now-btn'? 'buy-now-btn' : 'add-to-cart-btn';
  };

  // 处理加购/购买逻辑
  const handlePurchaseAction = () => {
    if (!canAddToCart()) return;
    
    if (!isLoggedIn()) {
      const returnData = {
        from: `/product/${productId}`,
        productId,
        quantity
      };
      navigate('/users/login', { state: returnData });
      return;
    }
    
    navigate(`/orders/confirm/${productId}/${remaining}`);
  };

  // 加载状态显示
  if (loading) {
    return (
      <div className="product-detail-container">
        <Link to="/" className="back-link">
          <span className="back-arrow">←</span>
          <span>返回首页</span>
        </Link>
        <div className="loading">加载中...</div>
      </div>
    );
  }

  // 错误状态显示
  if (error || !product) {
    return (
      <div className="product-detail-container">
        <Link to="/" className="back-link">
          <span className="back-arrow">←</span>
          <span>返回首页</span>
        </Link>
        <div className="product-not-found">
          <p>{error || '抱歉，该商品不存在或已下架'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="product-detail-container">
      <Link to="/" className="back-link">
        <span className="back-arrow">←</span>
        <span>返回首页</span>
      </Link>

      <div className="product-detail-content">
        <div className="product-image-section">
          <div className="main-image-container">
            <img 
              src={selectedImage} 
              alt={product.name} 
              className="main-product-image"
            />
          </div>
          
          <div className="thumbnail-container">
            {product.images?.map((image, index) => (
              <div 
                key={index}
                className={`thumbnail-item ${selectedImage === image? 'active' : ''}`}
                onClick={() => handleThumbnailClick(image)}
              >
                <img 
                  src={image} 
                  alt={`${product.name} 款式${index + 1}`} 
                  className="thumbnail-image"
                />
              </div>
            ))}
          </div>
        </div>

        <div className="product-info-section">
          <div className="product-title-container">
            <h1 className="product-detail-title">{product.name}</h1>
          </div>

          <div className="price-section">
            <div className="price-label">售价</div>
            <div className="price-values">
              <span className="current-price">¥{product.price}</span>
              {product.originalPrice && (
                <span className="original-price">¥{product.originalPrice}</span>
              )}
              {product.originalPrice && (
                <span className="discount-badge">
                  省¥{(product.originalPrice - product.price)}
                </span>
              )}
            </div>
          </div>

          <div className="description-section">
            <h2 className="section-heading">商品介绍</h2>
            <p className="product-description">{product.description}</p>
          </div>

          <div className="styles-section">
            <h2 className="section-heading">款式清单</h2>
            <div className="style-list">
              {product.styles?.map((style, index) => (
                <div 
                  key={index} 
                  className={`style-item ${
                    style.type === 'rare'? 'rare' : 
                    style.type === 'hidden'? 'hidden' : ''
                  }`}
                >
                  {style.name}
                  {style.type === 'rare' && <span> (稀有)</span>}
                  {style.type === 'hidden' && <span> (隐藏)</span>}
                </div>
              ))}
            </div>
          </div>

          <div className="purchase-section">
            
            
            <div >
              <span >剩余数量:</span> 
              <span >{product.remaining}</span>
            </div>

            <div className="action-buttons">
              <button 
                className={getButtonClassName('buy-now-btn')}
                onClick={handlePurchaseAction}
              >
                {canAddToCart() ? `立即购买 ` : `已售罄`}
                <span className="icon-cart">🛒</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 新增：玩家秀（产品评论）区域 */}
      <div className="product-comments-section">
        <h2 className="comments-heading">玩家秀 <span className="comments-count">({comments.length})</span></h2>
        
        {commentsLoading ? (
          <div className="comments-loading">加载评论中...</div>
        ) : comments.length === 0 ? (
          <div className="no-comments">
            <p>还没有玩家发表评论，快来成为第一个分享的人吧！</p>
          </div>
        ) : (
          <div className="comments-list">
            {comments.map((comment) => (
              <div key={comment.id} className="comment-item">
                <div className="comment-header">
                  <span className="comment-user">用户{comment.userid===null?"匿名":comment.userid}</span>
                  <span className="comment-date">
                    {new Date(comment.created_at).toLocaleString()}
                  </span>
                </div>
                <div className="comment-content">
                  {comment.content}
                </div>
                <div className="comment-divider"></div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showModal && (
        <div className="modal" onClick={handleModalOutsideClick}>
          <div className="modal-content">
            <span className="close" onClick={closeDetailModal}>&times;</span>
            <img 
              src={product.detailImages?.[currentDetailImage]} 
              alt={`${product.name} 详情图片 ${currentDetailImage + 1}`} 
              className="modal-image"
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem' }}>
              <button 
                className="quantity-btn"
                onClick={() => navigateDetailImages('prev')}
              >
                ←
              </button>
              <span style={{ color: '#FF69B4', fontWeight: '500' }}>
                {currentDetailImage + 1} / {product.detailImages?.length || 0}
              </span>
              <button 
                className="quantity-btn"
                onClick={() => navigateDetailImages('next')}
              >
                →
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProductDetail;
