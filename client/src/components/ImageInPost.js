import React from 'react';

const ImageInPost = ({
    image,
    index,
    onImageClick,
    containerStyle = {}
}) => {
    if (!image) return null;

    return (
        <div
            style={{
                position: 'relative',
                overflow: 'hidden',
                borderRadius: '8px',
                backgroundColor: '#f8f9fa',
                ...containerStyle
            }}
        >
            <img
                src={`http://localhost:3001${image}`}
                alt={`Post image ${index + 1}`}
                style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    cursor: 'pointer',
                    transition: 'transform 0.2s ease'
                }}
                onMouseEnter={(e) => {
                    e.target.style.transform = 'scale(1.02)';
                }}
                onMouseLeave={(e) => {
                    e.target.style.transform = 'scale(1)';
                }}
                onClick={() => {
                    onImageClick(index);
                }}
                onError={(e) => {
                    e.target.style.display = 'none';
                }}
            />
        </div>
    );
};

export default ImageInPost;
