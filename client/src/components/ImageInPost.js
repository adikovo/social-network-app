import React from 'react';
import MyButton from './MyButton';

const ImageInPost = ({
    image,
    index,
    onImageClick,
    onRemoveImage,
    variant = 'normal',
    containerStyle = {}
}) => {
    if (!image) return null;

    const isEditMode = variant === 'edit';

    return (
        <div
            style={{
                position: 'relative',
                overflow: 'hidden',
                borderRadius: '8px',
                backgroundColor: '#f8f9fa',
                ...(isEditMode && {
                    border: '2px dashed #e0e0e0'
                }),
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
                    cursor: isEditMode ? 'default' : 'pointer',
                    transition: 'transform 0.2s ease',
                    ...(isEditMode && {
                        opacity: 0.8
                    })
                }}
                onMouseEnter={(e) => {
                    if (!isEditMode) {
                        e.target.style.transform = 'scale(1.02)';
                    }
                }}
                onMouseLeave={(e) => {
                    if (!isEditMode) {
                        e.target.style.transform = 'scale(1)';
                    }
                }}
                onClick={() => {
                    if (!isEditMode && onImageClick) {
                        onImageClick(index);
                    }
                }}
                onError={(e) => {
                    e.target.style.display = 'none';
                }}
            />

            {/* x button for delete image inedit mode */}
            {isEditMode && onRemoveImage && (
                <MyButton
                    variant="close"
                    onClick={() => onRemoveImage(index)}
                    style={{
                        position: 'absolute',
                        top: '8px',
                        right: '8px',
                        width: '24px',
                        height: '24px',
                        padding: '0',
                        fontSize: '12px',
                        borderRadius: '50%',
                        minWidth: '24px'
                    }}
                >
                    ×
                </MyButton>
            )}
        </div>
    );
};

export default ImageInPost;
