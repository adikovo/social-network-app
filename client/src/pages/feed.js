import React from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';

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
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
            <h1>Feed</h1>
            <p>Welcome to your feed! This is where you'll see posts from your friends and groups.</p>
            <div style={{ marginTop: '20px' }}>
                <p>Feed functionality coming soon...</p>
            </div>

            <button type="button" className="btn btn-primary" onClick={() => navigate(`/groups/${userId}`)} style={{ marginRight: '10px' }}>
                View Groups
            </button>

            {/* back to login page */}
            <button
                type="button"
                className="btn btn-primary"
                onClick={() => {
                    navigate('/login')
                }}>
                Log Out
            </button>
            <button
                type="button"
                className="btn btn-primary"
                onClick={() => navigate(`/profile/${userId}`)}
                style={{ marginLeft: '10px' }}>
                My Profile!!
            </button>
        </div >
    );
}

export default Feed;
