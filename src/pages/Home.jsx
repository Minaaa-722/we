import React, { useState, useEffect } from 'react';
import ProductGrid from '../components/ProductGrid';
import Sidebar from '../components/Sidebar';
import { useNavigate } from'react-router-dom';
import '../styles/productDisplay.css'; 
import '../styles/Sidebar.css';
import '../styles/Search.css'; // 引入搜索框样式


const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(''); // 搜索关键词状态
  const navigate = useNavigate();

  // 获取产品数据
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/products');
        if (!response.ok) {
          throw new Error('获取产品数据失败');
        }
        const data = await response.json();
        setProducts(data);
        setLoading(false);
      } catch (error) {
        console.error('获取产品失败:', error);
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // 处理搜索提交
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      // 跳转到搜索结果页面并携带搜索关键词
      navigate(`/search?query=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  const handleCardClick = (productId) => {
    navigate(`/product/${productId}`);
  };

  if (loading) {
    return <div className="loading">加载中...</div>;
  }

  return (
    <div className="home-container">
      <Sidebar />
      
      <div className="main-content">
        {/* 头部区域 - 包含标题和搜索框 */}
        <header className="header-section">
          <div className="header-content">
            <div>
              <h1 className="main-title">盲盒抽盒机</h1>
              <p className="sub-title">欢迎来到盲盒星球，更多惊喜等你探索~</p>
            </div>
            
            {/* 搜索框表单 */}
            <form onSubmit={handleSearch} className="search-form">
              <input
                type="text"
                placeholder="搜索盲盒名称..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
              <button type="submit" className="search-button">
                🔍
              </button>
            </form>
          </div>
        </header>

        {/* 商品展示区域 */}
        <main className="products-section">
          <div className="section-header">
            <h2 className="section-title">热门盲盒推荐</h2>
            <div className="title-underline"></div>
          </div>

          <ProductGrid 
            products={products} 
            onCardClick={handleCardClick}
          />

          
        </main>


      </div>
    </div>
  );
};

export default Home;
    