import React, { useState } from 'react';
import axios from 'axios';
import { useUserContext } from '../context/UserContext';

const CreatePost = ({ onPostCreated, groupId = null }) => {
    const { user } = useUserContext();
    const [postText, setPostText] = useState('');

    const handleSubmit = () => {
        if (postText.trim()) {
            // Handle post creation internally
            const postData = {
                content: postText.trim(),
                author: user?.username || user?.name || 'You',
                authorId: user?.id,
            };

            if (groupId) {
                postData.groupId = groupId;
            }

            axios.post('http://localhost:3001/api/posts', {
                command: 'create',
                data: postData
            })
                .then(res => {
                    console.log('Post created successfully:', res.data);
                    // Call parent component with the created post
                    if (onPostCreated) {
                        onPostCreated(res.data.post);
                    }
                    setPostText('');
                })
                .catch(err => {
                    console.error('Error creating post:', err);
                    // TODO: Show error message to user
                });
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit();
        }
    };

    const getInitials = (name) => {
        if (!name) return '?';
        return name.split(' ').map(n => n[0]).join('').toUpperCase();
    };

    return (
        <div style={{
            background: '#f8f9fa',
            borderRadius: '12px',
            padding: '16px',
            marginBottom: '20px',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
            border: '1px solid #e9ecef'
        }}>
            <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
            }}>
                {/* User Avatar */}
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
                    flexShrink: 0
                }}>
                    {getInitials(user?.username || user?.name || 'Y')}
                </div>

                {/* Text Input */}
                <div style={{ flex: 1 }}>
                    <input
                        type="text"
                        value={postText}
                        onChange={(e) => setPostText(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="What's on your mind?"
                        style={{
                            width: '100%',
                            padding: '12px 16px',
                            border: 'none',
                            outline: 'none',
                            borderRadius: '8px',
                            fontSize: '16px',
                            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", sans-serif',
                            backgroundColor: '#f1f3f4',
                            color: '#333',
                            boxSizing: 'border-box'
                        }}
                    />
                </div>

                {/* Post Button */}
                <button
                    onClick={handleSubmit}
                    disabled={!postText.trim()}
                    style={{
                        background: postText.trim() ? '#495057' : '#6c757d',
                        border: 'none',
                        borderRadius: '8px',
                        padding: '12px 20px',
                        cursor: postText.trim() ? 'pointer' : 'not-allowed',
                        color: 'white',
                        fontSize: '14px',
                        fontWeight: '600',
                        transition: 'background-color 0.2s ease',
                        flexShrink: 0
                    }}
                    onMouseEnter={(e) => {
                        if (postText.trim()) {
                            e.target.style.backgroundColor = '#343a40';
                        }
                    }}
                    onMouseLeave={(e) => {
                        if (postText.trim()) {
                            e.target.style.backgroundColor = '#495057';
                        }
                    }}
                >
                    Post
                </button>
            </div>
        </div>
    );
};

export default CreatePost;
