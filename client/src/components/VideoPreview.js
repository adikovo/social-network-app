import React from 'react';

function VideoPreview({ video, index, onRemove }) {
    //check if this is an uploaded video or YouTube video
    const isUploadedVideo = video.type === 'uploaded' || (!video.url.includes('youtube.com') && !video.url.includes('youtu.be'));
    const isYouTubeVideo = video.videoId || video.url.includes('youtube.com/embed') || video.url.includes('youtu.be');

    const handleRemove = (e) => {
        e.stopPropagation();
        onRemove(index);
    };

    return (
        <div style={{
            position: 'relative',
            display: 'inline-block',
            borderRadius: '8px',
            overflow: 'hidden',
            border: '1px solid #e9ecef',
            backgroundColor: '#f8f9fa'
        }}>
            {/*render uploaded video */}
            {isUploadedVideo ? (
                <video
                    src={`http://localhost:3001${video.url}`}
                    style={{
                        width: '200px',
                        height: '113px',
                        objectFit: 'cover',
                        display: 'block'
                    }}
                    controls
                    preload="metadata"
                    poster=""
                />
            ) : (
                /*render YouTube video */
                <iframe
                    src={video.url}
                    title={`YouTube video ${index + 1}`}
                    style={{
                        width: '200px',
                        height: '113px',
                        borderRadius: '8px',
                        border: 'none'
                    }}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                />
            )}

            {/*remove button */}
            <button
                onClick={handleRemove}
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
                    justifyContent: 'center',
                    zIndex: 2
                }}
            >
                ×
            </button>
        </div>
    );
}

export default VideoPreview;
