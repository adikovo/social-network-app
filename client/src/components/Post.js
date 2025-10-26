import React, { useState, useRef, useEffect } from 'react';
import CommentInput from './CommentInput';
import CommentsModel from './CommentsModel';
import ThreeDotMenu from './ThreeDotMenu';
import MyButton from './myButton';
import UserInfo from './UserInfo';
import ImageView from './ImageView';
import ImageGallery from './ImageGallery';
import EditImageGallery from './EditImageGallery';
import VideoGallery from './VideoGallery';
import EditVideoGallery from './EditVideoGallery';
import { useUserContext } from '../context/UserContext';
import axios from 'axios';
import MyAlert from './MyAlert';
import useMyAlert from '../hooks/useMyAlert';

const Post = ({ post, onPostUpdated }) => {
    const { user } = useUserContext();
    const [currentPost, setCurrentPost] = useState(post);
    const [isLiked, setIsLiked] = useState(post.likedBy && post.likedBy.includes(user?.id));
    const [likeCount, setLikeCount] = useState(post.likes || 0);
    const [commentCount, setCommentCount] = useState(post.comments ? post.comments.length : 0);
    const [showCommentInput, setShowCommentInput] = useState(false);
    const [showCommentsModal, setShowCommentsModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editText, setEditText] = useState(post.content || '');
    const [removedImages, setRemovedImages] = useState([]);
    const [removedVideos, setRemovedVideos] = useState([]);
    const [selectedImage, setSelectedImage] = useState(null);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const { alert, showError, hideAlert } = useMyAlert();

    // update currentPost when post prop changes
    useEffect(() => {
        setCurrentPost(post);
        setCommentCount(post.comments ? post.comments.length : 0);
    }, [post]);


    const handleLike = () => {

        const likedState = !isLiked;

        axios.post('http://localhost:3001/api/posts', {
            command: 'like',
            data: {
                postId: currentPost._id,
                isLiked: likedState,
                userId: user.id
            }
        })
            .then(res => {
                console.log('Like post response:', res.data);

                if (res.data.post) {
                    setLikeCount(res.data.post.likes);
                    // update the liked state 
                    setIsLiked(likedState);
                }
            })
            .catch(err => {
                console.error('Like post error:', err);
                //back to original state
                setIsLiked(!likedState);
                setLikeCount(prev => likedState ? prev - 1 : prev + 1)
            });
    };

    const handleComment = () => {
        setShowCommentsModal(true);
    };

    const submitComment = (commentText, closeInput = false) => {
        //API call to add comment
        axios.post('http://localhost:3001/api/posts', {
            command: 'comment',
            data: {
                postId: currentPost._id,
                commentText: commentText,
                author: user?.username || user?.name || 'You',
                userId: user.id,
                authorProfilePicture: user?.profilePicture
            }
        })
            .then(res => {
                //update comment count based on actual comments array
                if (res.data.post && res.data.post.comments) {
                    setCommentCount(res.data.post.comments.length);
                }

                //close input if specified (for inline comment input)
                if (closeInput) {
                    setShowCommentInput(false);
                }

                //update the post with the new comment
                if (onPostUpdated && res.data.post) {
                    onPostUpdated(null, res.data.post);
                    setCurrentPost(res.data.post);
                }
            })
            .catch(err => {
                console.error('Error adding comment:', err);
                //show error message to user
                showError('Failed to add comment. Please try again.');
            });
    };

    const handleCommentSubmit = (commentText) => {
        submitComment(commentText, true); // true = close the input
    };

    const handleModalCommentSubmit = (commentText) => {
        submitComment(commentText, false); // false = don't close input (modal handles its own state)
    };

    const handleCommentEdit = (comment, newText) => {
        // API call to edit comment
        axios.post('http://localhost:3001/api/posts', {
            command: 'edit comment',
            data: {
                postId: currentPost._id,
                commentId: comment._id || comment.createdAt,
                newContent: newText
            }
        })
            .then(res => {
                // Update the post with the edited comment
                if (onPostUpdated && res.data.post) {
                    onPostUpdated(null, res.data.post);
                    setCurrentPost(res.data.post);
                }
            })
            .catch(err => {
                console.error('Edit comment error:', err);
                showError('Failed to edit comment. Please try again.');
            });
    };

    const handleCommentDelete = (comment) => {
        // API call to delete comment
        axios.post('http://localhost:3001/api/posts', {
            command: 'delete comment',
            data: {
                postId: currentPost._id,
                commentId: comment._id || comment.createdAt // Use createdAt as fallback ID
            }
        })
            .then(res => {
                // Update comment count
                if (res.data.post && res.data.post.comments) {
                    setCommentCount(res.data.post.comments.length);
                }

                // Update the post with the deleted comment
                if (onPostUpdated && res.data.post) {
                    onPostUpdated(null, res.data.post);
                    setCurrentPost(res.data.post);
                }
            })
            .catch(err => {
                console.error('Delete comment error:', err);
                showError('Failed to delete comment. Please try again.');
            });
    };

    const handleCommentCancel = () => {
        setShowCommentInput(false);
    };

    const handleImageClick = (imageIndex) => {
        setSelectedImage(currentPost.images);
        setCurrentImageIndex(imageIndex);
    };

    const handleCloseImageModal = () => {
        setSelectedImage(null);
        setCurrentImageIndex(0);
    };

    const handlePreviousImage = () => {
        setCurrentImageIndex(prev =>
            prev === 0 ? selectedImage.length - 1 : prev - 1
        );
    };

    const handleNextImage = () => {
        setCurrentImageIndex(prev =>
            prev === selectedImage.length - 1 ? 0 : prev + 1
        );
    };

    const handleKeyDown = (e) => {
        if (selectedImage) {
            if (e.key === 'Escape') {
                handleCloseImageModal();
            } else if (e.key === 'ArrowLeft') {
                handlePreviousImage();
            } else if (e.key === 'ArrowRight') {
                handleNextImage();
            }
        }
    };

    // keyboard event listener (left right arrows)
    useEffect(() => {
        document.addEventListener('keydown', handleKeyDown);
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [selectedImage]);



    const handleEditPost = () => {
        setIsEditing(true);
        setEditText(post.content || '');
        setRemovedImages([]);
    };

    const handleRemoveImage = (imageIndex) => {
        setRemovedImages([...removedImages, imageIndex]);
    };

    const handleRemoveVideo = (videoIndex) => {
        setRemovedVideos([...removedVideos, videoIndex]);
    };

    const handleSaveEdit = () => {
        axios.post('http://localhost:3001/api/posts', {
            command: 'update',
            data: {
                postId: currentPost._id,
                newContent: editText,
                removedImages: removedImages,
                removedVideos: removedVideos
            }
        })
            .then(res => {
                console.log('Edit post response:', res.data);
                setIsEditing(false);
                setRemovedImages([]);
                setRemovedVideos([]);
                if (onPostUpdated) {
                    onPostUpdated(null, res.data.post);
                }
            })
            .catch(err => {
                console.error('Edit post error:', err);
                //still exit edit mode even if there's an error
                setIsEditing(false);
                setRemovedImages([]);
            });
    };

    const handleCancelEdit = () => {
        setIsEditing(false);
        setEditText(post.content || '');
        setRemovedImages([]);
        setRemovedVideos([]);
    };

    const handleDeletePost = () => {
        axios.post('http://localhost:3001/api/posts', {
            command: 'delete',
            data: {
                postId: post._id,
                userId: user.id
            }
        })
            .then(res => {
                console.log('Delete post response:', res.data);
                //tell parent component to remove the deleted post
                if (onPostUpdated) {
                    onPostUpdated(post._id);
                }
            })
            .catch(err => {
                console.error('Delete post error:', err);
                showError('Failed to delete post. You may not have permission to delete this post.');
            });
    };

    //check if current user is the author of the post
    const isAuthor = user && (user.id === currentPost.authorId || user.username === currentPost.author || user.name === currentPost.author);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toISOString().split('T')[0];
    };


    return (
        <div style={{
            background: 'white',
            borderRadius: '8px',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
            padding: '20px',
            marginBottom: '20px',
            maxWidth: '100%',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", sans-serif'
        }}>
            {/*header */}
            <div style={{
                display: 'flex',
                alignItems: 'flex-start',
                justifyContent: 'space-between',
                marginBottom: '16px'
            }}>
                <UserInfo
                    userId={currentPost.authorId}
                    userName={currentPost.authorName || currentPost.author}
                    profilePicture={currentPost.authorProfilePicture}
                    size="small"
                    showGroupName={!!currentPost.groupName}
                    groupName={currentPost.groupName}
                    groupId={currentPost.groupId}
                    date={formatDate(currentPost.createdAt)}
                />

                {/*3 dot menu button - only show if user is author */}
                {isAuthor && (
                    <ThreeDotMenu
                        menuItems={[
                            { id: 'edit', label: 'Edit Post', action: 'edit' },
                            { id: 'delete', label: 'Delete Post', action: 'delete', danger: true }
                        ]}
                        onItemClick={(item) => {
                            if (item.action === 'edit') {
                                handleEditPost();
                            } else if (item.action === 'delete') {
                                handleDeletePost();
                            }
                        }}
                    />
                )}
            </div>

            {/*post content */}
            {isEditing ? (
                <div style={{ marginBottom: '16px' }}>
                    <textarea
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        style={{
                            width: '100%',
                            minHeight: '80px',
                            padding: '12px',
                            border: '1px solid #e0e0e0',
                            borderRadius: '8px',
                            fontSize: '16px',
                            lineHeight: '1.5',
                            color: '#333',
                            backgroundColor: '#f8f9fa',
                            fontFamily: 'inherit',
                            resize: 'vertical',
                            outline: 'none',
                            boxSizing: 'border-box'
                        }}
                        placeholder="What's on your mind?"
                    />

                    {/*show existing images in edit mode */}
                    <EditImageGallery
                        images={currentPost.images}
                        removedImages={removedImages}
                        onRemoveImage={handleRemoveImage}
                    />

                    {/*show existing videos in edit mode */}
                    <EditVideoGallery
                        videos={currentPost.videos}
                        removedVideos={removedVideos}
                        onRemoveVideo={handleRemoveVideo}
                    />

                    <div style={{
                        display: 'flex',
                        gap: '12px',
                        marginTop: '12px'
                    }}>
                        <MyButton
                            onClick={handleSaveEdit}
                            variant="primary"
                        >
                            <span>✓</span>
                            Save
                        </MyButton>
                        <MyButton
                            onClick={handleCancelEdit}
                            variant="secondary"
                        >
                            <span>✕</span>
                            Cancel
                        </MyButton>
                    </div>
                </div>
            ) : (
                <>
                    <div style={{
                        fontSize: '16px',
                        lineHeight: '1.5',
                        color: '#333',
                        marginBottom: '16px',
                        wordWrap: 'break-word',
                        textAlign: 'left'
                    }}>
                        {currentPost.content}
                    </div>

                    {/*post images */}
                    <ImageGallery
                        images={currentPost.images}
                        onImageClick={handleImageClick}
                    />

                    {/*post videos */}
                    <VideoGallery
                        videos={currentPost.videos}
                        onVideoClick={(index) => {
                            // Handle video click - could open in modal or play inline
                            console.log('Video clicked:', index);
                        }}
                    />
                </>
            )}

            {/*footer */}
            <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '20px'
            }}>
                {/*like button */}
                <MyButton variant="like" onClick={handleLike}>
                    <span style={{
                        fontSize: '18px',
                        display: 'flex',
                        alignItems: 'center',
                        color: isLiked ? '#e74c3c' : 'inherit'
                    }}>
                        {isLiked ? '❤️' : '🤍'}
                    </span>
                    <span style={{
                        fontSize: '14px',
                        color: '#666',
                        fontWeight: '500'
                    }}>
                        {likeCount}
                    </span>
                </MyButton>
                <MyButton variant="comment" onClick={handleComment}>
                    <span style={{
                        fontSize: '18px',
                        display: 'flex',
                        alignItems: 'center'
                    }}>
                        💬
                    </span>
                    <span style={{
                        fontSize: '14px',
                        color: '#666',
                        fontWeight: '500'
                    }}>
                        {commentCount}
                    </span>
                </MyButton>
            </div>

            {/*comment input */}
            {showCommentInput && (
                <CommentInput
                    onSubmit={handleCommentSubmit}
                    onCancel={handleCommentCancel}
                    placeholder="Write a comment..."
                />
            )}

            {/*comments list */}
            <CommentsModel
                key={`${currentPost._id}-${currentPost.comments ? currentPost.comments.length : 0}`}
                post={currentPost}
                isOpen={showCommentsModal}
                onClose={() => setShowCommentsModal(false)}
                onCommentSubmit={handleModalCommentSubmit}
                onCommentEdit={handleCommentEdit}
                onCommentDelete={handleCommentDelete}
            />

            {/*myAlert component */}
            <MyAlert
                show={alert.show}
                message={alert.message}
                type={alert.type}
                duration={alert.duration}
                onClose={hideAlert}
            />

            {/* click on image view */}
            <ImageView
                images={selectedImage}
                currentIndex={currentImageIndex}
                isOpen={!!selectedImage}
                onClose={handleCloseImageModal}
                onPrevious={handlePreviousImage}
                onNext={handleNextImage}
            />
        </div>
    );
};

export default Post;
