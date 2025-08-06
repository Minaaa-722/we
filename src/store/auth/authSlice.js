import { createSlice } from '@reduxjs/toolkit';

// 初始化状态（与组件使用的字段保持一致）
const initialState = {
  // 认证状态标识
  isAuthenticated: !!localStorage.getItem('userToken'), 
  // 统一用 user 对象存储用户信息
  user: {
    id: localStorage.getItem('userId') || null,
    username: localStorage.getItem('username') || null
  },
  userToken: localStorage.getItem('userToken') || null,
  redirectPath: localStorage.getItem('redirectPath') || null
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // 设置登录状态
    setLogin: (state, action) => {
      // 判断action.payload是否为对象
      if (typeof action.payload === 'object' && action.payload !== null) {
        const { token, user } = action.payload;
        // 进一步判断token和user是否存在
        if (token && user && user.id && user.username) {
          // 更新认证状态
          state.isAuthenticated = true;
          // 存储用户令牌
          state.userToken = token;
          // 存储用户信息
          state.user = {
            id: user.id || null,
            username: user.username || null
          };

          // 同步到localStorage
          localStorage.setItem('userToken', token);
          localStorage.setItem('userId', user.id || '');
          localStorage.setItem('username', user.username || '');
        } else {
          console.error('用户信息格式错误:', action.payload);
        }
      } else {
        console.error('登录数据格式错误，期望为对象:', action.payload);
      }
    },

    // 退出登录（清除所有状态）
    setLogout: (state) => {
      state.isAuthenticated = false;
      state.userToken = null;
      state.user = { id: null, username: null };
      state.redirectPath = null;
      
      localStorage.removeItem('userToken');
      localStorage.removeItem('userId');
      localStorage.removeItem('username');
      localStorage.removeItem('redirectPath');
    },

    // 设置重定向路径
    setRedirectPath: (state, action) => {
      state.redirectPath = action.payload;
      localStorage.setItem('redirectPath', action.payload);
    },

    // 清除重定向路径
    clearRedirectPath: (state) => {
      state.redirectPath = null;
      localStorage.removeItem('redirectPath');
    },

    // 添加更新用户名的reducer
    updateUsername: (state, action) => {
      const newUsername = action.payload;
      // 验证新用户名是否有效
      if (newUsername && typeof newUsername === 'string' && newUsername.trim() !== '') {
        // 更新Redux状态中的用户名
        console.log('接收的新用户名:', action.payload); // 检查是否为预期值
        state.user.username = newUsername.trim();
        // 同步更新localStorage中的用户名
        localStorage.setItem('username', newUsername.trim());
        console.log('更新后的用户名:', localStorage.getItem('username')); // 确认更新成功
      } else {
        console.error('无效的用户名:', action.payload);
      }
    }
  }
});

// 导出新增的updateUsername action
export const { setLogin, setLogout, setRedirectPath, clearRedirectPath, updateUsername } = authSlice.actions;
export default authSlice.reducer;
