import React, { useState } from 'react';
import ExtraInput from './ExtraInput';

function CommentInput({ onCancel, onSubmit, placeholder = "Write a comment..." }) {
    const [commentText, setCommentText] = useState('');

    const handleImageClick = () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.onchange = (e) => {
            const file = e.target.files[0];
            if (file) {
                // TODO: Implement actual image upload logic for comments
                console.log('Uploading image for comment:', file);
            }
        };
        input.click();
    };

    const handleVideoClick = () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'video/*';
        input.onchange = (e) => {
            const file = e.target.files[0];
            if (file) {
                // TODO: Implement actual video upload logic for comments
                console.log('Uploading video for comment:', file);
            }
        };
        input.click();
    };

    const handleSubmit = () => {
        if (commentText.trim()) {
            onSubmit(commentText.trim());
            setCommentText('');
        }
    };

    const handleCancel = () => {
        setCommentText('');
        onCancel();
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
            marginTop: '12px',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
            border: '1px solid #e9ecef'
        }}>
            {/*text input area */}
            <textarea
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={placeholder}
                style={{
                    width: '100%',
                    minHeight: '80px',
                    border: 'none',
                    outline: 'none',
                    resize: 'vertical',
                    fontSize: '16px',
                    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", sans-serif',
                    lineHeight: '1.5',
                    padding: '12px',
                    borderRadius: '8px',
                    backgroundColor: 'white',
                    marginBottom: '12px',
                    boxSizing: 'border-box'
                }}
                autoFocus
            />

            {/*bottom row with icons and buttons */}
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
            }}>

                {/* action buttons */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                }}>
                    {/* cancel button */}
                    <button
                        onClick={handleCancel}
                        style={{
                            background: '#e9ecef',
                            border: 'none',
                            borderRadius: '6px',
                            padding: '8px 16px',
                            cursor: 'pointer',
                            color: '#495057',
                            fontSize: '14px',
                            fontWeight: '500',
                            transition: 'background-color 0.2s ease'
                        }}
                        onMouseEnter={(e) => e.target.style.backgroundColor = '#dee2e6'}
                        onMouseLeave={(e) => e.target.style.backgroundColor = '#e9ecef'}
                    >
                        Cancel
                    </button>

                    {/*comment button */}
                    <button
                        onClick={handleSubmit}
                        disabled={!commentText.trim()}
                        style={{
                            background: commentText.trim() ? '#007bff' : '#6c757d',
                            border: 'none',
                            borderRadius: '6px',
                            padding: '8px 16px',
                            cursor: commentText.trim() ? 'pointer' : 'not-allowed',
                            color: 'white',
                            fontSize: '14px',
                            fontWeight: '500',
                            transition: 'background-color 0.2s ease'
                        }}
                        onMouseEnter={(e) => {
                            if (commentText.trim()) {
                                e.target.style.backgroundColor = '#0056b3';
                            }
                        }}
                        onMouseLeave={(e) => {
                            if (commentText.trim()) {
                                e.target.style.backgroundColor = '#007bff';
                            }
                        }}
                    >
                        Comment
                    </button>
                </div>
            </div>
        </div>
    );
}

export default CommentInput;
