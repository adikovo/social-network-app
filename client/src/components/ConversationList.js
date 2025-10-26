import React from 'react';
import ConvoChatCard from './ConvoChatCard';

function ConversationList({
    conversations = [],
    onConversationSelect,
    selectedConversationId
}) {


    return (
        <div style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: '#ffffff'
        }}>
            {conversations.length === 0 ? (
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '200px',
                    color: '#6b7280',
                    fontSize: '16px'
                }}>
                    <p style={{ margin: 0 }}>No conversations found</p>
                </div>
            ) : (
                <div style={{
                    flex: 1,
                    overflowY: 'auto'
                }}>
                    {conversations.map((conversation) => (
                        <ConvoChatCard
                            key={conversation.id}
                            conversation={conversation}
                            isSelected={selectedConversationId === conversation.id}
                            onSelect={onConversationSelect}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

export default ConversationList;
