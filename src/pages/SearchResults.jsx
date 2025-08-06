import React, { useState, useEffect } from'react';
import { useLocation, useNavigate, Link } from'react-router-dom';
import ProductGrid from '../components/ProductGrid';
import '../styles/SearchResults.css';

const SearchResults = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  // 获取URL中的搜索关键词
  const getSearchQuery = () => {
    const searchParams = new URLSearchParams(location.search);
    return searchParams.get('query') || '';
  };

  const searchQuery = getSearchQuery();

  // 根据关键词搜索产品
  useEffect(() => {
    if (!searchQuery) return;

    const fetchSearchResults = async () => {
      try {
        setLoading(true);
        // 调用后端搜索接口
        const response = await fetch(
          `http://localhost:3000/api/products/search?query=${encodeURIComponent(searchQuery)}`
        );
        console.log(response); // 检查请求URL
        if (!response.ok) {
          throw new Error('搜索失败');
        }
        
        const data = await response.json();
        console.log(data); // 检查返回的数据
        setResults(data);
        setError(null);
      } catch (err) {
        console.error('搜索出错:', err);
        setError('搜索时发生错误，请稍后再试');
        setResults([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSearchResults();
  }, [searchQuery]);

  const handleCardClick = (productId) => {
    navigate(`/product/${productId}`);
  };

  if (loading) {
    return <div className="loading">搜索中...</div>;
  }

  return (
    <div className="search-results-container">
      <div className="search-header">
        <Link to="/" className="back-link">← 返回首页</Link>
        <h1>搜索结果: "{searchQuery}"</h1>
        <p className="results-count">
          {results.total} 个相关盲盒
        </p>
      </div>

      {error && (
        <div className="error-message">{error}</div>
      )}

      {!error && results.length === 0 ? (
        <div className="no-results">
          没有找到与 "{searchQuery}" 相关的盲盒
        </div>
      ) : (
        <ProductGrid 
          products={results} 
          onCardClick={handleCardClick}
        />
      )}
    </div>
  );
};

export default SearchResults;
    