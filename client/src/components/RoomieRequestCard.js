import React from 'react';
import { useNavigate } from 'react-router-dom';
import UserInfo from './UserInfo';

function RoomieRequestCard({
    request,
    onAccept,
    onDecline,
    isLast = false
}) {
    const navigate = useNavigate();
    const cardStyle = {
        padding: '0.75rem',
        borderBottom: isLast ? 'none' : '1px solid #f3f4f6',
        cursor: 'pointer',
        transition: 'background-color 0.2s ease'
    };

    const headerStyle = {
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        marginBottom: '0.5rem'
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
        //prevent card click when clicking decline button
        e.stopPropagation();
        e.target.style.backgroundColor = '#f9fafb';
        setTimeout(() => {
            e.target.style.backgroundColor = 'white';
        }, 150);
        onDecline(request._id || request.id);
    };

    const handleAcceptClick = (e) => {
        //prevent card click when clicking accept button
        e.stopPropagation();
        e.target.style.backgroundColor = '#2563eb';
        setTimeout(() => {
            e.target.style.backgroundColor = '#3b82f6';
        }, 150);
        onAccept(request._id || request.id);
    };

    const handleCardClick = () => {
        // Navigate to the user's profile
        const userId = request._id || request.id;
        navigate(`/profile/${userId}`);
    };

    return (
        <div
            style={cardStyle}
            onClick={handleCardClick}
            onMouseEnter={(e) => {
                e.target.style.backgroundColor = '#f9fafb';
            }}
            onMouseLeave={(e) => {
                e.target.style.backgroundColor = 'transparent';
            }}
        >
            <div style={headerStyle}>
                <UserInfo
                    userId={request._id || request.id}
                    userName={request.name}
                    profilePicture={request.profilePicture}
                    size="small"
                />
                <div style={messageStyle}>
                    {request.message || `wants to be your roommate`}
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
