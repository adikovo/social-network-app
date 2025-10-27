import React from 'react';
import { useNavigate } from 'react-router-dom';
import UserInfo from './UserInfo';

function ResultNotification({ notification, onDismiss, isLast }) {
    const navigate = useNavigate();

    const handleNotificationClick = () => {
        if (notification.type === 'joinGroupApproved' && notification.groupId) {
            navigate(`/group/${notification.groupId}`);
        } else if (notification.type === 'friendRequestAccepted' && notification.fromUserId) {
            navigate(`/profile/${notification.fromUserId}`);
        } else if (notification.type === 'adminPromoted' && notification.groupId) {
            navigate(`/group/${notification.groupId}`);
        }
    };

    const getNotificationMessage = () => {
        switch (notification.type) {
            case 'joinGroupApproved':
                return `Your request to join "${notification.groupName}" was approved!`;
            case 'joinGroupDeclined':
                return `Your request to join "${notification.groupName}" was declined.`;
            case 'friendRequestAccepted':
                return `accepted your friend request`;
            case 'adminPromoted':
                return `You have been promoted to admin in "${notification.groupName}"!`;
            default:
                return 'Notification';
        }
    };

    const getNotificationStyle = () => {
        const baseStyle = {
            transition: 'background-color 0.2s ease'
        };

        switch (notification.type) {
            case 'joinGroupApproved':
            case 'friendRequestAccepted':
            case 'adminPromoted':
                return {
                    ...baseStyle,
                    borderLeft: '4px solid #10b981', // green
                    backgroundColor: '#f0fdf4'
                };
            case 'joinGroupDeclined':
                return {
                    ...baseStyle,
                    borderLeft: '4px solid #ef4444', // red
                    backgroundColor: '#fef2f2'
                };
            default:
                return {
                    ...baseStyle,
                    borderLeft: '4px solid #6b7280', // gray
                    backgroundColor: '#f9fafb'
                };
        }
    };

    const getIcon = () => {
        switch (notification.type) {
            case 'joinGroupApproved':
            case 'friendRequestAccepted':
            case 'adminPromoted':
                return '✓';
            case 'joinGroupDeclined':
                return '✗';
            default:
                return '•';
        }
    };

    return (
        <div
            onClick={(notification.type === 'joinGroupApproved' || notification.type === 'friendRequestAccepted' || notification.type === 'adminPromoted') ? handleNotificationClick : undefined}
            onMouseEnter={(e) => {
                if (notification.type === 'joinGroupApproved') {
                    e.target.style.backgroundColor = '#e6fffa';
                } else if (notification.type === 'friendRequestAccepted') {
                    e.target.style.backgroundColor = '#e6fffa';
                } else if (notification.type === 'adminPromoted') {
                    e.target.style.backgroundColor = '#e6fffa';
                }
            }}
            onMouseLeave={(e) => {
                if (notification.type === 'joinGroupApproved') {
                    e.target.style.backgroundColor = '#f0fdf4';
                } else if (notification.type === 'friendRequestAccepted') {
                    e.target.style.backgroundColor = '#f0fdf4';
                } else if (notification.type === 'adminPromoted') {
                    e.target.style.backgroundColor = '#f0fdf4';
                }
            }}
            style={{
                padding: '12px 16px',
                borderBottom: isLast ? 'none' : '1px solid #e5e7eb',
                cursor: (notification.type === 'joinGroupApproved' || notification.type === 'friendRequestAccepted' || notification.type === 'adminPromoted') ? 'pointer' : 'default',
                ...getNotificationStyle()
            }}
        >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
                    <div style={{
                        width: '24px',
                        height: '24px',
                        borderRadius: '50%',
                        backgroundColor: notification.type === 'joinGroupDeclined' ? '#ef4444' : '#10b981',
                        color: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '12px',
                        fontWeight: 'bold',
                        marginRight: '12px'
                    }}>
                        {getIcon()}
                    </div>

                    <div style={{ flex: 1 }}>
                        {notification.type === 'friendRequestAccepted' ? (
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <UserInfo
                                    userId={notification.fromUserId}
                                    userName={notification.fromUserName}
                                    profilePicture={notification.fromUserProfilePicture}
                                    size="small"
                                />
                                <span style={{ marginLeft: '8px', color: '#6b7280' }}>
                                    {getNotificationMessage()}
                                </span>
                            </div>
                        ) : (
                            <div>
                                <div style={{ fontWeight: '500', color: '#374151' }}>
                                    {getNotificationMessage()}
                                </div>
                                {notification.groupName && (
                                    <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '2px' }}>
                                        Group: {notification.groupName}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                <button
                    onClick={() => onDismiss(notification._id)}
                    style={{
                        background: 'none',
                        border: 'none',
                        color: '#9ca3af',
                        cursor: 'pointer',
                        padding: '4px',
                        borderRadius: '4px',
                        fontSize: '16px'
                    }}
                    onMouseOver={(e) => e.target.style.backgroundColor = '#f3f4f6'}
                    onMouseOut={(e) => e.target.style.backgroundColor = 'transparent'}
                >
                    ×
                </button>
            </div>
        </div>
    );
}

export default ResultNotification;
