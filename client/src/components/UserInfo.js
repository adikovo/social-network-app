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
    date = null
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
                    fontSize: size === 'small' ? '16px' : '18px',
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
            </div>
        </div>
    );
}

export default UserInfo;
