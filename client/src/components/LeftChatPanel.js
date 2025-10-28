import React, { useState, useCallback } from 'react';
import InLineSearch from './InlineSearch';
import ConversationList from './ConversationList';
import MyButton from './MyButton';
import ProfilePicture from './ProfilePicture';
import { theme } from '../theme/colors';

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
                borderBottom: `1px solid ${theme.primaryBorder}`,
                background: theme.primaryGradient
            }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <h2 style={{
                        margin: '0',
                        fontSize: '24px',
                        fontWeight: '700',
                        color: 'white'
                    }}>
                        Messages
                    </h2>

                    {/*new conversation button */}
                    <MyButton
                        variant="primary"
                        className="light-chat-button"
                        onClick={searchMode === 'conversations' ? handleNewConversationClick : handleBackToConversations}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            fontSize: '14px',
                            padding: '8px 12px'
                        }}
                    >
                        <span style={{ fontSize: '16px' }}>+</span>
                        {searchMode === 'conversations' ? 'New Chat' : 'Back to Chats'}
                    </MyButton>
                </div>

                {/*search component */}
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

            {/*conversation list or friend search */}
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
                                            <div style={{ marginRight: '12px' }}>
                                                <ProfilePicture
                                                    currentImage={friend.profilePicture}
                                                    size="small"
                                                    editMode={false}
                                                />
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
