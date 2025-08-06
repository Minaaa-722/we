import React from'react';
import '../styles/productDisplay.css'; // 引入商品卡片样式

const ProductCard = ({ product, onCardClick }) => {
  // 检查图片是否存在
  const hasImages = product?.images && product.images.length > 0;
  const mainImage = hasImages? product.images[0] : '';

  return (
    <div 
      className="product-card"
      onClick={() => onCardClick(product.id)}
      style={{ cursor: 'pointer' }} // 增加鼠标指针样式，提示可点击
    >
      {/* 商品图片区域 */}
      <div className="product-image-container">
        {hasImages ? (
          <img
            src={mainImage}
            alt={product.name || '商品图片'}
            className="product-image"
            // 增加图片加载失败的处理
            onError={(e) => {
              e.target.src = 'https://picsum.photos/400/225'; // 占位图
              e.target.alt = '图片加载失败';
            }}
          />
        ) : (
          // 图片不存在时显示占位区域
          <div className="image-placeholder">
            <span>暂无图片</span>
          </div>
        )}
      </div>

      {/* 商品信息区域 */}
      <div className="product-info">
        <h3 className="product-name">{product.name || '未知商品'}</h3>
        
        {/* 价格区域 */}
        <div className="price-container">
          <div>
            <span className="price-current">¥{product.price?.toFixed(2) || '0.00'}</span>
            {product.originalPrice && (
              <span className="price-original">¥{product.originalPrice.toFixed(2)}</span>
            )}
          </div>
          <button className="buy-button">立即抽取</button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
