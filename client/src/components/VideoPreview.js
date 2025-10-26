import React from 'react';

const VideoPreview = ({ video, index, onRemove }) => {
    return (
        <div style={{
            position: 'relative',
            display: 'inline-block'
        }}>
            <iframe
                src={video.url}
                title={`YouTube video ${index + 1}`}
                style={{
                    width: '200px',
                    height: '113px',
                    borderRadius: '8px',
                    border: '1px solid #e9ecef'
                }}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
            />
            <button
                onClick={() => onRemove(index)}
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
    );
};

export default VideoPreview;
