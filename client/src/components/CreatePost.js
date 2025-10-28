import React, { useState } from 'react';
import axios from 'axios';
import { useUserContext } from '../context/UserContext';
import ProfilePicture from './ProfilePicture';
import MyAlert from './MyAlert';
import useMyAlert from '../hooks/useMyAlert';
import ExtraInput from './ExtraInput';
import VideoPreview from './VideoPreview';
import MyButton from './MyButton';

function CreatePost({ onPostCreated, groupId = null }) {
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

    const handleVideoClick = async () => {
        //create file input element
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'video/*';

        input.onchange = async (e) => {
            const file = e.target.files[0];
            if (file) {
                try {
                    //validate file size (limit of 50MB)
                    if (file.size > 50 * 1024 * 1024) {
                        showError('Video file is too large. Please select a video smaller than 50MB.');
                        return;
                    }

                    //validate file type
                    if (!file.type.startsWith('video/')) {
                        showError('Please select a valid video file.');
                        return;
                    }

                    //create FormData for server upload
                    const formData = new FormData();
                    formData.append('userId', user.id);
                    formData.append('video', file);

                    //add groupId if this is a group post
                    if (groupId) {
                        formData.append('groupId', groupId);
                    }

                    //upload to server
                    const response = await axios.post('http://localhost:3001/api/posts/upload-video', formData, {
                        headers: {
                            'Content-Type': 'multipart/form-data'
                        }
                    });

                    if (response.data.success) {
                        showSuccess('Video uploaded successfully!');

                        //add the uploaded video to the videos array
                        const videoUrl = response.data.videoUrl;
                        setUploadedVideos(prevVideos => [...prevVideos, {
                            url: videoUrl,
                            filename: response.data.filename,
                            type: 'uploaded'
                        }]);
                    } else {
                        showError('Failed to upload video: ' + (response.data.message || 'Unknown error'));
                    }
                } catch (error) {
                    console.error('Video upload error:', error);
                    showError('Failed to upload video: ' + (error.response?.data?.message || error.message));
                }
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
                videos: uploadedVideos.map(video => ({
                    url: video.url,
                    type: video.type || (video.videoId ? 'youtube' : 'uploaded'),
                    filename: video.filename,
                    videoId: video.videoId,
                    originalUrl: video.originalUrl
                })),
            };

            if (groupId) {
                postData.groupId = groupId;
            }

            axios.post('http://localhost:3001/api/posts', postData)
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
                {/*user profile picture */}
                <ProfilePicture
                    currentImage={user?.profilePicture}
                    size="small"
                    editMode={false}
                    userId={user?.id}
                />

                {/* text input */}
                <div style={{ flex: 1, position: 'relative' }}>
                    <input
                        type="text"
                        value={postText}
                        onChange={(e) => setPostText(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="What's on your mind?"
                        maxLength="2000"
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
                    <small style={{
                        color: '#6c757d',
                        fontSize: '12px',
                        position: 'absolute',
                        bottom: '5px',
                        right: '10px'
                    }}>
                        {postText.length}/2000
                    </small>
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

                {/* video previews */}
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
                <MyButton
                    variant="primary"
                    onClick={handleSubmit}
                    disabled={!postText.trim() && uploadedImages.length === 0 && uploadedVideos.length === 0}
                    style={{
                        flexShrink: 0
                    }}
                >
                    Post
                </MyButton>
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
}

export default CreatePost;
