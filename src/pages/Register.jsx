import React, { useState } from'react';
import { useNavigate, Link } from'react-router-dom';
import { useDispatch } from'react-redux';
import { setLogin } from '../store/auth/authSlice';
import '../styles/Login.css';
import request from '../utils/request';

const Register = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');

    // 前端基本校验
    if (password!== confirmPassword) {
      setError('两次输入的密码不一致');
      return;
    }
    if (password.length < 6) {
      setError('密码长度不能少于6位');
      return;
    }

    try {
      // 调用注册接口
      const res = await request.post('/users/register', {
        username,
        password,
      });

      // 注册成功后为用户创建购物车
      if (res.data.user?.id) {
        await request.post('/cart_items', {
          user_id: res.data.user.id,
          items: [] // 初始化为空购物车
        });
      }

      // 如果后端返回返回token，直接登录状态
      if (res.data.token) {
        dispatch(setLogin(res.data.token));
      }

      // 注册成功后显示提示，1.5秒后跳转到登录页
      window.alert('注册成功！即将跳转到登录页面');
      setTimeout(() => {
        navigate('/users/login');
      }, 1500);

    } catch (err) {
      setError(err.message || '注册失败，请重试');
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <Link to="/users/login" className="back-to-home">
          🏠 返回登录
        </Link>
        <h2 className="login-title">新用户注册</h2>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <form onSubmit={handleRegister} className="login-form">
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

          <div className="form-group">
            <label htmlFor="confirmPassword">确认密码</label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="请再次输入密码"
              required
            />
          </div>

          <button type="submit" className="login-btn">注册</button>
        </form>
      </div>
    </div>
  );
};

export default Register;
