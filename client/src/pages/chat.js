import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import NavBar from '../components/navBar';
import LeftChatPanel from '../components/LeftChatPanel';
import ProfilePicture from '../components/ProfilePicture';
import { useUserContext } from '../context/UserContext';
import axios from 'axios';

function Chat() {
    const navigate = useNavigate();
    const { user, isLoading } = useUserContext();
    const [conversations, setConversations] = useState([]);
    const [selectedConversation, setSelectedConversation] = useState(null);
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [messagesLoading, setMessagesLoading] = useState(false);
    const [messageInput, setMessageInput] = useState('');
    const [sendingMessage, setSendingMessage] = useState(false);

    //redirect to login if user is not authenticated
    useEffect(() => {
        if (!isLoading && !user) {
            navigate('/login');
            return;
        }
    }, [user, isLoading, navigate]);

    //cleanup when user logs out
    useEffect(() => {
        if (!user) {
            setConversations([]);
            setSelectedConversation(null);
            setMessages([]);
            setMessageInput('');
            setSendingMessage(false);
        }
    }, [user]);

    //fetch conversations when user is loaded
    useEffect(() => {
        if (user) {
            fetchConversations();
        }
    }, [user]);

    const fetchConversations = async (onComplete) => {
        if (!user) return;

        try {
            setLoading(true);
            //API call to fetch conversations
            const userId = user._id || user.id;
            const response = await axios.get(`http://localhost:3001/api/conversations/${userId}`);

            if (response.data.success) {
                //convert the data to match the expected format
                const formattedConversations = response.data.conversations.map(conversation => {
                    //find the other participant 
                    const currentUserId = user._id || user.id;
                    const otherParticipant = conversation.participants.find(p => p._id !== currentUserId);

                    return {
                        id: conversation._id,
                        conversationId: conversation.conversationId,
                        name: otherParticipant ? otherParticipant.name : 'Unknown User',
                        profilePicture: otherParticipant ? otherParticipant.profilePicture : '/images/default-avatar.png',
                        lastMessage: conversation.lastMessage || '',
                        lastMessageTime: new Date(conversation.lastMessageAt),
                        unreadCount: conversation.unreadCount || 0
                    };
                });

                //sort conversations by last message time - most recent first
                formattedConversations.sort((a, b) => b.lastMessageTime - a.lastMessageTime);

                setConversations(formattedConversations);

                // Call the callback with the updated conversations
                if (onComplete) {
                    onComplete(formattedConversations);
                }
            } else {
                console.error('Failed to fetch conversations:', response.data.message);
                setConversations([]);
            }
        } catch (error) {
            console.error('Error fetching conversations:', error);
            setConversations([]);
        } finally {
            setLoading(false);
        }
    };

    const fetchMessages = async (conversationId) => {
        if (!conversationId || !user) return;

        try {
            setMessagesLoading(true);

            //API call to fetch messages for the conversation
            const response = await axios.get(`http://localhost:3001/api/messages/${conversationId}`);

            if (response.data.success) {
                //convert messages to include sender info
                const currentUserId = user._id || user.id;
                const formattedMessages = response.data.messages.map(message => ({
                    id: message._id,
                    senderId: message.senderId._id,
                    senderName: message.senderId.name,
                    content: message.content,
                    timestamp: new Date(message.timestamp),
                    read: message.read,
                    isOwn: message.senderId._id === currentUserId
                }));

                setMessages(formattedMessages);
            } else {
                console.error('Failed to fetch messages:', response.data.message);
                setMessages([]);
            }
        } catch (error) {
            console.error('Error fetching messages:', error);
            setMessages([]);
        } finally {
            setMessagesLoading(false);
        }
    };

    const sendMessage = async () => {
        if (!messageInput.trim() || !selectedConversation || sendingMessage || !user) {
            return;
        }

        try {
            setSendingMessage(true);

            //get the receiver ID from the selected conversation
            const currentUserId = user._id || user.id;
            const receiverId = selectedConversation.conversationId.split('_').find(id => id !== currentUserId);

            const messageData = {
                senderId: currentUserId,
                receiverId: receiverId,
                content: messageInput.trim(),
                conversationId: selectedConversation.conversationId
            };

            //send message to backend
            const response = await axios.post('http://localhost:3001/api/messages', messageData);

            if (response.data.success) {
                const messageContent = messageInput.trim();

                //add the new message to the local messages state
                const newMessage = {
                    id: response.data.message._id,
                    senderId: currentUserId,
                    senderName: user.name,
                    content: messageContent,
                    timestamp: new Date(),
                    read: false,
                    isOwn: true
                };

                setMessages(prevMessages => [...prevMessages, newMessage]);
                setMessageInput('');

                // conversation updates
                if (selectedConversation.isNewConversation) {
                    // For new conversations, refresh the conversations list from server
                    // This ensures we get the real conversation with proper database ID
                    await fetchConversations((updatedConversations) => {
                        // Find and select the newly created conversation
                        const newConversation = updatedConversations.find(conv =>
                            conv.conversationId === selectedConversation.conversationId
                        );

                        if (newConversation) {
                            setSelectedConversation(newConversation);
                        }
                    });
                } else {
                    // for existing conversations, update the last message
                    setConversations(prevConversations =>
                        prevConversations.map(conv =>
                            conv.id === selectedConversation.id
                                ? { ...conv, lastMessage: messageContent, lastMessageTime: new Date() }
                                : conv
                        )
                    );
                }
            } else {
                console.error('Failed to send message:', response.data.message);
            }
        } catch (error) {
            console.error('Error sending message:', error);
            // Show user-friendly error message
            if (error.response?.status === 404) {
                console.error('Message API endpoint not found. Please check if the server is running.');
            } else if (error.response?.status === 500) {
                console.error('Server error occurred while sending message.');
            } else {
                console.error('Network error occurred while sending message.');
            }
        } finally {
            setSendingMessage(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    const handleConversationSelect = async (conversation) => {
        if (!user) return;

        setSelectedConversation(conversation);

        //fetch messages for the selected conversation
        if (conversation.conversationId) {
            fetchMessages(conversation.conversationId);

            //mark conversation as read
            try {
                await axios.put(`http://localhost:3001/api/conversations/${conversation.conversationId}/read`, {
                    userId: user._id || user.id
                });

                //update local state to remove unread count
                setConversations(prevConversations =>
                    prevConversations.map(conv =>
                        conv.id === conversation.id
                            ? { ...conv, unreadCount: 0 }
                            : conv
                    )
                );
            } catch (error) {
                console.error('Error marking conversation as read:', error);
            }
        }
    };


    // show loading while checking for stored user
    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <div style={{
            minHeight: '100vh',
            backgroundColor: '#f9fafb',
            paddingTop: '80px'
        }}>
            <NavBar />

            <div style={{
                maxWidth: '1200px',
                margin: '0 auto',
                padding: '20px',
                height: 'calc(100vh - 100px)'
            }}>
                <div style={{
                    display: 'flex',
                    height: '100%',
                    border: '1px solid #e5e7eb',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    backgroundColor: 'white',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                }}>
                    {/* conversation list sidebar */}
                    <div style={{
                        width: '400px',
                        display: 'flex',
                        flexDirection: 'column',
                        borderRight: '1px solid #e5e7eb'
                    }}>
                        {loading ? (
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                height: '200px',
                                color: '#6b7280'
                            }}>
                                Loading conversations...
                            </div>
                        ) : (
                            <LeftChatPanel
                                conversations={conversations}
                                onConversationSelect={handleConversationSelect}
                                selectedConversationId={selectedConversation?.id}
                                currentUserId={user.id}
                                userFriends={user.friends || []}
                            />
                        )}
                    </div>

                    {/* chat area */}
                    <div style={{
                        flex: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        backgroundColor: '#f9fafb'
                    }}>
                        {selectedConversation ? (
                            <div style={{
                                height: '100%',
                                display: 'flex',
                                flexDirection: 'column'
                            }}>
                                {/* chat header */}
                                <div style={{
                                    padding: '20px',
                                    borderBottom: '1px solid #e5e7eb',
                                    backgroundColor: 'white',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '12px'
                                }}>
                                    <ProfilePicture
                                        currentImage={selectedConversation.profilePicture}
                                        size="small"
                                        editMode={false}
                                    />
                                    <div>
                                        <h3 style={{
                                            margin: '0',
                                            fontSize: '18px',
                                            fontWeight: '600',
                                            color: '#111827'
                                        }}>
                                            {selectedConversation.name}
                                        </h3>
                                    </div>
                                </div>

                                {/* messages area */}
                                <div style={{
                                    flex: 1,
                                    padding: '20px',
                                    overflowY: 'auto',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '12px'
                                }}>
                                    {messagesLoading ? (
                                        <div style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            height: '200px',
                                            color: '#6b7280'
                                        }}>
                                            Loading messages...
                                        </div>
                                    ) : messages.length > 0 ? (
                                        messages.map(message => (
                                            <div key={message.id} style={{
                                                display: 'flex',
                                                justifyContent: message.isOwn ? 'flex-end' : 'flex-start'
                                            }}>
                                                <div style={{
                                                    maxWidth: '70%',
                                                    padding: '12px 16px',
                                                    borderRadius: '18px',
                                                    backgroundColor: message.isOwn ? '#3b82f6' : 'white',
                                                    color: message.isOwn ? 'white' : '#111827',
                                                    fontSize: '14px',
                                                    boxShadow: '0 1px 2px rgba(0, 0, 0, 0.1)'
                                                }}>
                                                    {message.content}
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            height: '200px',
                                            color: '#6b7280',
                                            textAlign: 'center'
                                        }}>
                                            <div>
                                                <p style={{ margin: '0 0 8px 0', fontSize: '16px' }}>
                                                    No messages yet
                                                </p>
                                                <p style={{ margin: '0', fontSize: '14px' }}>
                                                    Start the conversation!
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* message input area */}
                                <div style={{
                                    padding: '20px',
                                    borderTop: '1px solid #e5e7eb',
                                    backgroundColor: 'white'
                                }}>
                                    <div style={{
                                        display: 'flex',
                                        gap: '12px',
                                        alignItems: 'center'
                                    }}>
                                        <input
                                            type="text"
                                            placeholder="Type a message..."
                                            value={messageInput}
                                            onChange={(e) => setMessageInput(e.target.value)}
                                            onKeyPress={handleKeyPress}
                                            disabled={sendingMessage}
                                            style={{
                                                flex: 1,
                                                padding: '12px 16px',
                                                border: '1px solid #d1d5db',
                                                borderRadius: '24px',
                                                fontSize: '14px',
                                                outline: 'none',
                                                backgroundColor: '#f9fafb',
                                                opacity: sendingMessage ? 0.6 : 1
                                            }}
                                        />
                                        <button
                                            onClick={sendMessage}
                                            disabled={!messageInput.trim() || sendingMessage}
                                            style={{
                                                padding: '12px 20px',
                                                backgroundColor: (!messageInput.trim() || sendingMessage) ? '#9ca3af' : '#3b82f6',
                                                color: 'white',
                                                border: 'none',
                                                borderRadius: '24px',
                                                fontSize: '14px',
                                                fontWeight: '600',
                                                cursor: (!messageInput.trim() || sendingMessage) ? 'not-allowed' : 'pointer',
                                                transition: 'background-color 0.2s ease'
                                            }}
                                        >
                                            {sendingMessage ? 'Sending...' : 'Send'}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                height: '100%',
                                textAlign: 'center'
                            }}>
                                <div>
                                    <h3 style={{
                                        margin: '0 0 8px 0',
                                        fontSize: '24px',
                                        fontWeight: '600',
                                        color: '#111827'
                                    }}>
                                        Select a conversation
                                    </h3>
                                    <p style={{
                                        margin: '0',
                                        fontSize: '16px',
                                        color: '#6b7280'
                                    }}>
                                        Choose a conversation from the list to start messaging
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Chat;
