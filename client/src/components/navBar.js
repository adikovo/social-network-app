import React, { useState, useEffect, useRef } from 'react';
import { data, useNavigate } from 'react-router-dom';
import MyButton from './myButton';
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

function NavBar() {
    const navigate = useNavigate();
    const { user, logout } = useUserContext();
    const [showProfileDropdown, setShowProfileDropdown] = useState(false);
    const [showRequestDropdown, setShowRequestDropdown] = useState(false);
    const [roomiesRequests, setRoomiesRequests] = useState([]);
    const [groupJoinRequests, setGroupJoinRequests] = useState([]);
    const [notifications, setNotifications] = useState([]);
    const { alert, showSuccess, showError, hideAlert } = useMyAlert();
    const profileRef = useRef(null);
    const requestRef = useRef(null);


    //fetch roomie requests, group join requests, and notifications when user is loaded
    useEffect(() => {
        if (user) {
            fetchRoomiesRequests();
            fetchGroupJoinRequests();
            fetchNotifications();
        } else {
            // Clear requests when user logs out
            setRoomiesRequests([]);
            setGroupJoinRequests([]);
            setNotifications([]);
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


    const handleLogout = () => {
        // Clear all local state first
        setRoomiesRequests([]);
        setGroupJoinRequests([]);
        setNotifications([]);
        setShowProfileDropdown(false);
        setShowRequestDropdown(false);

        // Then logout and navigate
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
        //TODO:
        // Add chat navigation logic here
        console.log('Navigate to chat');
    };

    const handleStats = () => {
        //TODO:
        // Add stats navigation logic here
        console.log('Navigate to stats');
    };

    const fetchRoomiesRequests = () => {
        if (!user) return;

        axios.post('http://localhost:3001/api/users', {
            command: 'getFriendRequests',
            data: {
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

        axios.post('http://localhost:3001/api/groups', {
            command: 'getJoinRequests',
            data: {
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

        axios.post('http://localhost:3001/api/users', {
            command: 'getNotifications',
            data: {
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

    const handleDismissNotification = (notificationId) => {
        if (!user) return;

        axios.post('http://localhost:3001/api/users', {
            command: 'dismissNotification',
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

        // TODO: Implement accept request logic
        axios.post('http://localhost:3001/api/users', {
            command: 'acceptFriendRequest',
            data: {
                userId: user.id,
                friendId: requestId
            }
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

        // TODO: Implement decline request logic
        console.log('Decline request:', requestId);
        setShowRequestDropdown(false);
    };

    const handleAcceptGroupJoinRequest = (request) => {
        if (!user) return;

        axios.post('http://localhost:3001/api/groups', {
            command: 'acceptJoinRequest',
            data: {
                userId: user.id,
                groupId: request.groupId,
                requestUserId: request.id
            }
        })
            .then(res => {
                console.log('Accept group join request response:', res.data);
                showSuccess('Group join request accepted successfully!');
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

        axios.post('http://localhost:3001/api/groups', {
            command: 'declineJoinRequest',
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
            backgroundColor: 'white',
            borderBottom: '1px solid #e5e7eb',
            padding: '0.75rem 1.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1)'
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
                    color: '#1f2937',
                    fontFamily: 'system-ui, -apple-system, sans-serif'
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

                    <MyButton variant="nav" onClick={handleChat}> Chat </MyButton>

                    <MyButton variant="nav" onClick={handleStats}> Stats </MyButton>
                </div>

                {/*roomie requests dropdown */}
                <div ref={requestRef} style={{ position: 'relative' }}>
                    <MyButton
                        variant="icon"
                        onClick={() => setShowRequestDropdown(!showRequestDropdown)}
                    >
                        N
                        <NotificationBadge count={(roomiesRequests?.length || 0) + (groupJoinRequests?.length || 0) + (notifications?.length || 0)} />
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
                            variant="nav"
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
                            variant="nav"
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
