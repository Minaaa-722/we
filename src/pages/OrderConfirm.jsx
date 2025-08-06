// src/pages/OrderConfirm.jsx
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { createOrder } from '../store/order/orderSlice';
import '../styles/orderConfirm.css';

const OrderConfirm = () => {
    const { productId, remaining } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [quantity, setQuantity] = useState(1);

    const [number, setNumber] = useState(''); // 保持字符串类型
    const [userName, setUserName] = useState('');
    const [address, setAddress] = useState('');
    const { loading, error } = useSelector((state) => state.order);
    const { user } = useSelector((state) => state.auth);

    const userId = user?.id;

    const handleSubmit = async () => {
        // 提交时再转换为数字验证
        const phoneNumber = Number(number);
        if (isNaN(phoneNumber) || number.length < 11) {
            alert('请输入有效的11位手机号码');
            return;
        }

        try {
            const result = await dispatch(
                createOrder({
                    userId,
                    productId,
                    quantity,
                    userName,
                    address,
                    number: phoneNumber
                })
            ).unwrap();
            if (result && result.orderId) {
                navigate(`/order-details/${result.orderId}`);
            } else {
                console.error('创建订单返回结果异常：', result);
                alert('创建订单失败，请稍后重试（返回数据异常）');
            }
        } catch (error) {
            console.error('创建订单失败：', error);
            // 这里可以结合 orderError 或者 error 本身提示用户
            const errorMsg = error || '创建订单失败，请检查信息并重试';
            alert(errorMsg);
        }
    };

    return (
        <div className="order-confirm-container">
            <h2>订单确认</h2>
            <div className="form-group">
                <label>购买数量(剩余库存：{remaining}件)：</label>
                <div className="quantity-control">
                    <button
                        type="button"
                        onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                        className="quantity-btn minus-btn"
                    >
                        -
                    </button>
                    <input
                        type="number"
                        value={quantity}
                        onChange={(e) => {
                            const value = Number(e.target.value);
                            if (!isNaN(value) && value >= 1 && value <= remaining) {
                                // 限制输入值在1到maxQuantity之间
                                setQuantity(value);
                            }
                        }}
                        min={1}
                        max={remaining}
                        className="quantity-input"
                    />
                    <button
                        type="button"
                        onClick={() => setQuantity(prev => Math.min(prev + 1, remaining))}
                        className="quantity-btn plus-btn"
                    >
                        +
                    </button>
                </div>
            </div>
            <div className="form-group">
                <label>收货人姓名：</label>
                <input
                    type="text"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    placeholder="填写收货人姓名"
                />
            </div>

            <div className="form-group">
                <label>收货地址：</label>
                <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="填写收货地址"
                />
            </div>
            <div className="form-group">
                <label>联系方式：</label>
                {/* 修改这里：使用text类型并限制输入为数字 */}
                <input
                    type="text"
                    value={number}
                    onChange={(e) => {
                        // 只允许输入数字
                        const value = e.target.value.replace(/[^0-9]/g, '');
                        setNumber(value);
                    }}
                    placeholder="填写11位手机号码"
                    maxLength="11"
                />
            </div>
            <button
                onClick={handleSubmit}
                disabled={loading || !userName || !address || !number}
                className="submit-btn"
            >
                {loading ? '创建中...' : '提交订单'}
            </button>
            {error && <div className="error">{error}</div>}
        </div>
    );
};

export default OrderConfirm;
