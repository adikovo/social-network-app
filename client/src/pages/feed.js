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
    const { user } = useUserContext();
    const [userData, setUserData] = useState(null);
    const [posts, setPosts] = useState([]);


    // if user is not loaded yet, redirect to login
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

    const handlePostCreated = (postText) => {

        // API call to create post on server
        axios.post('http://localhost:3001/api/posts', {
            command: 'create',
            data: {
                content: postText,
                author: user?.username || user?.name || 'You',
                authorId: user?.id
            }
        })
            .then(res => {
                console.log('Post created successfully:', res.data);
                // Add the new post to the beginning of the posts array
                const newPost = res.data.post;
                setPosts(prevPosts => [newPost, ...prevPosts]);
            })
            .catch(err => {
                console.error('Error creating post:', err);
                // TODO: Show error message to user
            });
    };

    const handlePostUpdated = (deletedPostId, updatedPost) => {
        if (deletedPostId) {
            // Remove the deleted post from local state
            setPosts(prevPosts => prevPosts.filter(post => post._id !== deletedPostId));
        } else if (updatedPost) {
            // Update the specific post in local state
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

    return (
        <div>
            <NavBar />
            <SearchSideBar />
            <div style={{
                marginLeft: '320px',
                padding: '20px',
                maxWidth: '800px'
            }}>
                <p style={{ marginTop: '20px' }}>Welcome to your feed! This is where you'll see posts from your friends and groups.</p>

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
