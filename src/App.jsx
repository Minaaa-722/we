import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home'; // 假设 Home 组件在 pages 目录下
import ProductDetail from './pages/ProductDetail'; // 上面创建的商品详情组件
import Login from './pages/Login'; // 假设 Login 组件在 pages 目录下
import Profile from './pages/Profile'; // 假设 Profile 组件在 pages 目录下
import OrderConfirm from './pages/OrderConfirm';
import OrderList from './pages/OrderList';
import OrderDetail from './pages/OrderDetail';
import Unbox from './pages/Unbox';
import Register from './pages/Register';
import SearchResults from './pages/SearchResults';
import Comment from './pages/Comment';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/product/:productId" element={<ProductDetail />} /> {/* 商品详情路由，带参数 productId */}

        <Route path="/users/login" element={<Login />} />
        <Route path="/users/register" element={<Register />} /> {/* 注册路由 */}
        <Route path="/users/profile" element={<Profile />} />
        <Route path="/orders/confirm/:productId/:remaining" element={<OrderConfirm />} />
        <Route path="/users/orders" element={<OrderList />} />
        <Route path="/order-details/:orderId" element={<OrderDetail />} />
        <Route path="/:orderId/unbox" element={<Unbox />} /> 
        <Route path="/search" element={<SearchResults />} />
        <Route path="/comment/:orderId" element={<Comment />}/>
      </Routes>
    </Router>
  );
}

export default App;