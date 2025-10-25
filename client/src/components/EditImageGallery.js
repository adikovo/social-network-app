import React from 'react';
import ImageInPost from './ImageInPost';

const EditImageGallery = ({ images, removedImages, onRemoveImage }) => {
    if (!images || images.length === 0) return null;

    const getImageContainerStyle = (index, totalImages) => {
        if (totalImages === 1) {
            return {
                aspectRatio: '16/10',
                maxHeight: '200px'
            };
        } else if (totalImages === 3 && index === 0) {
            return {
                gridColumn: '1 / -1',
                aspectRatio: '16/10',
                maxHeight: '150px'
            };
        } else {
            return {
                aspectRatio: '1/1'
            };
        }
    };

    const getGridStyle = (totalImages) => {
        if (totalImages === 1) {
            return {
                gridTemplateColumns: '1fr',
                maxWidth: '100%'
            };
        } else if (totalImages === 2) {
            return {
                gridTemplateColumns: '1fr 1fr'
            };
        } else {
            return {
                gridTemplateColumns: '1fr 1fr'
            };
        }
    };

    const visibleImages = images.filter((_, i) => !removedImages.includes(i));

    return (
        <div style={{ marginTop: '12px' }}>
            <p style={{
                fontSize: '12px',
                color: '#666',
                marginBottom: '8px'
            }}>
                {visibleImages.length} {visibleImages.length === 1 ? 'image' : 'images'} attached
            </p>
            <div style={{
                display: 'grid',
                gap: '8px',
                ...getGridStyle(images.length)
            }}>
                {images.map((image, index) => (
                    !removedImages.includes(index) && (
                        <ImageInPost
                            key={index}
                            image={image}
                            index={index}
                            variant="edit"
                            onRemoveImage={onRemoveImage}
                            containerStyle={getImageContainerStyle(index, images.length)}
                        />
                    )
                ))}
            </div>
        </div>
    );
};

export default EditImageGallery;
