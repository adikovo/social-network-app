import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import MyButton from './myButton';

function NavBar() {
    const navigate = useNavigate();
    const userId = useParams().userId;
    const [showDropdown, setShowDropdown] = useState(false);

    const handleLogout = () => {
        navigate('/login');
    };

    const handleProfile = () => {
        navigate(`/profile/${userId}`);
        setShowDropdown(false);
    };

    const handleGroups = () => {
        navigate(`/groups/${userId}`);
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
            }} onClick={() => navigate(`/feed/${userId}`)}>

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

                {/*user profile dropdown */}
                <div style={{ position: 'relative' }}>

                    {/* profile picture button */}
                    <button
                        onClick={() => setShowDropdown(!showDropdown)}
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

                    {/*dropdown menu */}
                    {showDropdown && (
                        <div style={{
                            position: 'absolute',
                            top: '100%',
                            right: 0,
                            marginTop: '0.5rem',
                            backgroundColor: 'white',
                            border: '1px solid #e5e7eb',
                            borderRadius: '0.5rem',
                            boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
                            minWidth: '160px',
                            zIndex: 101
                        }}>
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
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
}

export default NavBar;
