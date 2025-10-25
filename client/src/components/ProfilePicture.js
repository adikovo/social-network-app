import React, { useState, useRef, useEffect } from 'react';

function ProfilePicture({
    userId = null,
    currentImage,
    onImageChange,
    size = 'medium',
    editMode = false
}) {

    const [image, setImage] = useState(() => {
        if (currentImage && currentImage.startsWith('/uploads/')) {
            return `http://localhost:3001${currentImage}`;
        }
        return currentImage;
    });
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef(null);

    //update local image state when currentImage prop changes
    useEffect(() => {
        if (currentImage) {
            // If the image is a relative path (starts with /uploads/), make it a full URL
            const imageUrl = currentImage.startsWith('/uploads/')
                ? `http://localhost:3001${currentImage}`
                : currentImage;
            setImage(imageUrl);
        } else {
            setImage(currentImage);
        }
    }, [currentImage]);

    const handleImageClick = () => {
        if (editMode) {
            fileInputRef.current?.click();
        }
    };

    const handleFileChange = async (event) => {

        const file = event.target.files[0];
        if (file) {
            setIsUploading(true);

            //create preview url for the image
            const previewUrl = URL.createObjectURL(file);
            setImage(previewUrl);

            //call parent onChange 
            if (onImageChange) {
                await onImageChange(file);
            }
            setIsUploading(false);
        }
    }

    const getSizeStyle = () => {
        switch (size) {
            case 'small':
                return { width: '40px', height: '40px' };
            case 'large':
                return { width: '120px', height: '120px' };
            default:
                return { width: '80px', height: '80px' };
        }
    }

    return (
        <div style={{ position: 'relative', display: 'inline-block' }}>
            <img
                src={image || '/images/default-avatar.png'}
                alt="Profile"
                onClick={handleImageClick}
                style={{
                    ...getSizeStyle(),
                    borderRadius: '50%',
                    objectFit: 'cover',
                    cursor: editMode ? 'pointer' : 'default',
                    border: '2px solid #e0e0e0',
                    transition: 'opacity 0.2s ease',
                    display: 'block'
                }}
                onMouseEnter={(e) => {
                    if (editMode) {
                        e.target.style.opacity = '0.8';
                    }
                }}
                onMouseLeave={(e) => {
                    if (editMode) {
                        e.target.style.opacity = '1';
                    }
                }}
            />
            {/*file input for image upload */}
            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                style={{ display: 'none' }}
            />
            {isUploading && (
                <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    borderRadius: '50%',
                    display: 'flex',
                    justifyContent: 'center',
                    color: 'white',
                    fontSize: '12px'
                }}>
                    Uploading...
                </div>
            )}
        </div>
    )
}

export default ProfilePicture;