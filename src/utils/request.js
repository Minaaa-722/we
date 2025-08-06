import axios from 'axios';

// 创建 axios 实例
const request = axios.create({
  baseURL: 'http://localhost:3000/api', // 后端接口基础路径
  timeout: 5000,
});

// 请求拦截器（添加 token）
request.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('userToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器（修正数据返回逻辑）
request.interceptors.response.use(
  (response) => {
    // 保留完整的响应结构，不直接返回 response.data
    return response; 
  },
  (error) => {
    if (error.response) {
      console.error('请求错误:', error.response.data);
      return Promise.reject(error.response.data);
    }
    return Promise.reject(error);
  }
);

export default request;
