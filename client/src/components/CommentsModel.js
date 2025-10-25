import React, { useState } from 'react';
import CommentInput from './CommentInput';
import Comment from './Comment';
import UserInfo from './UserInfo';

const CommentsModel = ({ post, isOpen, onClose, onCommentSubmit, onCommentEdit, onCommentDelete }) => {
    const [showCommentInput, setShowCommentInput] = useState(false);


    if (!isOpen) return null;

    const handleCommentSubmit = (commentText) => {
        onCommentSubmit(commentText);
        setShowCommentInput(false);
    };

    const handleCommentCancel = () => {
        setShowCommentInput(false);
    };


    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toISOString().split('T')[0];
    };


    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '20px'
        }}>
            <div style={{
                backgroundColor: 'white',
                borderRadius: '12px',
                width: '100%',
                maxWidth: '600px',
                maxHeight: '80vh',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)'
            }}>
                {/*header */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '20px 24px',
                    borderBottom: '1px solid #e9ecef',
                    backgroundColor: '#f8f9fa'
                }}>
                    <h2 style={{
                        margin: 0,
                        fontSize: '20px',
                        fontWeight: '600',
                        color: '#333'
                    }}>
                        Comments
                    </h2>
                    <button
                        onClick={onClose}
                        style={{
                            background: 'none',
                            border: 'none',
                            fontSize: '24px',
                            cursor: 'pointer',
                            color: '#666',
                            padding: '4px',
                            borderRadius: '4px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '32px',
                            height: '32px'
                        }}
                        onMouseEnter={(e) => e.target.style.backgroundColor = '#e9ecef'}
                        onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                    >
                        ×
                    </button>
                </div>

                {/*content */}
                <div style={{
                    flex: 1,
                    overflow: 'auto',
                    padding: '24px'
                }}>
                    {/*original post */}
                    <div style={{
                        marginBottom: '20px'
                    }}>
                        <div style={{
                            marginBottom: '12px'
                        }}>
                            <UserInfo
                                userId={post.authorId}
                                userName={post.authorName || post.author}
                                profilePicture={post.authorProfilePicture}
                                size="small"
                                date={formatDate(post.createdAt)}
                            />
                        </div>
                        <div style={{
                            fontSize: '16px',
                            lineHeight: '1.5',
                            color: '#333',
                            marginLeft: '52px',
                            marginBottom: '16px'
                        }}>
                            {post.content}
                        </div>
                    </div>

                    {/*comments */}
                    {post.comments && post.comments.length > 0 && (
                        <div>
                            <div style={{
                                fontSize: '16px',
                                fontWeight: '600',
                                color: '#333',
                                marginBottom: '16px'
                            }}>
                                {post.comments.length} Comment{post.comments.length !== 1 ? 's' : ''}
                            </div>
                            {post.comments.map((comment, index) => (
                                <Comment
                                    key={index}
                                    comment={comment}
                                    post={post}
                                    onEdit={onCommentEdit}
                                    onDelete={onCommentDelete}
                                />
                            ))}
                        </div>
                    )}

                    {/* add comment */}
                    <div style={{
                        marginTop: '24px',
                        padding: '16px',
                        backgroundColor: '#f8f9fa',
                        borderRadius: '8px',
                        border: '1px solid #e9ecef'
                    }}>
                        <div style={{
                            fontSize: '16px',
                            fontWeight: '600',
                            color: '#333',
                            marginBottom: '12px'
                        }}>
                            Add a comment
                        </div>
                        <CommentInput
                            onSubmit={handleCommentSubmit}
                            onCancel={handleCommentCancel}
                            placeholder="Write your comment..."
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CommentsModel;
