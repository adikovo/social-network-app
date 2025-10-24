import React from 'react';
import { useNavigate } from 'react-router-dom';

function ClickableAuthor({
    authorId,
    authorName,
    author,
    fallbackText = 'Unknown User',
    fontSize = '16px',
    fontWeight = '600',
    color = 'inherit',
    hoverColor = '#1877f2',
    style = {},
    className = ''
}) {
    const navigate = useNavigate();

    const handleAuthorClick = () => {
        if (authorId) {
            navigate(`/profile/${authorId}`);
        }
    };

    const displayName = authorName || author || fallbackText;
    const isClickable = !!authorId;

    const defaultStyle = {
        fontSize: fontSize,
        cursor: isClickable ? 'pointer' : 'default',
        color: color,
        fontWeight: fontWeight,
        display: 'inline-block',
        transition: 'color 0.2s ease, text-decoration 0.2s ease',
        ...style
    };

    return (
        <span
            className={className}
            style={defaultStyle}
            onClick={handleAuthorClick}
            onMouseEnter={(e) => {
                if (isClickable) {
                    e.target.style.textDecoration = 'underline';
                    e.target.style.color = hoverColor;
                }
            }}
            onMouseLeave={(e) => {
                if (isClickable) {
                    e.target.style.textDecoration = 'none';
                    e.target.style.color = color;
                }
            }}
        >
            {displayName}
        </span>
    );
}

export default ClickableAuthor;
