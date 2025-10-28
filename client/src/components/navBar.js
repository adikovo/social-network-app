import React, { useState, useEffect, useRef } from 'react';
import { data, useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import MyButton from './MyButton';
import DropdownMenu from './DropdownMenu';
import RoomieRequestCard from './RoomieRequestCard';
import ResultNotification from './ResultNotification';
import NotificationBadge from './NotificationBadge';
import AppLogo from './AppLogo';
import ProfilePicture from './ProfilePicture';
import { useUserContext } from '../context/UserContext';
import axios from 'axios';
import MyAlert from './MyAlert';
import useMyAlert from '../hooks/useMyAlert';
import { theme } from '../theme/colors';

function NavBar() {
    const navigate = useNavigate();
    const { user, logout } = useUserContext();
    const [showProfileDropdown, setShowProfileDropdown] = useState(false);
    const [showRequestDropdown, setShowRequestDropdown] = useState(false);
    const [roomiesRequests, setRoomiesRequests] = useState([]);
    const [groupJoinRequests, setGroupJoinRequests] = useState([]);
    const [notifications, setNotifications] = useState([]);
    const [unreadChatCount, setUnreadChatCount] = useState(0);
    const { alert, showSuccess, showError, hideAlert } = useMyAlert();
    const profileRef = useRef(null);
    const requestRef = useRef(null);
    const socketRef = useRef(null);


    //fetch roomie requests, group join requests, notifications, and unread chat count when user is loaded
    useEffect(() => {
        if (user) {
            fetchRoomiesRequests();
            fetchGroupJoinRequests();
            fetchNotifications();
            fetchUnreadChatCount();
        } else {
            //clear requests when user logs out
            setRoomiesRequests([]);
            setGroupJoinRequests([]);
            setNotifications([]);
            setUnreadChatCount(0);
        }
    }, [user]);

    //close dropdowns when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            //check if click is outside profile dropdown
            if (profileRef.current && !profileRef.current.contains(event.target)) {
                setShowProfileDropdown(false);
            }
            //check if click is outside request dropdown
            if (requestRef.current && !requestRef.current.contains(event.target)) {
                setShowRequestDropdown(false);
            }
        };
        //listen for clicks on the page
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    //setup socket connection and listen for notifications
    useEffect(() => {
        if (user && !socketRef.current) {
            //establish socket connection
            socketRef.current = io('http://localhost:3001');

            const socket = socketRef.current;
            const userId = user?._id || user?.id;

            //join user's personal room
            socket.emit('join-user-room', { userId });

            //listen for new notifications
            socket.on('new-notification', (notificationData) => {
                console.log('New notification received:', notificationData);
                //fetch latest notifications
                fetchNotifications();
            });

            //cleanup on unmount
            return () => {
                if (socketRef.current) {
                    socketRef.current.disconnect();
                    socketRef.current = null;
                }
            };
        }
    }, [user]);

    //listen for conversation events to update chat notification badge
    useEffect(() => {
        const handleConversationRead = () => {
            fetchUnreadChatCount();
        };

        const handleConversationDeleted = () => {
            fetchUnreadChatCount();
        };

        const handleNewMessage = (event) => {
            fetchUnreadChatCount();
        };

        window.addEventListener('conversationRead', handleConversationRead);
        window.addEventListener('conversationDeleted', handleConversationDeleted);
        window.addEventListener('newMessage', handleNewMessage);

        return () => {
            window.removeEventListener('conversationRead', handleConversationRead);
            window.removeEventListener('conversationDeleted', handleConversationDeleted);
            window.removeEventListener('newMessage', handleNewMessage);
        };
    }, []);

    const handleLogout = () => {
        // Clear all local state first
        setRoomiesRequests([]);
        setGroupJoinRequests([]);
        setNotifications([]);
        setShowProfileDropdown(false);
        setShowRequestDropdown(false);

        //then logout and navigate
        logout(); // This will clear localStorage and set user to null
        navigate('/login');
    };

    const handleProfile = () => {
        if (user) {
            navigate(`/profile/${user.id}`);
        }
        setShowProfileDropdown(false);
    };

    const handleGroups = () => {
        navigate('/groups');
    };

    const handleChat = () => {
        navigate('/chat');
    };

    const fetchRoomiesRequests = () => {
        if (!user) return;

        axios.get('http://localhost:3001/api/users/friend-requests', {
            params: {
                userId: user.id
            }
        })
            .then(res => {
                console.log('Friend requests response:', res.data);
                setRoomiesRequests(res.data.friendRequests);
            })
            .catch(err => {
                console.error('Friend requests error:', err);

                if (user) {
                    showError('Failed to fetch friend requests');
                }
            })
    }

    const fetchGroupJoinRequests = () => {
        if (!user) return;

        axios.get('http://localhost:3001/api/groups/join-requests', {
            params: {
                userId: user.id
            }
        })
            .then(res => {
                console.log('Group join requests response:', res.data);
                setGroupJoinRequests(res.data.joinRequests);
            })
            .catch(err => {
                console.error('Group join requests error:', err);
                // Only show alert if user is still logged in
                if (user) {
                    showError('Failed to fetch group join requests');
                }
            })
    }

    const fetchNotifications = () => {
        if (!user) return;

        axios.get('http://localhost:3001/api/users/notifications', {
            params: {
                userId: user.id
            }
        })
            .then(res => {
                console.log('Notifications response:', res.data);
                console.log('Notifications received:', res.data.notifications);
                setNotifications(res.data.notifications);
            })
            .catch(err => {
                console.error('Notifications error:', err);
                if (user) {
                    showError('Failed to fetch notifications');
                }
            })
    }

    const fetchUnreadChatCount = () => {
        if (!user) return;

        axios.get(`http://localhost:3001/api/conversations/${user._id || user.id}`)
            .then(res => {
                if (res.data.success) {
                    //calculate number of conversations with unread messages
                    const conversationsWithUnread = res.data.conversations.filter(conversation => {
                        return (conversation.unreadCount || 0) > 0;
                    }).length;
                    setUnreadChatCount(conversationsWithUnread);
                }
            })
            .catch(err => {
                console.error('Unread chat count error:', err);
            });
    }

    const handleDismissNotification = (notificationId) => {
        if (!user) return;

        axios.delete('http://localhost:3001/api/users/dismiss-notification', {
            data: {
                userId: user.id,
                notificationId: notificationId
            }
        })
            .then(res => {
                console.log('Dismiss notification response:', res.data);
                // Remove the notification from local state
                setNotifications(prev => prev.filter(notif => notif._id !== notificationId));
            })
            .catch(err => {
                console.error('Dismiss notification error:', err);
                showError('Failed to dismiss notification');
            })
    }

    const handleAcceptRequest = (requestId) => {
        if (!user) return;

        axios.put('http://localhost:3001/api/users/accept-friend-request', {
            userId: user.id,
            friendId: requestId
        })
            .then(res => {
                console.log('Accept request response:', res.data);
                showSuccess('Friend request accepted successfully!');
            })
            .catch(err => {
                console.error('Accept request error:', err);
                showError('Failed to accept friend request');
            })
        setShowRequestDropdown(false);
        //refresh friend requests and notifications
        fetchRoomiesRequests();
        // Add small delay to ensure notifications are created on server
        setTimeout(() => {
            fetchNotifications();
        }, 500);
    };

    const handleDeclineRequest = (requestId) => {
        if (!user) return;

        axios.delete('http://localhost:3001/api/users/decline-friend-request', {
            data: {
                userId: user.id,
                friendId: requestId
            }
        })
            .then(res => {
                console.log('Decline request response:', res.data);
                showSuccess('Friend request declined successfully!');
                setShowRequestDropdown(false);
                //refresh both request lists and notifications
                fetchRoomiesRequests();
                // Add small delay to ensure notifications are created on server
                setTimeout(() => {
                    fetchNotifications();
                }, 500);
            })
            .catch(err => {
                console.error('Decline request error:', err);
                showError('Failed to decline friend request');
            })
    };

    const handleAcceptGroupJoinRequest = (request) => {
        if (!user) return;

        axios.post('http://localhost:3001/api/groups/accept-join-request', {
            userId: user.id,
            groupId: request.groupId,
            requestUserId: request.id
        })
            .then(res => {
                console.log('Accept group join request response:', res.data);
                setShowRequestDropdown(false);
                //refresh both request lists and notifications
                fetchRoomiesRequests();
                fetchGroupJoinRequests();
                // Add small delay to ensure notifications are created on server
                setTimeout(() => {
                    fetchNotifications();
                }, 500);
            })
            .catch(err => {
                console.error('Accept group join request error:', err);
                showError('Failed to accept group join request');
            })
    };

    const handleDeclineGroupJoinRequest = (request) => {
        if (!user) return;

        axios.delete('http://localhost:3001/api/groups/decline-join-request', {
            data: {
                userId: user.id,
                groupId: request.groupId,
                requestUserId: request.id
            }
        })
            .then(res => {
                console.log('Decline group join request response:', res.data);
                showSuccess('Group join request declined successfully!');
                setShowRequestDropdown(false);
                //refresh both request lists and notifications
                fetchRoomiesRequests();
                fetchGroupJoinRequests();
                // Add small delay to ensure notifications are created on server
                setTimeout(() => {
                    fetchNotifications();
                }, 500);
            })
            .catch(err => {
                console.error('Decline group join request error:', err);
                showError('Failed to decline group join request');
            })
    };

    return (
        <nav style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            zIndex: 100,
            background: theme.primaryGradient,
            borderBottom: `1px solid ${theme.primaryBorder}`,
            padding: '0.75rem 1.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            boxShadow: `0 4px 12px ${theme.primaryShadow}`
        }}>
            {/*left side: logo and social network name */}
            <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                cursor: 'pointer'
            }} onClick={() => navigate('/feed')}>

                <AppLogo onClick={() => navigate('/feed')} />

                {/*app name */}
                <h1 style={{
                    margin: 0,
                    fontSize: '1.5rem',
                    fontWeight: '600',
                    color: 'white',
                    fontFamily: 'system-ui, -apple-system, sans-serif',
                    textShadow: '2px 2px 4px rgba(0, 0, 0, 0.3)'
                }}>
                    Roomies
                </h1>
            </div>

            {/*right side : navigation and user profile */}
            <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '2rem'
            }}>
                {/*navigation buttons */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1.5rem'
                }}>

                    <MyButton variant="nav" onClick={handleGroups}> Groups </MyButton>

                    <div style={{ position: 'relative' }}>
                        <MyButton variant="nav" onClick={handleChat}> Chat </MyButton>
                        <NotificationBadge count={unreadChatCount} />
                    </div>
                </div>

                {/*notifications dropdown */}
                <div ref={requestRef} style={{ position: 'relative' }}>
                    <MyButton
                        variant="notification"
                        onClick={() => setShowRequestDropdown(!showRequestDropdown)}
                    >
                        <svg
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                            <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                        </svg>
                        {(roomiesRequests?.length || 0) + (groupJoinRequests?.length || 0) + (notifications?.length || 0) > 0 && (
                            <div style={{
                                position: 'absolute',
                                top: '-4px',
                                right: '-4px',
                                height: '20px',
                                minWidth: '20px',
                                backgroundColor: theme.danger,
                                color: 'white',
                                borderRadius: '10px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '12px',
                                fontWeight: 'bold',
                                padding: '0 6px',
                                boxSizing: 'border-box',
                                boxShadow: `0 2px 4px ${theme.dangerShadow}`
                            }}>
                                {(roomiesRequests?.length || 0) + (groupJoinRequests?.length || 0) + (notifications?.length || 0)}
                            </div>
                        )}
                    </MyButton>

                    <DropdownMenu
                        isOpen={showRequestDropdown}
                        onClose={() => setShowRequestDropdown(false)}
                        width="280px"
                        maxHeight="400px"
                    >
                        {(!roomiesRequests || roomiesRequests.length === 0) && (!groupJoinRequests || groupJoinRequests.length === 0) && (!notifications || notifications.length === 0) ? (
                            <div style={{
                                padding: '1rem',
                                textAlign: 'center',
                                color: '#6b7280',
                                fontSize: '14px'
                            }}>
                                No notifications
                            </div>
                        ) : (
                            <>
                                {/* Friend Requests */}
                                {(roomiesRequests || []).map((request, index) => (
                                    <RoomieRequestCard
                                        key={`friend-${request._id || request.id}`}
                                        request={request}
                                        onAccept={handleAcceptRequest}
                                        onDecline={handleDeclineRequest}
                                        isLast={index === (roomiesRequests?.length || 0) - 1 && (!groupJoinRequests || groupJoinRequests.length === 0) && (!notifications || notifications.length === 0)}
                                    />
                                ))}

                                {/* Group Join Requests */}
                                {(groupJoinRequests || []).map((request, index) => (
                                    <RoomieRequestCard
                                        key={`group-${request._id || request.id}`}
                                        request={request}
                                        onAccept={() => handleAcceptGroupJoinRequest(request)}
                                        onDecline={() => handleDeclineGroupJoinRequest(request)}
                                        isLast={index === (groupJoinRequests?.length || 0) - 1 && (!notifications || notifications.length === 0)}
                                    />
                                ))}

                                {/* Result Notifications */}
                                {(notifications || []).map((notification, index) => (
                                    <ResultNotification
                                        key={`notification-${notification._id}`}
                                        notification={notification}
                                        onDismiss={handleDismissNotification}
                                        isLast={index === (notifications?.length || 0) - 1}
                                    />
                                ))}
                            </>
                        )}
                    </DropdownMenu>
                </div>

                {/*user profile dropdown */}
                <div ref={profileRef} style={{ position: 'relative' }}>

                    {/* profile picture button */}
                    <div
                        onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                        style={{ cursor: 'pointer' }}
                    >
                        <ProfilePicture
                            currentImage={user?.profilePicture}
                            size="small"
                            editMode={false}
                            userId={user?.id}
                        />
                    </div>

                    <DropdownMenu
                        isOpen={showProfileDropdown}
                        onClose={() => setShowProfileDropdown(false)}
                    >
                        {/*show profile button*/}
                        <MyButton
                            variant="dropdown"
                            onClick={handleProfile}
                            style={{
                                width: '100%',
                                justifyContent: 'flex-start',
                                borderTopLeftRadius: '0.5rem',
                                borderTopRightRadius: '0.5rem',
                                borderBottomLeftRadius: '0',
                                borderBottomRightRadius: '0'
                            }}
                        >
                            Profile
                        </MyButton>

                        {/*logout button */}
                        <MyButton
                            variant="dropdown"
                            onClick={handleLogout}
                            style={{
                                width: '100%',
                                justifyContent: 'flex-start',
                                borderTopLeftRadius: '0',
                                borderTopRightRadius: '0',
                                borderBottomLeftRadius: '0.5rem',
                                borderBottomRightRadius: '0.5rem'
                            }}
                        >
                            Log out
                        </MyButton>
                    </DropdownMenu>
                </div>
            </div>

            {/* MyAlert Component */}
            <MyAlert
                show={alert.show}
                message={alert.message}
                type={alert.type}
                duration={alert.duration}
                onClose={hideAlert}
            />
        </nav>
    );
}

export default NavBar;
