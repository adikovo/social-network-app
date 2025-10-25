import React from 'react';
import { useNavigate } from 'react-router-dom';

function ClickableText({
    id,
    text,
    fallbackText = 'Unknown',
    // 'author', 'group'
    type = 'author',
    fontSize = '16px',
    fontWeight = '600',
    color = 'inherit',
    hoverColor = '#1877f2',
    style = {},
    className = ''
}) {
    const navigate = useNavigate();

    const handleClick = () => {
        if (id) {
            switch (type) {
                case 'author':
                    navigate(`/profile/${id}`);
                    break;
                case 'group':
                    navigate(`/group/${id}`);
                    break;
                case 'hashtag':
                    navigate(`/hashtag/${id}`);
                    break;
                default:
                    break;
            }
        }
    };

    const displayText = text || fallbackText;
    const isClickable = !!id;

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
            onClick={handleClick}
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
            {displayText}
        </span>
    );
}

export default ClickableText;
