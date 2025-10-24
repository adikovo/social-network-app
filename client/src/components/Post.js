import React, { useState, useRef, useEffect } from 'react';
import CommentInput from './CommentInput';
import CommentsModel from './CommentsModel';
import ThreeDotMenu from './ThreeDotMenu';
import MyButton from './myButton';
import { useUserContext } from '../context/UserContext';
import axios from 'axios';

const Post = ({ post, onPostUpdated }) => {
    const { user } = useUserContext();
    const [currentPost, setCurrentPost] = useState(post);
    const [isLiked, setIsLiked] = useState(post.likedBy && post.likedBy.includes(user?.id));
    const [likeCount, setLikeCount] = useState(post.likes || 0);
    const [commentCount, setCommentCount] = useState(post.comments ? post.comments.length : 0);
    const [showCommentInput, setShowCommentInput] = useState(false);
    const [showCommentsModal, setShowCommentsModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editText, setEditText] = useState(post.content || '');

    // update currentPost when post prop changes
    useEffect(() => {
        setCurrentPost(post);
        setCommentCount(post.comments ? post.comments.length : 0);
    }, [post]);


    const handleLike = () => {

        const likedState = !isLiked;

        axios.post('http://localhost:3001/api/posts', {
            command: 'like',
            data: {
                postId: currentPost._id,
                isLiked: likedState,
                userId: user.id
            }
        })
            .then(res => {
                console.log('Like post response:', res.data);

                if (res.data.post) {
                    setLikeCount(res.data.post.likes);
                    // update the liked state 
                    setIsLiked(likedState);
                }
            })
            .catch(err => {
                console.error('Like post error:', err);
                //back to original state
                setIsLiked(!likedState);
                setLikeCount(prev => likedState ? prev - 1 : prev + 1)
            });
    };

    const handleComment = () => {
        setShowCommentsModal(true);
    };

    const submitComment = (commentText, closeInput = false) => {
        //API call to add comment
        axios.post('http://localhost:3001/api/posts', {
            command: 'comment',
            data: {
                postId: currentPost._id,
                commentText: commentText,
                author: user?.username || user?.name || 'You',
                userId: user.id
            }
        })
            .then(res => {
                //update comment count based on actual comments array
                if (res.data.post && res.data.post.comments) {
                    setCommentCount(res.data.post.comments.length);
                }

                //close input if specified (for inline comment input)
                if (closeInput) {
                    setShowCommentInput(false);
                }

                //update the post with the new comment
                if (onPostUpdated && res.data.post) {
                    onPostUpdated(null, res.data.post);
                    setCurrentPost(res.data.post);
                }
            })
            .catch(err => {
                console.error('Error adding comment:', err);
                //show error message to user
                alert('Failed to add comment. Please try again.');
            });
    };

    const handleCommentSubmit = (commentText) => {
        submitComment(commentText, true); // true = close the input
    };

    const handleModalCommentSubmit = (commentText) => {
        submitComment(commentText, false); // false = don't close input (modal handles its own state)
    };

    const handleCommentEdit = (comment, newText) => {
        // API call to edit comment
        axios.post('http://localhost:3001/api/posts', {
            command: 'edit comment',
            data: {
                postId: currentPost._id,
                commentId: comment._id || comment.createdAt,
                newContent: newText
            }
        })
            .then(res => {
                // Update the post with the edited comment
                if (onPostUpdated && res.data.post) {
                    onPostUpdated(null, res.data.post);
                    setCurrentPost(res.data.post);
                }
            })
            .catch(err => {
                console.error('Edit comment error:', err);
                alert('Failed to edit comment. Please try again.');
            });
    };

    const handleCommentDelete = (comment) => {
        // API call to delete comment
        axios.post('http://localhost:3001/api/posts', {
            command: 'delete comment',
            data: {
                postId: currentPost._id,
                commentId: comment._id || comment.createdAt // Use createdAt as fallback ID
            }
        })
            .then(res => {
                // Update comment count
                if (res.data.post && res.data.post.comments) {
                    setCommentCount(res.data.post.comments.length);
                }

                // Update the post with the deleted comment
                if (onPostUpdated && res.data.post) {
                    onPostUpdated(null, res.data.post);
                    setCurrentPost(res.data.post);
                }
            })
            .catch(err => {
                console.error('Delete comment error:', err);
                alert('Failed to delete comment. Please try again.');
            });
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
                postId: currentPost._id,
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
    const isAuthor = user && (user.id === currentPost.authorId || user.username === currentPost.author || user.name === currentPost.author);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toISOString().split('T')[0];
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
                    {getInitials(currentPost.authorName || currentPost.author)}
                </div>
                <div style={{ flex: 1, textAlign: 'left' }}>
                    <div style={{
                        fontWeight: '600',
                        fontSize: '16px',
                        color: '#333',
                        marginBottom: '2px',
                        textAlign: 'left'
                    }}>
                        {currentPost.groupName && (
                            <div style={{
                                display: 'inline-block',
                                backgroundColor: '#f0f2f5',
                                borderRadius: '16px',
                                padding: '4px 8px',
                                marginBottom: '6px',
                                fontSize: '14px',
                                color: '#65676b',
                                fontWeight: '500'
                            }}>
                                <span style={{ marginRight: '4px' }}>👥</span>
                                {currentPost.groupName}
                            </div>
                        )}
                        {!currentPost.groupName && <div style={{ marginBottom: '6px' }}></div>}
                        <div style={{ fontSize: '16px' }}>
                            {currentPost.authorName || currentPost.author || 'Unknown User'}
                        </div>
                    </div>
                    <div style={{
                        fontSize: '14px',
                        color: '#666',
                        fontWeight: '400',
                        textAlign: 'left'
                    }}>
                        {formatDate(currentPost.createdAt)}
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
                    wordWrap: 'break-word',
                    textAlign: 'left'
                }}>
                    {currentPost.content}
                </div>
            )}

            {/*footer */}
            <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '20px'
            }}>
                {/*like button */}
                <MyButton variant="like" onClick={handleLike}>
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
                </MyButton>
                <MyButton variant="comment" onClick={handleComment}>
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
                </MyButton>
            </div>

            {/*comment input */}
            {showCommentInput && (
                <CommentInput
                    onSubmit={handleCommentSubmit}
                    onCancel={handleCommentCancel}
                    placeholder="Write a comment..."
                />
            )}

            {/*comments list */}
            <CommentsModel
                key={`${currentPost._id}-${currentPost.comments ? currentPost.comments.length : 0}`}
                post={currentPost}
                isOpen={showCommentsModal}
                onClose={() => setShowCommentsModal(false)}
                onCommentSubmit={handleModalCommentSubmit}
                onCommentEdit={handleCommentEdit}
                onCommentDelete={handleCommentDelete}
            />
        </div>
    );
};

export default Post;
