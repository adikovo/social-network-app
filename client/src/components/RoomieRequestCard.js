import React from 'react';

function RoomieRequestCard({
    request,
    onAccept,
    onDecline,
    isLast = false
}) {
    const cardStyle = {
        padding: '0.75rem',
        borderBottom: isLast ? 'none' : '1px solid #f3f4f6'
    };

    const headerStyle = {
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        marginBottom: '0.5rem'
    };

    const avatarStyle = {
        width: '32px',
        height: '32px',
        borderRadius: '50%',
        backgroundColor: '#e5e7eb',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '14px',
        fontWeight: 'bold'
    };

    const infoStyle = {
        flex: 1
    };

    const nameStyle = {
        fontWeight: '600',
        fontSize: '14px'
    };

    const messageStyle = {
        fontSize: '12px',
        color: '#6b7280'
    };

    const actionsStyle = {
        display: 'flex',
        gap: '0.5rem',
        justifyContent: 'flex-end'
    };

    const buttonBaseStyle = {
        padding: '0.25rem 0.75rem',
        fontSize: '12px',
        borderRadius: '4px',
        cursor: 'pointer',
        transition: 'all 0.2s ease'
    };

    const declineButtonStyle = {
        ...buttonBaseStyle,
        border: '1px solid #d1d5db',
        backgroundColor: 'white',
        color: '#6b7280'
    };

    const acceptButtonStyle = {
        ...buttonBaseStyle,
        border: 'none',
        backgroundColor: '#3b82f6',
        color: 'white'
    };

    const handleDeclineClick = (e) => {
        e.target.style.backgroundColor = '#f9fafb';
        setTimeout(() => {
            e.target.style.backgroundColor = 'white';
        }, 150);
        onDecline(request.id);
    };

    const handleAcceptClick = (e) => {
        e.target.style.backgroundColor = '#2563eb';
        setTimeout(() => {
            e.target.style.backgroundColor = '#3b82f6';
        }, 150);
        onAccept(request.id);
    };

    return (
        <div style={cardStyle}>
            <div style={headerStyle}>
                <div style={avatarStyle}>
                    {request.name.charAt(0)}
                </div>
                <div style={infoStyle}>
                    <div style={nameStyle}>
                        {request.name}
                    </div>
                    <div style={messageStyle}>
                        {request.message}
                    </div>
                </div>
            </div>
            <div style={actionsStyle}>
                <button
                    onClick={handleDeclineClick}
                    style={declineButtonStyle}
                >
                    Decline
                </button>
                <button
                    onClick={handleAcceptClick}
                    style={acceptButtonStyle}
                >
                    Accept
                </button>
            </div>
        </div>
    );
}

export default RoomieRequestCard;
