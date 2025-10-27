import React from 'react';
import VideoInPost from './VideoInPost';

function VideoGallery({ videos, onVideoClick }) {
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

    //arrange the video data
    const normalizeVideo = (video, index) => {

        if (typeof video === 'object' && video !== null) {
            return video;
        }
        if (typeof video === 'string') {
            if (video.includes('youtube.com') || video.includes('youtu.be')) {
                return {
                    url: video,
                    videoId: extractVideoId(video),
                    originalUrl: video
                };
            } else {
                //assume it's an uploaded video
                return {
                    url: video,
                    type: 'uploaded',
                    filename: `Video ${index + 1}`
                };
            }
        }

        return video;
    };

    //extract YouTube video ID from URL
    const extractVideoId = (url) => {
        const regex = /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/;
        const match = url.match(regex);
        return match ? match[1] : null;
    };

    return (
        <div style={{
            marginBottom: '16px',
            display: 'grid',
            gap: '8px',
            ...getGridStyle(videos.length)
        }}>
            {videos.map((video, index) => {
                const normalizedVideo = normalizeVideo(video, index);
                return (
                    <VideoInPost
                        key={index}
                        video={normalizedVideo}
                        index={index}
                        onVideoClick={onVideoClick}
                        containerStyle={getVideoContainerStyle(index, videos.length)}
                    />
                );
            })}
        </div>
    );
}

export default VideoGallery;
