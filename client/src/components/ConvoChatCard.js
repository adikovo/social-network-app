import React from 'react';
import ProfilePicture from './ProfilePicture';
import ThreeDotMenu from './ThreeDotMenu';

function ConvoChatCard({
    conversation,
    isSelected,
    onSelect,
    onDelete
}) {
    const formatTimestamp = (timestamp) => {
        if (!timestamp) return "";

        const messageTime = new Date(timestamp);
        return messageTime.toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        });
    };

    return (
        <div
            style={{
                display: 'flex',
                alignItems: 'center',
                padding: '16px',
                cursor: 'pointer',
                borderBottom: '1px solid #f3f4f6',
                transition: 'background-color 0.2s ease',
                position: 'relative',
                backgroundColor: isSelected ? '#eff6ff' : 'transparent',
                borderRight: isSelected ? '3px solid #3b82f6' : 'none'
            }}
            onClick={() => onSelect(conversation)}
            onMouseEnter={(e) => {
                if (!isSelected) {
                    e.target.style.backgroundColor = '#f9fafb';
                }
            }}
            onMouseLeave={(e) => {
                if (!isSelected) {
                    e.target.style.backgroundColor = 'transparent';
                }
            }}
        >
            {/* profile picture */}
            <div style={{
                marginRight: '12px',
                flexShrink: 0
            }}>
                <ProfilePicture
                    currentImage={conversation.profilePicture}
                    size="small"
                />
            </div>

            {/* conversation details */}
            <div style={{
                flex: 1,
                minWidth: 0,
                display: 'flex',
                flexDirection: 'column',
                gap: '4px'
            }}>
                {/* name and timestamp */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '2px'
                }}>
                    <h4 style={{
                        fontSize: '16px',
                        fontWeight: '600',
                        color: '#111827',
                        margin: 0,
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        flex: 1
                    }}>
                        {conversation.name}
                    </h4>
                    <span style={{
                        fontSize: '12px',
                        color: '#6b7280',
                        whiteSpace: 'nowrap',
                        marginLeft: '8px',
                        flexShrink: 0
                    }}>
                        {formatTimestamp(conversation.lastMessageTime)}
                    </span>
                </div>

                {/* last message and unread badge */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '8px'
                }}>
                    <p style={{
                        fontSize: '14px',
                        color: '#6b7280',
                        margin: 0,
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        flex: 1
                    }}>
                        {conversation.lastMessage || "No messages yet"}
                    </p>
                    {conversation.unreadCount > 0 && (
                        <span style={{
                            backgroundColor: '#3b82f6',
                            color: 'white',
                            borderRadius: '50%',
                            width: '20px',
                            height: '20px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '12px',
                            fontWeight: '600',
                            flexShrink: 0
                        }}>
                            {conversation.unreadCount}
                        </span>
                    )}
                </div>
            </div>

            {/* 3 dot menu */}
            <ThreeDotMenu
                menuItems={[
                    { id: 'delete', label: 'Delete Chat', action: 'delete', danger: true }
                ]}
                onItemClick={(item) => {
                    if (item.action === 'delete' && onDelete) {
                        onDelete(conversation);
                    }
                }}
            />
        </div>
    );
}

export default ConvoChatCard;
