import React, { useState, useCallback } from 'react';
import InLineSearch from './inLineSearch';
import ConversationList from './ConversationList';
import MyButton from './myButton';

function LeftChatPanel({
    conversations = [],
    onConversationSelect,
    selectedConversationId,
    currentUserId,
    userFriends = [],
    onDeleteConversation
}) {
    const [filteredConversations, setFilteredConversations] = useState(conversations);
    const [searchMode, setSearchMode] = useState('conversations');
    const [filteredFriends, setFilteredFriends] = useState([]);
    const [isLoadingFriends, setIsLoadingFriends] = useState(false);

    const handleSearchResults = useCallback((results) => {
        setFilteredConversations(results);
    }, []);

    const handleFriendResults = useCallback((results) => {
        setFilteredFriends(results);
    }, []);

    const handleLoadingChange = useCallback((loading) => {
        setIsLoadingFriends(loading);
    }, []);

    const handleNewConversationClick = () => {
        setSearchMode('friends');
    };

    const handleNewConversation = (friend) => {
        // Check if conversation already exists
        const conversationId = [currentUserId, friend._id].sort().join('_');
        const existingConversation = conversations.find(conv =>
            conv.conversationId === conversationId
        );

        if (existingConversation) {
            // If conversation exists, select it
            onConversationSelect(existingConversation);
            setSearchMode('conversations');
        } else {
            //create a new temporary conversation
            const newConversation = {
                id: `new_${friend._id}`,
                conversationId: conversationId,
                name: friend.name,
                profilePicture: friend.profilePicture || '/images/default-avatar.png',
                lastMessage: '',
                lastMessageTime: new Date(),
                unreadCount: 0,
                isNewConversation: true
            };

            onConversationSelect(newConversation);
            setSearchMode('conversations');
        }
    };

    const handleBackToConversations = () => {
        setSearchMode('conversations');
    };

    return (
        <div style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: '#ffffff',
            borderRight: '1px solid #e5e7eb'
        }}>
            {/* header */}
            <div style={{
                padding: '20px',
                borderBottom: '1px solid #e5e7eb',
                backgroundColor: '#f9fafb'
            }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <h2 style={{
                        margin: '0',
                        fontSize: '24px',
                        fontWeight: '700',
                        color: '#111827'
                    }}>
                        Messages
                    </h2>

                    {/* new conversation button */}
                    <MyButton
                        variant="primary"
                        onClick={searchMode === 'conversations' ? handleNewConversationClick : handleBackToConversations}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            fontSize: '14px',
                            padding: '8px 12px'
                        }}
                    >
                        <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        {searchMode === 'conversations' ? 'New Chat' : 'Back to Chats'}
                    </MyButton>
                </div>

                {/* search component */}
                <InLineSearch
                    placeholder="Search conversations..."
                    conversations={conversations}
                    onSearchResults={handleSearchResults}
                    currentUserId={currentUserId}
                    searchMode={searchMode}
                    onFriendResults={handleFriendResults}
                    userFriends={userFriends}
                    onLoadingChange={handleLoadingChange}
                />
            </div>

            {/* conversation list or friend search */}
            <div style={{ flex: 1, overflow: 'hidden' }}>
                {searchMode === 'friends' ? (
                    <div style={{ padding: '20px' }}>
                        {/*friend list */}
                        <div style={{ maxHeight: '100%', overflowY: 'auto' }}>
                            {isLoadingFriends ? (
                                <div style={{ textAlign: 'center', padding: '20px', color: '#6b7280' }}>
                                    Loading friends...
                                </div>
                            ) : filteredFriends.length > 0 ? (
                                <div>
                                    {filteredFriends.map(friend => (
                                        <div
                                            key={friend._id}
                                            onClick={() => handleNewConversation(friend)}
                                            style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                padding: '12px',
                                                borderRadius: '8px',
                                                cursor: 'pointer',
                                                transition: 'background-color 0.2s ease',
                                                marginBottom: '8px'
                                            }}
                                            onMouseEnter={(e) => {
                                                e.target.style.backgroundColor = '#f3f4f6';
                                            }}
                                            onMouseLeave={(e) => {
                                                e.target.style.backgroundColor = 'transparent';
                                            }}
                                        >
                                            <div style={{
                                                width: '40px',
                                                height: '40px',
                                                borderRadius: '50%',
                                                backgroundColor: '#10b981',
                                                color: 'white',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                fontSize: '16px',
                                                fontWeight: '600',
                                                marginRight: '12px'
                                            }}>
                                                {(friend.name || 'U').split(' ').map(n => n[0]).join('').toUpperCase()}
                                            </div>
                                            <div>
                                                <div style={{
                                                    fontSize: '14px',
                                                    fontWeight: '600',
                                                    color: '#111827'
                                                }}>
                                                    {friend.name || 'Unknown User'}
                                                </div>
                                                <div style={{
                                                    fontSize: '12px',
                                                    color: '#6b7280'
                                                }}>
                                                    Start new conversation
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div style={{ textAlign: 'center', padding: '20px', color: '#6b7280' }}>
                                    No Roomies available
                                </div>
                            )}
                        </div>
                    </div>
                ) : (
                    <ConversationList
                        conversations={filteredConversations}
                        onConversationSelect={onConversationSelect}
                        selectedConversationId={selectedConversationId}
                        onDeleteConversation={onDeleteConversation}
                    />
                )}
            </div>
        </div>
    );
}

export default LeftChatPanel;
