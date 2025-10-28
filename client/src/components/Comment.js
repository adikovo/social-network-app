import React, { useState, useEffect } from 'react';
import ThreeDotMenu from './ThreeDotMenu';
import UserInfo from './UserInfo';
import { useUserContext } from '../context/UserContext';
import axios from 'axios';

function Comment({ comment, onEdit, onDelete, post }) {
    const { user } = useUserContext();
    const [isEditing, setIsEditing] = useState(false);
    const [editText, setEditText] = useState(comment.content || '');

    // Check if current user is the author of the comment
    const isAuthor = user && (user.id === comment.authorId || user.username === comment.author || user.name === comment.author);

    // State for group admin check
    const [isGroupAdmin, setIsGroupAdmin] = useState(false);
    const [isCheckingAdmin, setIsCheckingAdmin] = useState(false);

    // Check if current user is a group admin (if post is in a group)
    useEffect(() => {
        const checkGroupAdmin = async () => {
            if (post && post.groupId && user && !isAuthor) {
                setIsCheckingAdmin(true);
                try {
                    const response = await axios.get('http://localhost:3001/api/groups/check-admin', {
                        params: {
                            userId: user.id,
                            groupId: post.groupId
                        }
                    });
                    setIsGroupAdmin(response.data.isAdmin || false);
                } catch (error) {
                    console.error('Error checking group admin:', error);
                    setIsGroupAdmin(false);
                } finally {
                    setIsCheckingAdmin(false);
                }
            } else {
                setIsGroupAdmin(false);
            }
        };

        checkGroupAdmin();
    }, [post, user, isAuthor]);

    // Show menu if user is comment author OR group admin
    const canManageComment = isAuthor || isGroupAdmin;

    const handleEditComment = () => {
        setIsEditing(true);
        setEditText(comment.content || '');
    };

    const handleSaveEdit = () => {
        if (onEdit) {
            onEdit(comment, editText);
        }
        setIsEditing(false);
    };

    const handleCancelEdit = () => {
        setIsEditing(false);
        setEditText(comment.content || '');
    };

    const handleDeleteComment = () => {
        if (onDelete) {
            onDelete(comment);
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toISOString().split('T')[0];
    };


    return (
        <div style={{
            marginBottom: '16px',
            padding: '16px',
            backgroundColor: '#f8f9fa',
            borderRadius: '8px',
            border: '1px solid #e9ecef',
            position: 'relative'
        }}>
            {/* 3 dot menu - positioned in top-right corner */}
            {canManageComment && (
                <div style={{
                    position: 'absolute',
                    top: '8px',
                    right: '8px',
                    zIndex: 10
                }}>
                    <ThreeDotMenu
                        menuItems={(() => {
                            const items = [];
                            if (isAuthor) {
                                items.push({ id: 'edit', label: 'Edit Comment', action: 'edit' });
                            }
                            items.push({ id: 'delete', label: 'Delete Comment', action: 'delete', danger: true });
                            return items;
                        })()}
                        onItemClick={(item) => {
                            if (item.action === 'edit') {
                                handleEditComment();
                            } else if (item.action === 'delete') {
                                handleDeleteComment();
                            }
                        }}
                    />
                </div>
            )}

            <div style={{
                marginBottom: '8px'
            }}>
                <UserInfo
                    userId={comment.authorId}
                    userName={comment.authorName || comment.author}
                    profilePicture={comment.authorProfilePicture}
                    size="small"
                    date={comment.createdAt ? formatDate(comment.createdAt) : 'Unknown date'}
                />
            </div>

            {/* comment content or edit form */}
            {isEditing ? (
                <div style={{ marginLeft: '44px' }}>
                    <textarea
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        style={{
                            width: '100%',
                            minHeight: '60px',
                            padding: '8px',
                            border: '1px solid #e0e0e0',
                            borderRadius: '6px',
                            fontSize: '14px',
                            lineHeight: '1.4',
                            color: '#333',
                            backgroundColor: 'white',
                            fontFamily: 'inherit',
                            resize: 'vertical',
                            outline: 'none',
                            boxSizing: 'border-box'
                        }}
                        placeholder="Edit your comment..."
                    />
                    <div style={{
                        display: 'flex',
                        gap: '8px',
                        marginTop: '8px'
                    }}>
                        <button
                            onClick={handleSaveEdit}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '4px',
                                padding: '6px 12px',
                                backgroundColor: '#333',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                fontSize: '12px',
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
                                gap: '4px',
                                padding: '6px 12px',
                                backgroundColor: 'white',
                                color: '#666',
                                border: '1px solid #e0e0e0',
                                borderRadius: '4px',
                                fontSize: '12px',
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
                    fontSize: '14px',
                    color: '#333',
                    lineHeight: '1.4',
                    marginLeft: '44px',
                    textAlign: 'left',
                    whiteSpace: 'pre-wrap'
                }}>
                    {comment.content}
                </div>
            )}
        </div>
    );
}

export default Comment;
