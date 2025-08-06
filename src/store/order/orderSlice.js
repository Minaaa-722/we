import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import orderAPI from '../../orderapi/orderAPI'; // 假设你有一个 API 模块处理订单相关请求

// 异步创建订单
export const createOrder = createAsyncThunk(
  'order/createOrder',
  async (orderData, { rejectWithValue }) => {
    try {
      const response = await orderAPI.createOrder(orderData);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

// 异步获取订单详情
export const fetchOrderById = createAsyncThunk(
  'order/fetchOrderById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await orderAPI.getOrderById(id);
      console.log(response.data);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

// 异步拆盒
export const unboxOrder = createAsyncThunk(
  'order/unboxOrder',
  async (orderId, { rejectWithValue }) => {
    try {
      const response = await orderAPI.unboxOrder(orderId);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

// 异步获取用户订单列表
export const fetchUserOrders = createAsyncThunk(
  'order/fetchUserOrders',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await orderAPI.getUserOrders(userId);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

// 新增：异步添加订单评论
export const addComment = createAsyncThunk(
  'order/addComment',
  async ({ orderId, content, userId }, { rejectWithValue }) => {
    try {
      const response = await orderAPI.addComment(orderId, { content, userId });
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || { error: '添加评论失败' });
    }
  }
);

const orderSlice = createSlice({
  name: 'order',
  initialState: {
    list: [],         // 订单列表
    current: null,    // 当前订单详情
    unboxResult: null,// 拆盒结果
    commentResult: null, // 评论提交结果
    loading: false,   // 加载状态
    error: null,      // 错误信息
  },
  reducers: {
    clearUnboxResult: (state) => {
      state.unboxResult = null;
    },
    clearCommentResult: (state) => {
      state.commentResult = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // 创建订单
      .addCase(createOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.current = action.payload; // 保存当前创建的订单
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error || '创建订单失败';
      })
      // 获取订单详情
      .addCase(fetchOrderById.fulfilled, (state, action) => {
        state.current = action.payload;
      })
      // 拆盒
      .addCase(unboxOrder.fulfilled, (state, action) => {
        state.unboxResult = action.payload;
        if (state.current) {
          state.current.status = 0; // 更新订单状态为“已拆盒”
        }
      })
      // 获取用户订单列表
      .addCase(fetchUserOrders.fulfilled, (state, action) => {
        state.list = action.payload;
      })
      // 添加评论
      .addCase(addComment.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.commentResult = null;
      })
      .addCase(addComment.fulfilled, (state, action) => {
        state.loading = false;
        state.commentResult = action.payload;
        
        // 更新当前订单的评论状态
        if (state.current && state.current.id === action.payload.orderId) {
          state.current.has_comments = 1;
        }
        
        // 更新订单列表中的评论状态
        const orderIndex = state.list.findIndex(
          order => order.id === action.payload.orderId
        );
        if (orderIndex !== -1) {
          state.list[orderIndex].has_comments = 1;
        }
      })
      .addCase(addComment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error || '添加评论失败';
      });
  },
});

export const { clearUnboxResult, clearCommentResult } = orderSlice.actions;
export default orderSlice.reducer;
