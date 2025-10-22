import React from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import BioForm from '../components/BioForm';
import MyButton from '../components/myButton';
import NavBar from '../components/navBar';
import SearchSideBar from '../components/searchSideBar';


function Profile() {

    const userId = useParams().userId;
    const [friends, setFriends] = useState([]);
    const [activeButton, setActiveButton] = useState(null);
    const [userBio, setUserBio] = useState({});
    const [isEditingBio, setIsEditingBio] = useState(false);
    const navigate = useNavigate();
    function handleGetFriends() {

        setActiveButton('friends');

        axios.post('http://localhost:3001/api/users', {
            command: 'getFriends',
            data: {
                userId: userId
            }
        })
            .then(res => {
                console.log('Friends response:', res.data);
                setFriends(res.data.friends);
            })
            .catch(err => {
                console.error('Friends error:', err);
            })
    }

    function handleDeleteUser() {

        axios.post('http://localhost:3001/api/users', {
            commad: 'delete',
            data: {
                userId: userId
            }
        })
            .then(res => {
                console.log('Delete response:', res.data);
                navigate('/login');
            })
            .catch(err => {
                console.error('Delete error:', err);
            })
    }

    function handleGetBio() {
        setActiveButton('bio');

        axios.post('http://localhost:3001/api/users', {
            command: 'getBio',
            data: {
                userId: userId
            }
        })
            .then(res => {
                console.log('Bio response:', res.data);
                setUserBio(res.data.bio || {});
            })
            .catch(err => {
                console.error('Bio error:', err);
            })
    }

    function handleUpdateBio() {
        axios.post('http://localhost:3001/api/users', {
            command: 'updateBio',
            data: {
                userId: userId,
                bio: userBio
            }
        })
            .then(res => {
                console.log('Bio update response:', res.data);
                setIsEditingBio(false);
                alert('Bio updated successfully!');
            })
            .catch(err => {
                console.error('Bio update error:', err);
                alert('Failed to update bio');
            })
    }

    function handleAddRoomie() {

        axios.post('http://localhost:3001/api/users', {
            command: 'addFriend',
            data: {
                userId: userId
            }
        })
            .then(res => {
                console.log('Add roomie response:', res.data);
                alert('Roomie added successfully!');
            })
            .catch(err => {
                console.error('Add roomie error:', err);
                alert('Failed to add roomie');
            })
    }



    return (
        <div>
            <NavBar></NavBar>
            <SearchSideBar />
            <h1 style={{ marginTop: '100px' }}>Profile</h1>
            <div className="mb-3">
                <button className="btn btn-primary me-2" onClick={handleAddRoomie}>
                    Add Roomie
                </button>
                <button
                    className="btn btn-primary me-2"
                    onClick={handleGetBio}>
                    My Bio
                </button>
                <button
                    className="btn btn-secondary me-2"
                    onClick={handleGetFriends}>
                    My Roomies
                </button>
                <button
                    className="btn btn-danger"
                    onClick={handleDeleteUser}>
                    Delete account
                </button>
            </div>

            {/*friends list */}
            {friends.length > 0 && (
                <div className="mt-4">
                    <h3>My Friends ({friends.length})</h3>
                    <div className="list-group">
                        {friends.map((friend) => (
                            <div key={friend._id} className="list-group-item">
                                <div className="d-flex justify-content-between align-items-center">
                                    <div>
                                        <h5 className="mb-1">{friend.name}</h5>
                                        <p className="mb-1 text-muted">{friend.email}</p>
                                        <small className="text-muted">Role: {friend.role}</small>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/*show message when no friends */}
            {activeButton === 'friends' && friends.length === 0 && (
                <div className="mt-4">
                    <p className="text-muted">No friends found.</p>
                </div>
            )}

            {/*bio section */}
            {activeButton === 'bio' && (
                <div className="mt-4">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <h3>Roommate Profile</h3>
                        <button
                            className="btn btn-outline-primary"
                            onClick={() => setIsEditingBio(!isEditingBio)}
                            style={{ marginRight: '10px' }}>
                            {isEditingBio ? 'Cancel' : 'Edit Bio'}
                        </button>
                    </div>

                    <BioForm
                        bio={userBio}
                        onBioChange={setUserBio}
                        isEditing={isEditingBio}
                        showTitle={false}
                    />
                    {/*save bio button - show only when editing bio*/}
                    {isEditingBio && (
                        <div className="mt-3">
                            <button
                                className="btn btn-success"
                                onClick={handleUpdateBio}>
                                Save Bio
                            </button>
                        </div>
                    )}
                </div>
            )}
            <br />
            <button className="btn btn-primary" onClick={() => navigate(`/feed/${userId}`)}>back to feed</button>
        </div>

    )
}

export default Profile;