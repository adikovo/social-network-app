import React from 'react';
import VideoInPost from './VideoInPost';

const VideoGallery = ({ videos, onVideoClick }) => {
    if (!videos || videos.length === 0) return null;

    const getGridStyle = (numVideos) => {
        if (numVideos === 1) {
            return { gridTemplateColumns: '1fr', maxWidth: '100%' };
        } else if (numVideos === 2) {
            return { gridTemplateColumns: '1fr 1fr' };
        } else {
            return { gridTemplateColumns: '1fr 1fr' };
        }
    };

    const getVideoContainerStyle = (index, numVideos) => {
        if (numVideos === 1) {
            return { aspectRatio: '16/9', maxHeight: '400px', minHeight: '200px' };
        } else if (numVideos === 3 && index === 0) {
            return { gridColumn: '1 / -1', aspectRatio: '16/9', maxHeight: '300px', minHeight: '150px' };
        } else {
            return { aspectRatio: '16/9', minHeight: '150px' };
        }
    };

    return (
        <div style={{
            marginBottom: '16px',
            display: 'grid',
            gap: '8px',
            ...getGridStyle(videos.length)
        }}>
            {videos.map((video, index) => (
                <VideoInPost
                    key={index}
                    video={{ url: video }}
                    index={index}
                    onVideoClick={onVideoClick}
                    containerStyle={getVideoContainerStyle(index, videos.length)}
                />
            ))}
        </div>
    );
};

export default VideoGallery;
