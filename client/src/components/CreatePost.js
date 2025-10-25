import React, { useState } from 'react';
import axios from 'axios';
import { useUserContext } from '../context/UserContext';
import ProfilePicture from './ProfilePicture';
import MyAlert from './MyAlert';
import useMyAlert from '../hooks/useMyAlert';
import ExtraInput from './ExtraInput';

const CreatePost = ({ onPostCreated, groupId = null, onImageClick, onVideoClick }) => {
    const { user } = useUserContext();
    const [postText, setPostText] = useState('');
    const { alert, showSuccess, showError, hideAlert } = useMyAlert();

    const handleSubmit = () => {
        if (postText.trim()) {
            // Handle post creation internally
            const postData = {
                content: postText.trim(),
                author: user?.username || user?.name || 'You',
                authorId: user?.id,
                authorProfilePicture: user?.profilePicture,
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
                    showSuccess('Post created successfully!');
                    // Call parent component with the created post
                    if (onPostCreated) {
                        onPostCreated(res.data.post);
                    }
                    setPostText('');
                })
                .catch(err => {
                    console.error('Error creating post:', err);
                    showError('Failed to create post. Please try again.');
                });
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit();
        }
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
                {/* User Profile Picture */}
                <ProfilePicture
                    currentImage={user?.profilePicture}
                    size="small"
                    editMode={false}
                    userId={user?.id}
                />

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

            {/* Extra Input Options */}
            <div style={{
                marginTop: '12px',
                paddingTop: '12px',
                borderTop: '1px solid #e9ecef'
            }}>
                <ExtraInput
                    onImageClick={onImageClick}
                    onVideoClick={onVideoClick}
                />
            </div>

            {/* MyAlert Component */}
            <MyAlert
                show={alert.show}
                message={alert.message}
                type={alert.type}
                duration={alert.duration}
                onClose={hideAlert}
            />
        </div>
    );
};

export default CreatePost;
