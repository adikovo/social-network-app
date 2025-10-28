import React from 'react';
import { theme } from '../theme/colors';

function AppLogo({
    size = '32px',
    backgroundColor = 'white',
    textColor = theme.primary,
    borderRadius = '6px',
    fontSize = '16px',
    letter = 'R',
    onClick,
    style = {}
}) {
    const logoStyle = {
        width: size,
        height: size,
        backgroundColor: backgroundColor,
        borderRadius: borderRadius,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: onClick ? 'pointer' : 'default',
        transition: 'all 0.2s ease',
        ...style
    };

    const textStyle = {
        color: textColor,
        fontSize: fontSize,
        fontWeight: 'bold',
        fontFamily: 'system-ui, -apple-system, sans-serif'
    };

    return (
        <div
            style={logoStyle}
            onClick={onClick}
            onMouseEnter={(e) => {
                if (onClick) {
                    e.target.style.transform = 'scale(1.05)';
                    e.target.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.15)';
                }
            }}
            onMouseLeave={(e) => {
                if (onClick) {
                    e.target.style.transform = 'scale(1)';
                    e.target.style.boxShadow = 'none';
                }
            }}
        >
            <span style={textStyle}>
                {letter}
            </span>
        </div>
    );
}

export default AppLogo;
