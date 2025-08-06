import React from'react';
import ProductCard from './ProductCard';

const ProductGrid = ({ products, onCardClick }) => {
  // 关键修复：确保products是数组，否则用空数组兜底
  const productsData=products.data;
  const safeProducts = Array.isArray(productsData)? productsData : [];
  const flattenedProducts = safeProducts.flat(Infinity); 

  // console.log('ProductGrid 接收到的 products:', safeProducts);

  // 可选：开发环境下提示数据异常
  if (!Array.isArray(productsData)) {
    console.warn('ProductGrid 接收的 products 不是数组，已自动转为空数组', {
      received: productsData,
      type: typeof productsData
    });
  }

  return (
    <div className="product-grid">
      {/* 使用处理后的safeProducts避免map报错 */}
      {flattenedProducts.map((product) => (
        // 额外校验product是否有效，避免渲染错误
        product && product.id? (
          <ProductCard 
            key={product.id} 
            product={product} 
            onCardClick={onCardClick}
          />
        ) : null
      ))}
    </div>
  );
};

export default ProductGrid;
    