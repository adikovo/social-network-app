import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import MyButton from './myButton';
import DropdownMenu from './DropdownMenu';
import RoomieRequestCard from './RoomieRequestCard';
import NotificationBadge from './NotificationBadge';
import { useUserContext } from '../context/UserContext';

function NavBar() {
    const navigate = useNavigate();
    const { user } = useUserContext();
    const [showProfileDropdown, setShowProfileDropdown] = useState(false);
    const [showRequestDropdown, setShowRequestDropdown] = useState(false);
    const profileRef = useRef(null);
    const requestRef = useRef(null);

    // Mock roomie requests data - replace with actual data from your backend
    const roomieRequests = [
        { id: 1, name: 'John Doe', avatar: null, message: 'Looking for a roommate in downtown area' },
        { id: 2, name: 'Sarah Smith', avatar: null, message: 'Need someone to share a 2BR apartment' },
        { id: 3, name: 'Mike Johnson', avatar: null, message: 'Student looking for housing near campus' }
    ];

    // Close dropdowns when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (profileRef.current && !profileRef.current.contains(event.target)) {
                setShowProfileDropdown(false);
            }
            if (requestRef.current && !requestRef.current.contains(event.target)) {
                setShowRequestDropdown(false);
            }
        };

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

    const handleAcceptRequest = (requestId) => {
        // TODO: Implement accept request logic
        console.log('Accept request:', requestId);
        setShowRequestDropdown(false);
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

                {/*app logo */}
                <div style={{
                    width: '32px',
                    height: '32px',
                    backgroundColor: '#1f2937',
                    borderRadius: '6px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    <span style={{ color: 'white', fontSize: '16px', fontWeight: 'bold' }}>R</span>
                </div>

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

                {/* Roomie Requests Dropdown */}
                <div ref={requestRef} style={{ position: 'relative' }}>
                    <MyButton
                        variant="icon"
                        onClick={() => setShowRequestDropdown(!showRequestDropdown)}
                    >
                        R
                        <NotificationBadge count={roomieRequests.length} />
                    </MyButton>

                    <DropdownMenu
                        isOpen={showRequestDropdown}
                        onClose={() => setShowRequestDropdown(false)}
                        width="280px"
                        maxHeight="400px"
                    >
                        {roomieRequests.length === 0 ? (
                            <div style={{
                                padding: '1rem',
                                textAlign: 'center',
                                color: '#6b7280',
                                fontSize: '14px'
                            }}>
                                No roomie requests
                            </div>
                        ) : (
                            roomieRequests.map((request, index) => (
                                <RoomieRequestCard
                                    key={request.id}
                                    request={request}
                                    onAccept={handleAcceptRequest}
                                    onDecline={handleDeclineRequest}
                                    isLast={index === roomieRequests.length - 1}
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
