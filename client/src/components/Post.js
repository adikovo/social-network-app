import React, { useState, useRef, useEffect } from 'react';
import CommentInput from './CommentInput';
import ThreeDotMenu from './ThreeDotMenu';
import { useUserContext } from '../context/UserContext';
import axios from 'axios';

const Post = ({ post, onPostUpdated }) => {
    const { user } = useUserContext();
    const [isLiked, setIsLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(post.likes || 0);
    const [commentCount, setCommentCount] = useState(post.comments ? post.comments.length : 0);
    const [showCommentInput, setShowCommentInput] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editText, setEditText] = useState(post.content || '');


    const handleLike = () => {
        const newLikedState = !isLiked;
        setIsLiked(newLikedState);
        setLikeCount(prev => newLikedState ? prev + 1 : prev - 1);

        // TODO: Implement like functionality with backend
        console.log('Like post:', post._id, newLikedState);

        // In the future, this will send the like to the server
        // axios.post('http://localhost:3001/api/posts/like', {
        //     postId: post._id,
        //     isLiked: newLikedState,
        //     userId: user.id
        // })
    };

    const handleComment = () => {
        setShowCommentInput(true);
    };

    const handleCommentSubmit = (commentText) => {
        setCommentCount(prev => prev + 1);
        setShowCommentInput(false);

        // TODO: Implement comment functionality with backend
        console.log('Comment on post:', post._id, 'Comment:', commentText);

        // For now, just log the comment
        // In the future, this will send the comment to the server
        // axios.post('http://localhost:3001/api/posts/comment', {
        //     postId: post._id,
        //     comment: commentText,
        //     userId: user.id
        // })
    };

    const handleCommentCancel = () => {
        setShowCommentInput(false);
    };


    const handleEditPost = () => {
        setIsEditing(true);
        setEditText(post.content || '');
    };

    const handleSaveEdit = () => {
        axios.post('http://localhost:3001/api/posts', {
            command: 'update',
            data: {
                postId: post._id,
                newContent: editText
            }
        })
            .then(res => {
                console.log('Edit post response:', res.data);
                setIsEditing(false);
                if (onPostUpdated) {
                    onPostUpdated(null, res.data.post);
                }
            })
            .catch(err => {
                console.error('Edit post error:', err);
                // Still exit edit mode even if there's an error
                setIsEditing(false);
            });
    };

    const handleCancelEdit = () => {
        setIsEditing(false);
        setEditText(post.content || '');
    };

    const handleDeletePost = () => {
        axios.post('http://localhost:3001/api/posts', {
            command: 'delete',
            data: {
                postId: post._id
            }
        })
            .then(res => {
                console.log('Delete post response:', res.data);
                //tell parent component to remove the deleted post
                if (onPostUpdated) {
                    onPostUpdated(post._id);
                }
            })
            .catch(err => {
                console.error('Delete post error:', err);
            });
    };

    // Check if current user is the author of the post
    const isAuthor = user && (user.id === post.authorId || user.username === post.author || user.name === post.author);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toISOString().split('T')[0]; // Returns YYYY-MM-DD format
    };

    const getInitials = (name) => {
        if (!name) return '?';
        return name.split(' ').map(n => n[0]).join('').toUpperCase();
    };

    return (
        <div style={{
            background: 'white',
            borderRadius: '8px',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
            padding: '20px',
            marginBottom: '20px',
            maxWidth: '100%',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", sans-serif'
        }}>
            {/* Header */}
            <div style={{
                display: 'flex',
                alignItems: 'flex-start',
                marginBottom: '16px'
            }}>
                <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    backgroundColor: '#e0e0e0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 'bold',
                    color: '#666',
                    fontSize: '16px',
                    marginRight: '12px',
                    flexShrink: 0
                }}>
                    {getInitials(post.authorName || post.author)}
                </div>
                <div style={{ flex: 1 }}>
                    <div style={{
                        fontWeight: '600',
                        fontSize: '16px',
                        color: '#333',
                        marginBottom: '2px'
                    }}>
                        {post.authorName || post.author || 'Unknown User'}
                    </div>
                    <div style={{
                        fontSize: '14px',
                        color: '#666',
                        fontWeight: '400'
                    }}>
                        {formatDate(post.createdAt)}
                    </div>
                </div>

                {/*3 dot menu button - only show if user is author */}
                {isAuthor && (
                    <ThreeDotMenu
                        menuItems={[
                            { id: 'edit', label: 'Edit Post', action: 'edit' },
                            { id: 'delete', label: 'Delete Post', action: 'delete', danger: true }
                        ]}
                        onItemClick={(item) => {
                            if (item.action === 'edit') {
                                handleEditPost();
                            } else if (item.action === 'delete') {
                                handleDeletePost();
                            }
                        }}
                    />
                )}
            </div>

            {/* Content */}
            {isEditing ? (
                <div style={{ marginBottom: '16px' }}>
                    <textarea
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        style={{
                            width: '100%',
                            minHeight: '80px',
                            padding: '12px',
                            border: '1px solid #e0e0e0',
                            borderRadius: '8px',
                            fontSize: '16px',
                            lineHeight: '1.5',
                            color: '#333',
                            backgroundColor: '#f8f9fa',
                            fontFamily: 'inherit',
                            resize: 'vertical',
                            outline: 'none',
                            boxSizing: 'border-box'
                        }}
                        placeholder="What's on your mind?"
                    />
                    <div style={{
                        display: 'flex',
                        gap: '12px',
                        marginTop: '12px'
                    }}>
                        <button
                            onClick={handleSaveEdit}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px',
                                padding: '8px 16px',
                                backgroundColor: '#333',
                                color: 'white',
                                border: 'none',
                                borderRadius: '6px',
                                fontSize: '14px',
                                fontWeight: '500',
                                cursor: 'pointer',
                                transition: 'background-color 0.2s ease'
                            }}
                            onMouseEnter={(e) => e.target.style.backgroundColor = '#555'}
                            onMouseLeave={(e) => e.target.style.backgroundColor = '#333'}
                        >
                            <span>✓</span>
                            Save
                        </button>
                        <button
                            onClick={handleCancelEdit}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px',
                                padding: '8px 16px',
                                backgroundColor: 'white',
                                color: '#666',
                                border: '1px solid #e0e0e0',
                                borderRadius: '6px',
                                fontSize: '14px',
                                fontWeight: '500',
                                cursor: 'pointer',
                                transition: 'background-color 0.2s ease'
                            }}
                            onMouseEnter={(e) => e.target.style.backgroundColor = '#f5f5f5'}
                            onMouseLeave={(e) => e.target.style.backgroundColor = 'white'}
                        >
                            <span>✕</span>
                            Cancel
                        </button>
                    </div>
                </div>
            ) : (
                <div style={{
                    fontSize: '16px',
                    lineHeight: '1.5',
                    color: '#333',
                    marginBottom: '16px',
                    wordWrap: 'break-word'
                }}>
                    {post.content}
                </div>
            )}

            {/* Footer */}
            <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '20px'
            }}>
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        cursor: 'pointer',
                        padding: '4px 8px',
                        borderRadius: '4px',
                        transition: 'background-color 0.2s ease'
                    }}
                    onClick={handleLike}
                    onMouseEnter={(e) => e.target.style.backgroundColor = '#f5f5f5'}
                    onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                >
                    <span style={{
                        fontSize: '18px',
                        display: 'flex',
                        alignItems: 'center',
                        color: isLiked ? '#e74c3c' : 'inherit'
                    }}>
                        {isLiked ? '❤️' : '🤍'}
                    </span>
                    <span style={{
                        fontSize: '14px',
                        color: '#666',
                        fontWeight: '500'
                    }}>
                        {likeCount}
                    </span>
                </div>
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        cursor: 'pointer',
                        padding: '4px 8px',
                        borderRadius: '4px',
                        transition: 'background-color 0.2s ease'
                    }}
                    onClick={handleComment}
                    onMouseEnter={(e) => e.target.style.backgroundColor = '#f5f5f5'}
                    onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                >
                    <span style={{
                        fontSize: '18px',
                        display: 'flex',
                        alignItems: 'center'
                    }}>
                        💬
                    </span>
                    <span style={{
                        fontSize: '14px',
                        color: '#666',
                        fontWeight: '500'
                    }}>
                        {commentCount}
                    </span>
                </div>
            </div>

            {/* Comment Input */}
            {showCommentInput && (
                <CommentInput
                    onSubmit={handleCommentSubmit}
                    onCancel={handleCommentCancel}
                    placeholder="Write a comment..."
                />
            )}
        </div>
    );
};

export default Post;
