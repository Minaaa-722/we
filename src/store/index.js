// store/index.js
import { configureStore } from '@reduxjs/toolkit';
import { combineReducers } from 'redux';
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import authReducer from './auth/authSlice';
import orderReducer from './order/orderSlice'; // 新增订单 reducer

const rootReducer = combineReducers({
  auth: authReducer,
  order: orderReducer, // 添加订单 reducer
});

const persistConfig = {
  key: 'root',
  storage,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  // 关键配置：忽略 redux-persist 相关的 action
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // 忽略 redux-persist 的 action
        ignoredActions: ['persist/REGISTER', 'persist/REHYDRATE', 'persist/PERSIST', 'persist/PURGE'],
        // 如果还有其他第三方库的 action 报错，也可以加在这里
      },
    }),
});

export const persistor = persistStore(store);
export default store;