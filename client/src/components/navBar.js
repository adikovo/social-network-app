import React, { useState, useEffect, useRef } from 'react';
import { data, useNavigate } from 'react-router-dom';
import MyButton from './myButton';
import DropdownMenu from './DropdownMenu';
import RoomieRequestCard from './RoomieRequestCard';
import NotificationBadge from './NotificationBadge';
import AppLogo from './AppLogo';
import { useUserContext } from '../context/UserContext';
import axios from 'axios';

function NavBar() {
    const navigate = useNavigate();
    const { user } = useUserContext();
    const [showProfileDropdown, setShowProfileDropdown] = useState(false);
    const [showRequestDropdown, setShowRequestDropdown] = useState(false);
    const [roomiesRequests, setRoomiesRequests] = useState([]);
    const profileRef = useRef(null);
    const requestRef = useRef(null);


    //fetch roomie requests when user is loaded
    useEffect(() => {
        if (user) {
            fetchRoomiesRequests();
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
                alert('Failed to fetch friend requests');
            })
    }

    const handleAcceptRequest = (requestId) => {
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
                alert('Friend request accepted successfully!');
            })
            .catch(err => {
                console.error('Accept request error:', err);
                alert('Failed to accept friend request');
            })
        setShowRequestDropdown(false);
        //refresh friend requests
        fetchRoomiesRequests();
    };

    const handleDeclineRequest = (requestId) => {
        // TODO: Implement decline request logic
        console.log('Decline request:', requestId);
        setShowRequestDropdown(false);
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
                        R
                        <NotificationBadge count={roomiesRequests?.length || 0} />
                    </MyButton>

                    <DropdownMenu
                        isOpen={showRequestDropdown}
                        onClose={() => setShowRequestDropdown(false)}
                        width="280px"
                        maxHeight="400px"
                    >
                        {!roomiesRequests || roomiesRequests.length === 0 ? (
                            <div style={{
                                padding: '1rem',
                                textAlign: 'center',
                                color: '#6b7280',
                                fontSize: '14px'
                            }}>
                                No roomie requests
                            </div>
                        ) : (
                            (roomiesRequests || []).map((request, index) => (
                                <RoomieRequestCard
                                    key={request.id}
                                    request={request}
                                    onAccept={handleAcceptRequest}
                                    onDecline={handleDeclineRequest}
                                    isLast={index === (roomiesRequests?.length || 0) - 1}
                                />
                            ))
                        )}
                    </DropdownMenu>
                </div>

                {/*user profile dropdown */}
                <div ref={profileRef} style={{ position: 'relative' }}>

                    {/* profile picture button */}
                    <button
                        onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                        style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: '50%',
                            border: 'none',
                            backgroundColor: '#e5e7eb',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transition: 'all 0.2s ease'
                        }}
                        onMouseEnter={(e) => {
                            e.target.style.backgroundColor = '#d1d5db';
                        }}
                        onMouseLeave={(e) => {
                            e.target.style.backgroundColor = '#e5e7eb';
                        }}
                    >
                    </button>

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
        </nav>
    );
}

export default NavBar;
