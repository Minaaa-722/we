import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addComment } from '../store/order/orderSlice';
import '../styles/comment.css';

const Comment = () => {
    const { orderId } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth); // 获取当前用户信息
    const [commentContent, setCommentContent] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState('');

    // 处理提交评论的函数
    const handleSubmitComment = async () => {
        // 验证用户是否登录
        if (!user ||!user.id) {
            setSubmitError('请先登录再评论');
            return;
        }
        
        // 验证评论内容
        if (commentContent.trim() === '') {
            setSubmitError('评论内容不能为空');
            return;
        }

        try {
            setIsSubmitting(true);
            // 传递完整参数：订单ID、评论内容和用户ID
            console.log('提交评论数据:', {
                orderId,      // 订单ID
                content: commentContent,  // 评论内容
                userId: user.id  // 用户ID
            });
            const result = await dispatch(
                addComment({
                    orderId,
                    content: commentContent,
                    userId: user.id  // 新增：传递用户ID
                })
            ).unwrap();
            
            if (result.success) {
                // 提交成功处理
                setIsSubmitting(false);
                setCommentContent('');
                setSubmitError('');
                
                // 使用React状态管理提示信息，而非直接操作DOM
                const commentSubmittedDiv = document.createElement('div');
                commentSubmittedDiv.className = 'comment-submitted';
                commentSubmittedDiv.textContent = '评论提交成功！';
                document.body.appendChild(commentSubmittedDiv);
                
                setTimeout(() => {
                    commentSubmittedDiv.remove();
                    navigate(-1);
                }, 2000);
            } else {
                console.error('提交评论返回结果异常：', result);
                setSubmitError(result.error || '提交评论失败，请稍后重试');
                setIsSubmitting(false);
            }
        } catch (error) {
            console.error('提交评论失败：', error);
            setSubmitError(error.error || '提交评论失败，请检查信息并重试');
            setIsSubmitting(false);
        }
    };

    return (
        <div className="comment-container">
            <h2>发表评论</h2>
            <div className="form-group">
                <label>评论内容：</label>
                <textarea
                    value={commentContent}
                    onChange={(e) => setCommentContent(e.target.value)}
                    placeholder="请输入您的评论内容"
                    rows={5}  // 设置默认行数
                />
            </div>
            <button
                onClick={handleSubmitComment}
                disabled={isSubmitting || commentContent.trim() === ''}
                className="submit-btn"
            >
                {isSubmitting? '提交中...' : '提交评论'}
            </button>
            {submitError && <div className="error">{submitError}</div>}
        </div>
    );
};

export default Comment;
    