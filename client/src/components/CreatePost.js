import React, { useState } from 'react';
import axios from 'axios';
import { useUserContext } from '../context/UserContext';
import ProfilePicture from './ProfilePicture';
import MyAlert from './MyAlert';
import useMyAlert from '../hooks/useMyAlert';
import ExtraInput from './ExtraInput';
import VideoPreview from './VideoPreview';

const CreatePost = ({ onPostCreated, groupId = null }) => {
    const { user } = useUserContext();
    const [postText, setPostText] = useState('');
    const [uploadedImages, setUploadedImages] = useState([]);
    const [uploadedVideos, setUploadedVideos] = useState([]);
    const { alert, showSuccess, showError, hideAlert } = useMyAlert();

    //extract youtube video id from url
    const extractVideoId = (url) => {

        const regex = /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/;
        const match = url.match(regex);
        return match ? match[1] : null;
    };

    // convert youtube url to embed url
    const convertToEmbedUrl = (videoUrl) => {
        const videoId = extractVideoId(videoUrl);
        if (!videoId) {
            return null;
        }
        return `https://www.youtube.com/embed/${videoId}`;
    };

    const handleImageClick = async () => {
        //create file input element
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';


        input.onchange = async (e) => {
            const file = e.target.files[0];
            if (file) {
                try {
                    //validate file size (max 5MB)
                    if (file.size > 5 * 1024 * 1024) {
                        showError('Image file is too large. Please select an image smaller than 5MB.');
                        return;
                    }

                    //validate file type
                    if (!file.type.startsWith('image/')) {
                        showError('Please select a valid image file.');
                        return;
                    }

                    //create FormData for server upload
                    const formData = new FormData();
                    formData.append('userId', user.id);
                    formData.append('image', file);

                    //add groupId if this is a group post
                    if (groupId) {
                        formData.append('groupId', groupId);
                    }


                    //upload to server
                    const response = await axios.post('http://localhost:3001/api/posts/upload-image', formData, {
                        headers: {
                            'Content-Type': 'multipart/form-data'
                        }
                    });

                    if (response.data.success) {
                        showSuccess('Image uploaded successfully!');
                        console.log('Image upload response:', response.data);

                        //add the uploaded image to the images array
                        const imageUrl = response.data.imageUrl;
                        setUploadedImages(prevImages => [...prevImages, {
                            url: imageUrl,
                            filename: response.data.filename
                        }]);

                    } else {
                        showError('Failed to upload image: ' + (response.data.message || 'Unknown error'));
                    }

                } catch (error) {
                    console.error('Image upload error:', error);
                    showError('Failed to upload image: ' + (error.response?.data?.message || error.message));
                }
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
                // TODO: Implement actual video upload logic
                if (groupId) {
                    console.log('Uploading video for group post in group:', groupId);
                } else {
                    console.log('Uploading video for feed post');
                }
                console.log('Selected video:', file);
            }
        };
        input.click();
    };

    const handleYouTubeClick = () => {
        const youtubeUrl = prompt("Paste YouTube URL:");

        if (youtubeUrl && youtubeUrl.trim()) {
            // convert youtube url to embed url
            const embedUrl = convertToEmbedUrl(youtubeUrl);
            if (!embedUrl) {
                showError('Please enter a valid YouTube URL');
                return;
            }

            //add to uploaded videos state
            const videoId = extractVideoId(youtubeUrl);
            setUploadedVideos(prev => [...prev, {
                url: embedUrl,
                videoId: videoId,
                originalUrl: youtubeUrl
            }]);
            showSuccess('YouTube video added successfully!');
        }
    };

    const handleSubmit = () => {
        if (postText.trim() || uploadedImages.length > 0 || uploadedVideos.length > 0) {
            //handle post creation internally
            const postData = {
                content: postText.trim(),
                author: user?.username || user?.name || 'You',
                authorId: user?.id,
                authorProfilePicture: user?.profilePicture,
                //map the uploaded images to the post data
                images: uploadedImages.map(img => img.url),
                //map the uploaded videos to the post data
                videos: uploadedVideos.map(video => video.url),
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
                    setUploadedImages([]);
                    setUploadedVideos([]);
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

                {/*image previews */}
                {uploadedImages.length > 0 && (
                    <div style={{
                        marginTop: '12px',
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: '8px'
                    }}>
                        {uploadedImages.map((image, index) => (
                            <div key={index} style={{
                                position: 'relative',
                                display: 'inline-block'
                            }}>
                                <img
                                    src={`http://localhost:3001${image.url}`}
                                    alt={`Uploaded image ${index + 1}`}
                                    style={{
                                        width: '80px',
                                        height: '80px',
                                        objectFit: 'cover',
                                        borderRadius: '8px',
                                        border: '1px solid #e9ecef'
                                    }}
                                />
                                <button
                                    onClick={() => {
                                        setUploadedImages(prev => prev.filter((_, i) => i !== index));
                                    }}
                                    style={{
                                        position: 'absolute',
                                        top: '-8px',
                                        right: '-8px',
                                        background: '#dc3545',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '50%',
                                        width: '20px',
                                        height: '20px',
                                        fontSize: '12px',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}
                                >
                                    ×
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                {/* youtube video previews */}
                {uploadedVideos.length > 0 && (
                    <div style={{
                        marginTop: '12px',
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: '8px'
                    }}>
                        {uploadedVideos.map((video, index) => (
                            <VideoPreview
                                key={index}
                                video={video}
                                index={index}
                                onRemove={(index) => {
                                    setUploadedVideos(prev => prev.filter((_, i) => i !== index));
                                }}
                            />
                        ))}
                    </div>
                )}

                {/*post button */}
                <button
                    onClick={handleSubmit}
                    disabled={!postText.trim() && uploadedImages.length === 0 && uploadedVideos.length === 0}
                    style={{
                        background: (postText.trim() || uploadedImages.length > 0 || uploadedVideos.length > 0) ? '#495057' : '#6c757d',
                        border: 'none',
                        borderRadius: '8px',
                        padding: '12px 20px',
                        cursor: (postText.trim() || uploadedImages.length > 0 || uploadedVideos.length > 0) ? 'pointer' : 'not-allowed',
                        color: 'white',
                        fontSize: '14px',
                        fontWeight: '600',
                        transition: 'background-color 0.2s ease',
                        flexShrink: 0
                    }}
                    onMouseEnter={(e) => {
                        if (postText.trim() || uploadedImages.length > 0 || uploadedVideos.length > 0) {
                            e.target.style.backgroundColor = '#343a40';
                        }
                    }}
                    onMouseLeave={(e) => {
                        if (postText.trim() || uploadedImages.length > 0 || uploadedVideos.length > 0) {
                            e.target.style.backgroundColor = '#495057';
                        }
                    }}
                >
                    Post
                </button>
            </div>

            {/*extra input options */}
            <div style={{
                marginTop: '12px',
                paddingTop: '12px',
                borderTop: '1px solid #e9ecef'
            }}>
                <ExtraInput
                    onImageClick={handleImageClick}
                    onVideoClick={handleVideoClick}
                    onYouTubeClick={handleYouTubeClick}
                />
            </div>

            {/*myAlert component */}
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
