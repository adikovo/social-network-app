import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import NavBar from '../components/navBar';
import LeftChatPanel from '../components/LeftChatPanel';
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

    //redirect to login if user is not authenticated
    useEffect(() => {
        if (!isLoading && !user) {
            navigate('/login');
            return;
        }
    }, [user, isLoading, navigate]);

    //fetch conversations when user is loaded
    useEffect(() => {
        if (user) {
            fetchConversations();
        }
    }, [user]);

    const fetchConversations = async () => {
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
                        unreadCount: 0 // You can implement unread count logic later
                    };
                });

                //sort conversations by last message time - most recent first
                formattedConversations.sort((a, b) => b.lastMessageTime - a.lastMessageTime);

                setConversations(formattedConversations);
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
        if (!conversationId) return;

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

    const handleConversationSelect = (conversation) => {
        setSelectedConversation(conversation);
        console.log('Selected conversation:', conversation);

        //fetch messages for the selected conversation
        if (conversation.conversationId) {
            fetchMessages(conversation.conversationId);
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
                                    <div style={{
                                        width: '40px',
                                        height: '40px',
                                        borderRadius: '50%',
                                        backgroundColor: '#3b82f6',
                                        color: 'white',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: '16px',
                                        fontWeight: '600'
                                    }}>
                                        {selectedConversation.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                                    </div>
                                    <div>
                                        <h3 style={{
                                            margin: '0',
                                            fontSize: '18px',
                                            fontWeight: '600',
                                            color: '#111827'
                                        }}>
                                            {selectedConversation.name}
                                        </h3>
                                        <p style={{
                                            margin: '0',
                                            fontSize: '14px',
                                            color: '#6b7280'
                                        }}>
                                            Online
                                        </p>
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
                                            style={{
                                                flex: 1,
                                                padding: '12px 16px',
                                                border: '1px solid #d1d5db',
                                                borderRadius: '24px',
                                                fontSize: '14px',
                                                outline: 'none',
                                                backgroundColor: '#f9fafb'
                                            }}
                                        />
                                        <button style={{
                                            padding: '12px 20px',
                                            backgroundColor: '#3b82f6',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '24px',
                                            fontSize: '14px',
                                            fontWeight: '600',
                                            cursor: 'pointer'
                                        }}>
                                            Send
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
