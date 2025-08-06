import React from'react';
import { Link, useNavigate } from'react-router-dom';
import '../styles/sidebar.css';

// 假设使用 localStorage 存储登录状态，实际项目可能会用 Redux/Vuex 等状态管理
const Sidebar = () => {
  const navigate = useNavigate();
  // 检查用户是否登录（实际项目中可能会从全局状态获取）
  const isLoggedIn =!!localStorage.getItem('userToken');

  // 处理侧边栏项点击
  const handleSidebarItemClick = (path) => {
    // 如果未登录，统一跳转到登录页
    if (!isLoggedIn) {
      // 记录想要访问的页面，登录后可以跳回
      localStorage.setItem('redirectPath', path);
      navigate('/users/login');
      return;
    }
    
    // 已登录则跳转
    navigate(path);
  };

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h2 className="sidebar-title">菜单</h2>
      </div>
      
      <ul className="sidebar-menu">
        <li className="sidebar-item">
          <button 
            className="sidebar-link"
            onClick={() => handleSidebarItemClick('/users/profile')}
          >
            <span className="sidebar-icon">👤</span>
            <span className="sidebar-text">个人主页</span>
          </button>
        </li>
        <li className="sidebar-item">
          <button 
            className="sidebar-link"
            onClick={() => handleSidebarItemClick('/users/orders')}
          >
            <span className="sidebar-icon">📦</span>
            <span className="sidebar-text">我的订单</span>
          </button>
        </li>
        
        {/* 登录/退出按钮 */}
        <li className="sidebar-item auth-item">
          {isLoggedIn? (
            <button 
              className="sidebar-link logout-btn"
              onClick={() => {
                // 清除登录状态
                localStorage.removeItem('userToken');
                navigate('/');
                // 刷新页面以更新状态
                window.location.reload();
              }}
            >
              <span className="sidebar-icon">🚪</span>
              <span className="sidebar-text">退出登录</span>
            </button>
          ) : (
            <Link to="/users/login" className="sidebar-link login-btn">
              <span className="sidebar-icon">🔑</span>
              <span className="sidebar-text">登录/注册</span>
            </Link>
          )}
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
    