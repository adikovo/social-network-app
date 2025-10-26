import React from 'react';
import MyButton from './myButton';

const ExtraInput = ({ onImageClick, onVideoClick, onYouTubeClick }) => {
    return (
        <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px'
        }}>
            {/* image/media icon */}
            <button
                style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: '4px',
                    borderRadius: '4px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#6c757d',
                    fontSize: '18px'
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#e9ecef'}
                onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                title="Attach image"
                onClick={onImageClick}
            >
                🖼️
            </button>

            {/* video icon */}
            <button
                style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: '4px',
                    borderRadius: '4px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#6c757d',
                    fontSize: '18px'
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#e9ecef'}
                onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                title="Attach video"
                onClick={onVideoClick}
            >
                🎥
            </button>

            {/*youtube video button */}
            <MyButton
                variant="youtube"
                onClick={onYouTubeClick}
                title="Add YouTube video"
            >
                <img
                    src="/images/youtube_logo.png"
                    alt="YouTube"
                    style={{
                        width: '24px',
                        height: '24px',
                        objectFit: 'contain'
                    }}
                />
            </MyButton>
        </div>
    );
};

export default ExtraInput;
