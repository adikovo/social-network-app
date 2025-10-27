import React from 'react';
import MyButton from './MyButton';

const VideoInPost = ({

    video,
    index,
    onVideoClick,
    onRemoveVideo,
    variant,
    containerStyle
}) => {
    console.log('VideoInPost - video:', video, 'variant:', variant, 'index:', index);

    const handleVideoClick = () => {
        if (variant === 'edit') return; // Don't play in edit mode
        if (onVideoClick) {
            onVideoClick(index);
        }
    };

    const handleRemoveClick = (e) => {
        e.stopPropagation();
        if (onRemoveVideo) {
            onRemoveVideo(index);
        }
    };

    const getVideoStyle = () => {
        const baseStyle = {
            width: '100%',
            height: '100%',
            minHeight: '200px',
            borderRadius: '8px',
            border: '1px solid #e5e7eb',
            cursor: variant === 'edit' ? 'default' : 'pointer',
            transition: 'all 0.2s ease'
        };

        if (variant === 'edit') {
            return {
                ...baseStyle,
                opacity: 0.7,
                border: '2px dashed #d1d5db',
                cursor: 'default'
            };
        }

        return baseStyle;
    };

    const getContainerStyle = () => {
        const baseStyle = {
            position: 'relative',
            display: 'inline-block',
            overflow: 'hidden',
            borderRadius: '8px',
            ...containerStyle
        };

        if (variant === 'edit') {
            return {
                ...baseStyle,
                border: '2px dashed #d1d5db',
                opacity: 0.7
            };
        }

        return baseStyle;
    };

    return (
        <div
            style={getContainerStyle()}
            onClick={handleVideoClick}
            onMouseEnter={(e) => {
                if (variant !== 'edit') {
                    e.target.style.transform = 'scale(1.02)';
                }
            }}
            onMouseLeave={(e) => {
                if (variant !== 'edit') {
                    e.target.style.transform = 'scale(1)';
                }
            }}
        >
            <iframe
                src={`${video.url}?rel=0&showinfo=0&modestbranding=1&iv_load_policy=3&fs=1`}
                title={`YouTube video ${index + 1}`}
                style={getVideoStyle()}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
            />

            {/* Remove Button (Edit Mode) */}
            {variant === 'edit' && onRemoveVideo && (
                <div style={{
                    position: 'absolute',
                    top: '8px',
                    right: '8px',
                    zIndex: 3
                }}>
                    <MyButton
                        variant="close"
                        onClick={handleRemoveClick}
                    >
                        ×
                    </MyButton>
                </div>
            )}
        </div>
    );
};

export default VideoInPost;
