import React from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import NavBar from '../components/navBar';
import SearchSideBar from '../components/searchSideBar';
import { useUserContext } from '../context/UserContext';

function Feed() {
    const navigate = useNavigate();
    const { user } = useUserContext();
    const [userData, setUserData] = useState(null);

    // If user is not loaded yet, redirect to login
    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }
    }, [user, navigate]);

    useEffect(() => {
        if (user) {
            //fetch user data from server
            axios.post('http://localhost:3001/api/users',
                {
                    command: 'getUser',
                    data: { userId: user.id }
                }
            )
                .then(res => {
                    console.log('User response:', res.data);
                    setUserData(res.data.user);
                })
                .catch(err => {
                    console.error('User fetch error:', err);
                })
        }
    }, [user])

    return (
        <div>
            <NavBar />
            <SearchSideBar />
            <div style={{
                marginLeft: '320px',
                padding: '20px',
                maxWidth: '800px'
            }}>
                <h1>Feed</h1>
                <p>Welcome to your feed! This is where you'll see posts from your friends and groups.</p>

                <div style={{ marginTop: '20px' }}>
                    <p>Feed functionality coming soon...</p>
                </div>

            </div>
        </div>
    );
}

export default Feed;
