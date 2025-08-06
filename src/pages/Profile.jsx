import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { updateUsername } from '../store/auth/authSlice';
import axios from 'axios';
import '../styles/Profile.css';

// 可爱风格的占位头像
const PLACEHOLDER_AVATAR = 'https://picsum.photos/seed/avatar/200';

const Profile = () => {
  // 从 Redux 获取用户信息
  const { user } = useSelector((state) => state.auth);
  const username = user?.username || '默认用户';
  const userId = user?.id;
  const navigate = useNavigate();

  const dispatch = useDispatch();

  // 用户名修改状态
  const [newUsername, setNewUsername] = useState(username);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // 密码修改状态
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordError, setPasswordError] = useState('');

  // 切换密码修改状态（清空输入和错误）
  const togglePasswordChange = () => {
    setIsChangingPassword(!isChangingPassword);
    setOldPassword('');
    setNewPassword('');
    setPasswordError('');
  };

  // 处理旧密码输入（实时清空错误）
  const handleOldPasswordChange = (e) => {
    setOldPassword(e.target.value);
    if (passwordError) setPasswordError('');
  };

  // 处理新密码输入（实时清空错误）
  const handleNewPasswordChange = (e) => {
    setNewPassword(e.target.value);
    if (passwordError) setPasswordError('');
  };

  // 提交修改密码请求
  const handleUpdatePassword = async () => {
    // 1. 基础校验（立即反馈）
    if (!oldPassword || !newPassword) {
      setPasswordError('旧密码和新密码均为必填项');
      return;
    }
    if (newPassword.length < 6 || oldPassword.length < 6) {
      setPasswordError('密码长度不能少于 6 位');
      return;
    }
    if (oldPassword === newPassword) {
      setPasswordError('新密码不能与旧密码相同');
      return;
    }
    if (!userId) {
      setPasswordError('无法获取用户信息，请重新登录');
      return;
    }

    try {
      // 2. 发起请求（保持修改状态，方便重新输入）
      const backendUrl = 'http://localhost:3000';
      const token = localStorage.getItem('userToken');

      const response = await axios.put(
        `${backendUrl}/api/users/${userId}/password`,
        { oldPassword, newPassword },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // 3. 处理响应
      if (response?.data?.success) {
        setOldPassword('');
        setNewPassword('');
        alert('密码修改成功，请重新登录');
        navigate('/users/login');
      } else {
        setPasswordError(response.data?.message || '密码修改失败');
      }
    } catch (err) {
      console.error('修改密码失败:', err);
      // 优先显示后端返回的错误，否则提示旧密码不正确
      const errorMsg = err.response?.data?.message || '旧密码不正确';
      setPasswordError(errorMsg);
    }
  };

  // 处理用户名输入
  const handleUsernameChange = (e) => {
    setNewUsername(e.target.value);
    setError('');
  };

  // 提交新用户名
  const handleUpdateUsername = async () => {
    const trimmedName = newUsername.trim();
    if (!trimmedName || trimmedName === username) return;
    if (!userId) {
      setError('无法获取用户信息，请重新登录');
      return;
    }

    try {
      setIsLoading(true);
      const backendUrl = 'http://localhost:3000';
      const token = localStorage.getItem('userToken');

      const response = await axios.put(
        `${backendUrl}/api/users/${userId}/username`,
        { newUsername: trimmedName },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response?.data?.success) {
        dispatch(updateUsername(trimmedName));
        setIsEditing(false);
      } else {
        setError(response.data?.message || '更新失败，请重试');
      }
    } catch (err) {
      console.error('更新用户名失败:', err);
      setError(err.response?.data?.message || '更新失败，请重试');
    } finally {
      setIsLoading(false);
    }
  };

  // 取消编辑用户名
  const handleCancelEdit = () => {
    setIsEditing(false);
    setNewUsername(username);
    setError('');
  };

  return (
    <div className="profile-page">
      {/* 返回首页按钮 */}
      <Link to="/" className="back-home-btn">
        <span className="emoji">🏠</span> 返回首页
      </Link>

      <div className="profile-card">
        <h1 className="page-title">个人资料 <span className="emoji">✨</span></h1>

        {/* 头像区域 */}
        <div className="avatar-wrapper">
          <div className="avatar-frame">
            <img
              src={PLACEHOLDER_AVATAR}
              alt="用户头像"
              className="avatar-image"
            />
            <div className="avatar-decoration">🌸</div>
          </div>
        </div>

        {/* 用户名区域 - 仅显示用户名，不包含按钮 */}
        <div className="username-display">
          <span className="username-label">用户名:</span>
          {isEditing ? (
            <div className="username-edit">
              <input
                type="text"
                value={newUsername}
                onChange={handleUsernameChange}
                autoFocus
                className="username-input"
                placeholder="请输入新用户名"
                disabled={isLoading}
              />
              <div className="edit-buttons">
                <button
                  className="edit-btn confirm"
                  onClick={handleUpdateUsername}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span className="emoji">⏳保存中...</span>
                  ) : (
                    <span className="emoji">✅ 确认</span>
                  )}
                </button>
                <button
                  className="edit-btn cancel"
                  onClick={handleCancelEdit}
                  disabled={isLoading}
                >
                  <span className="emoji">❌</span> 取消
                </button>
              </div>
              {error && <div className="error-message">{error}</div>}
            </div>
          ) : (
            <div className="username-value">
              {username}
            </div>
          )}
        </div>

        {/* 按钮容器 - 添加居中样式 */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          gap: '1rem', 
          margin: '1.5rem 0' 
        }}>
          {/* 修改用户名按钮 - 独立于显示区域 */}
          {!isEditing && (
            <button
              className="profile-button edit-username"
              onClick={() => setIsEditing(true)}
              disabled={isLoading || isChangingPassword}
            >
              <span className="emoji">✏️</span> 修改用户名
            </button>
          )}

          {/* 密码修改按钮 */}
          <button
            className="profile-button edit-password"
            onClick={togglePasswordChange}
            disabled={isLoading || isEditing}
          >
            <span className="emoji">🔒</span>{' '}
            {isChangingPassword ? '取消修改密码' : '修改密码'}
          </button>
        </div>

        {/* 密码修改表单区域 */}
        {isChangingPassword && (
          <div className="password-edit">
            <input
              type="password"
              value={oldPassword}
              onChange={handleOldPasswordChange}
              placeholder="请输入旧密码"
              className="password-input"
              autoFocus
            />
            <input
              type="password"
              value={newPassword}
              onChange={handleNewPasswordChange}
              placeholder="请输入新密码"
              className="password-input"
            />
            <div className="password-buttons">
              <button
                className="edit-btn confirm"
                onClick={handleUpdatePassword}
              >
                <span className="emoji">✅ 确认</span>
              </button>
            </div>
            {passwordError && (
              <div className="error-message" style={{ color: 'red' }}>
                {passwordError}
              </div>
            )}
          </div>
        )}
      </div>

      {/* 装饰元素 */}
      <div className="decor-element decor-1">🍬</div>
      <div className="decor-element decor-2">🍭</div>
      <div className="decor-element decor-3">🍩</div>
    </div>
  );
};

export default Profile;
