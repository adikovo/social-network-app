import React from 'react';
import ProfilePicture from './ProfilePicture';
import ClickableText from './ClickableText';

function UserInfo({
    userId,
    userName,
    profilePicture,
    size = 'small',
    showGroupName = false,
    groupName = null,
    groupId = null,
    date = null,
    email = null,
    roomiesCount = null
}) {
    return (
        <div style={{ display: 'flex', alignItems: 'center' }}>
            <ProfilePicture
                currentImage={profilePicture}
                size={size}
                editMode={false}
            />
            <div style={{
                flex: 1,
                textAlign: 'left',
                marginLeft: '12px'
            }}>
                {/* Group name - show above user name for group posts */}
                {showGroupName && groupName && (
                    <div style={{
                        display: 'inline-block',
                        backgroundColor: '#f0f2f5',
                        borderRadius: '16px',
                        padding: '4px 8px',
                        marginBottom: '4px',
                        fontSize: '14px',
                        color: '#65676b',
                        fontWeight: '500'
                    }}>
                        <span style={{ marginRight: '4px' }}>👥</span>
                        <ClickableText
                            id={groupId}
                            text={groupName}
                            type="group"
                            fallbackText="Unknown Group"
                        />
                    </div>
                )}

                {/* User name */}
                <div style={{
                    fontWeight: '600',
                    fontSize: size === 'small' ? '18px' : size === 'medium' ? '20px' : '22px',
                    color: '#1c1e21',
                    textAlign: 'left'
                }}>
                    <ClickableText
                        id={userId}
                        text={userName}
                        type="author"
                        fallbackText="Unknown User"
                    />
                </div>

                {/* Date - show under user name if provided */}
                {date && (
                    <div style={{
                        fontSize: '14px',
                        color: '#666',
                        fontWeight: '400',
                        textAlign: 'left',
                        marginTop: '2px'
                    }}>
                        {date}
                    </div>
                )}

                {/* Email - show under user name if provided */}
                {email && (
                    <div style={{
                        fontSize: '14px',
                        color: '#6b7280',
                        fontWeight: '400',
                        textAlign: 'left',
                        marginTop: '2px'
                    }}>
                        {email}
                    </div>
                )}

                {/* Roomies count - show under email if provided */}
                {roomiesCount !== null && (
                    <div style={{
                        fontSize: '14px',
                        color: '#6b7280',
                        fontWeight: '400',
                        textAlign: 'left',
                        marginTop: '2px'
                    }}>
                        Roomies: {roomiesCount}
                    </div>
                )}
            </div>
        </div>
    );
}

export default UserInfo;
