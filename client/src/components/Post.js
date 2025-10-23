import React, { useState, useRef, useEffect } from 'react';
import CommentInput from './CommentInput';
import DropdownMenu from './DropdownMenu';
import { useUserContext } from '../context/UserContext';
import axios from 'axios';

const Post = ({ post, onPostUpdated }) => {
    const { user } = useUserContext();
    const [isLiked, setIsLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(post.likes || 0);
    const [commentCount, setCommentCount] = useState(post.comments ? post.comments.length : 0);
    const [showCommentInput, setShowCommentInput] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    const dropdownRef = useRef(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowDropdown(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

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

    const toggleDropdown = () => {
        setShowDropdown(!showDropdown);
    };

    const handleEditPost = () => {
        setShowDropdown(false);
        // TODO: Implement edit post functionality
        console.log('Edit post:', post._id);

        // When edit is implemented, call onPostUpdated() after successful edit
        // if (onPostUpdated) {
        //     onPostUpdated();
        // }
    };

    const handleDeletePost = () => {
        setShowDropdown(false);

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
                    <div ref={dropdownRef} style={{ position: 'relative' }}>
                        <button
                            onClick={toggleDropdown}
                            style={{
                                background: 'none',
                                border: 'none',
                                cursor: 'pointer',
                                padding: '4px',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: '#666',
                                fontSize: '18px',
                                width: '32px',
                                height: '32px',
                                transition: 'background-color 0.2s ease'
                            }}
                            onMouseEnter={(e) => e.target.style.backgroundColor = '#f5f5f5'}
                            onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                            title="More options"
                        >
                            ⋯
                        </button>

                        <DropdownMenu
                            isOpen={showDropdown}
                            onClose={() => setShowDropdown(false)}
                            position="right"
                            width="140px"
                        >
                            <button
                                onClick={handleEditPost}
                                style={{
                                    width: '100%',
                                    padding: '8px 12px',
                                    border: 'none',
                                    background: 'none',
                                    textAlign: 'left',
                                    cursor: 'pointer',
                                    fontSize: '14px',
                                    color: '#333',
                                    borderBottom: '1px solid #e5e7eb'
                                }}
                                onMouseEnter={(e) => e.target.style.backgroundColor = '#f5f5f5'}
                                onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                            >
                                Edit Post
                            </button>
                            <button
                                onClick={handleDeletePost}
                                style={{
                                    width: '100%',
                                    padding: '8px 12px',
                                    border: 'none',
                                    background: 'none',
                                    textAlign: 'left',
                                    cursor: 'pointer',
                                    fontSize: '14px',
                                    color: '#dc2626'
                                }}
                                onMouseEnter={(e) => e.target.style.backgroundColor = '#fef2f2'}
                                onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                            >
                                Delete Post
                            </button>
                        </DropdownMenu>
                    </div>
                )}
            </div>

            {/* Content */}
            <div style={{
                fontSize: '16px',
                lineHeight: '1.5',
                color: '#333',
                marginBottom: '16px',
                wordWrap: 'break-word'
            }}>
                {post.content}
            </div>

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
