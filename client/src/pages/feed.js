import React from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import NavBar from '../components/navBar';
import SearchSideBar from '../components/searchSideBar';

function Feed() {
    const navigate = useNavigate();
    const userId = useParams().userId;
    const [user, setUser] = useState(null);

    useEffect(() => {

        //fetch user data from server
        axios.post('http://localhost:3001/api/users',
            {
                command: 'getUser',
                data: { userId: userId }
            }
        )
            .then(res => {
                console.log('User response:', res.data);
                setUser(res.data.user);
            })
            .catch(err => {
                console.error('User fetch error:', err);
            })
    }, [userId])

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
