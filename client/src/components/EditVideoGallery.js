import React from 'react';
import VideoInPost from './VideoInPost';

const EditVideoGallery = ({ videos, removedVideos, onRemoveVideo }) => {

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
                {videos.map((video, index) => (
                    !removedVideos.includes(index) && (
                        <VideoInPost
                            key={index}
                            video={{ url: video }}
                            index={index}
                            onRemoveVideo={onRemoveVideo}
                            variant="edit"
                            containerStyle={getVideoContainerStyle(index, filteredVideos.length)}
                        />
                    )
                ))}
            </div>
        </div>
    );
};

export default EditVideoGallery;
