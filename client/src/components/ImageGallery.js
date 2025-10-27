import React from 'react';
import ImageInPost from './ImageInPost';

function ImageGallery({ images, onImageClick }) {
    if (!images || images.length === 0) return null;


    //get the style for image container based on number of images
    const getImageContainerStyle = (index, totalImages) => {
        if (totalImages === 1) {
            return {
                aspectRatio: '16/10',
                maxHeight: '400px'
            };
        } else if (totalImages === 3 && index === 0) {
            return {
                gridColumn: '1 / -1',
                aspectRatio: '16/10',
                maxHeight: '300px'
            };
        } else {
            return {
                aspectRatio: '1/1'
            };
        }
    };

    //get the style for image grid based on number of images
    const getGridStyle = (totalImages) => {
        if (totalImages === 1) {
            return {
                gridTemplateColumns: '1fr',
                maxWidth: '100%'
            };
        } else {
            return {
                gridTemplateColumns: '1fr 1fr'
            };
        }
    };

    return (
        <div style={{
            marginBottom: '16px',
            display: 'grid',
            gap: '8px',
            ...getGridStyle(images.length)
        }}>
            {images.map((image, index) => (
                <ImageInPost
                    key={index}
                    image={image}
                    index={index}
                    onImageClick={onImageClick}
                    containerStyle={getImageContainerStyle(index, images.length)}
                />
            ))}
        </div>
    );
}

export default ImageGallery;
