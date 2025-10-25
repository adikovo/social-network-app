import React from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import NavBar from '../components/navBar';
import SearchSideBar from '../components/searchSideBar';
import Post from '../components/Post';
import CreatePost from '../components/CreatePost';
import { useUserContext } from '../context/UserContext';

function Feed() {
    const navigate = useNavigate();
    const { user, isLoading } = useUserContext();
    const [userData, setUserData] = useState(null);
    const [posts, setPosts] = useState([]);

    // if user is not loaded yet, redirect to login
    useEffect(() => {
        if (!isLoading && !user) {
            navigate('/login');
            return;
        }
    }, [user, isLoading, navigate]);

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
                });

            // Fetch posts when user is loaded
            getPosts();
        }
    }, [user])

    function getPosts() {
        if (!user) return;

        axios.post('http://localhost:3001/api/feed', {
            command: 'getFeed',
            data: { userId: user.id }
        })
            .then(res => {
                console.log('Posts response:', res.data);
                setPosts(res.data.posts || []);
            })
            .catch(err => {
                console.error('Posts fetch error:', err);
            })
    }

    const handlePostCreated = (newPost) => {

        //add the new post to the beginning of the posts array
        setPosts(prevPosts => [newPost, ...prevPosts]);
    };

    const handlePostUpdated = (deletedPostId, updatedPost) => {
        if (deletedPostId) {

            //remove the deleted post from array
            setPosts(prevPosts => prevPosts.filter(post => post._id !== deletedPostId));
        } else if (updatedPost) {

            //update the specific post in local state
            setPosts(prevPosts =>
                prevPosts.map(post =>
                    post._id === updatedPost._id ? updatedPost : post
                )
            );
        } else {
            // For other updates, refresh from server
            getPosts();
        }
    };


    // Show loading while checking for stored user
    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <NavBar />
            <SearchSideBar />
            <div style={{
                marginLeft: '320px',
                marginTop: '55px',
                padding: '20px',
                maxWidth: '800px'
            }}>

                {/* Create Post Component */}
                <CreatePost onPostCreated={handlePostCreated} />

                <div style={{ marginTop: '20px' }}>
                    {posts.length > 0 ? (
                        posts.map((post) => (
                            <Post
                                key={post._id}
                                post={post}
                                onPostUpdated={handlePostUpdated}
                            />
                        ))
                    ) : (
                        <div style={{
                            textAlign: 'center',
                            padding: '40px',
                            color: '#666'
                        }}>
                            <p>No posts to display yet.</p>
                            <p>Posts from your friends and groups will appear here.</p>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
}

export default Feed;
