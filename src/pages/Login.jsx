import React, { useState } from'react';
import { useNavigate, Link } from'react-router-dom';
import { useDispatch, useSelector } from'react-redux';
import { setLogin, clearRedirectPath } from '../store/auth/authSlice';
import '../styles/Login.css';
import request from '../utils/request';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  // 从Redux获取重定向路径
  const { redirectPath } = useSelector(state => state.auth);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      // 1. 发送登录请求
      const res = await request.post('/users/login', {
        username,
        password,
      });

      // 2. 关键修复：提取后端返回的data对象（包含user和token）
      // 后端响应格式：{ code, message, data: { user, token } }
      const { data: loginData } = res.data;

      console.log('传递给setLogin的数据:', loginData);

      // 3. 验证数据完整性（避免后端返回格式异常）
      if (!loginData ||!loginData.token ||!loginData.user) {
        throw new Error('登录数据格式异常，请重试');
      }

       
      // 4. 正确传递完整数据给setLogin（与authSlice匹配）
      dispatch(setLogin(loginData));
      
      // 5. 处理重定向
      const targetPath = redirectPath || '/';
      dispatch(clearRedirectPath());
      
      navigate(targetPath);
    } catch (err) {
      // 更友好的错误提示（区分网络错误和后端业务错误）
      const errorMsg = 
        err.response?.data?.message ||  // 后端返回的具体错误信息
        err.message ||                  // 前端捕获的错误
        '登录失败，请检查用户名和密码';
      setError(errorMsg);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <Link to="/" className="back-to-home">
          🏠 返回首页
        </Link>

        <h2 className="login-title">登录</h2>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="login-form">
          <div className="form-group">
            <label htmlFor="username">用户名</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="请输入用户名"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">密码</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="请输入密码"
              required
            />
          </div>

          <button type="submit" className="login-btn">登录</button>
        </form>

        <div className="register-link">
          还没有账号？<Link to="/users/register">立即注册</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
    