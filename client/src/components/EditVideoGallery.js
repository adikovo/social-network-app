import React from 'react';
import VideoInPost from './VideoInPost';

function EditVideoGallery({ videos, removedVideos, onRemoveVideo }) {

    console.log('EditVideoGallery - videos:', videos, 'removedVideos:', removedVideos);

    if (!videos || videos.length === 0) return null;

    const filteredVideos = videos.filter((_, i) => !removedVideos.includes(i));

    if (filteredVideos.length === 0) return null;

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
            return { aspectRatio: '16/9', maxHeight: '200px' };
        } else if (numVideos === 3 && index === 0) {
            return { gridColumn: '1 / -1', aspectRatio: '16/9', maxHeight: '150px' };
        } else {
            return { aspectRatio: '16/9' };
        }
    };

    // Helper function to normalize video data (same as VideoGallery)
    const normalizeVideo = (video, index) => {
        // If video is already an object with metadata, use it as is
        if (typeof video === 'object' && video !== null) {
            return video;
        }

        // If video is just a URL string, create a basic video object
        // Check if it's a YouTube URL
        if (typeof video === 'string') {
            if (video.includes('youtube.com') || video.includes('youtu.be')) {
                return {
                    url: video,
                    videoId: extractVideoId(video),
                    originalUrl: video
                };
            } else {
                // Assume it's an uploaded video
                return {
                    url: video,
                    type: 'uploaded',
                    filename: `Video ${index + 1}`
                };
            }
        }

        return video;
    };

    // Extract YouTube video ID from URL
    const extractVideoId = (url) => {
        const regex = /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/;
        const match = url.match(regex);
        return match ? match[1] : null;
    };

    return (
        <div style={{ marginTop: '12px' }}>
            <p style={{
                fontSize: '12px',
                color: '#666',
                marginBottom: '8px'
            }}>
                {filteredVideos.length} {filteredVideos.length === 1 ? 'video' : 'videos'} attached
            </p>
            <div style={{
                display: 'grid',
                gap: '8px',
                ...getGridStyle(filteredVideos.length)
            }}>
                {videos.map((video, index) => {
                    if (removedVideos.includes(index)) return null;

                    const normalizedVideo = normalizeVideo(video, index);
                    return (
                        <VideoInPost
                            key={index}
                            video={normalizedVideo}
                            index={index}
                            onRemoveVideo={onRemoveVideo}
                            variant="edit"
                            containerStyle={getVideoContainerStyle(index, filteredVideos.length)}
                        />
                    );
                })}
            </div>
        </div>
    );
}

export default EditVideoGallery;
