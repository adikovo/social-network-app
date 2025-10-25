import React from 'react';
import MyButton from './myButton';

const ImageView = ({
    images,
    currentIndex,
    isOpen,
    onClose,
    onPrevious,
    onNext
}) => {
    if (!isOpen || !images || images.length === 0) return null;

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.9)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
        }}>
            {/* Close button */}
            <MyButton
                variant="close"
                onClick={onClose}
            >
                ×
            </MyButton>

            {/* Previous button */}
            {images.length > 1 && (
                <MyButton
                    variant="navPrev"
                    onClick={onPrevious}
                >
                    ‹
                </MyButton>
            )}

            {/* Next button */}
            {images.length > 1 && (
                <MyButton
                    variant="navNext"
                    onClick={onNext}
                >
                    ›
                </MyButton>
            )}

            {/* Image */}
            <img
                src={`http://localhost:3001${images[currentIndex]}`}
                alt={`Post image ${currentIndex + 1}`}
                style={{
                    maxWidth: '90%',
                    maxHeight: '90%',
                    objectFit: 'contain',
                    borderRadius: '8px'
                }}
            />

            {/* Image counter */}
            {images.length > 1 && (
                <div style={{
                    position: 'absolute',
                    bottom: '20px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    background: 'rgba(0, 0, 0, 0.7)',
                    color: 'white',
                    padding: '8px 16px',
                    borderRadius: '20px',
                    fontSize: '14px',
                    zIndex: 10000
                }}>
                    {currentIndex + 1} / {images.length}
                </div>
            )}
        </div>
    );
};

export default ImageView;
