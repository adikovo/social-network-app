import React from 'react';

function NotificationBadge({
    count,
    maxCount = 99,
    color = '#ef4444',
    textColor = 'white',
    size = '16px',
    fontSize = '10px'
}) {

    if (!count || count <= 0) return null;

    //show 99+ if count bigger then maxCount
    const displayCount = count > maxCount ? `${maxCount}+` : count.toString();

    const badgeStyle = {
        position: 'absolute',
        top: '-4px',
        right: '-4px',
        backgroundColor: color,
        color: textColor,
        borderRadius: '50%',
        width: size,
        height: size,
        fontSize: fontSize,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: 'bold',
        minWidth: size,
        padding: '0 2px',
        boxSizing: 'border-box'
    };

    return (
        <span style={badgeStyle}>
            {displayCount}
        </span>
    );
}

export default NotificationBadge;
