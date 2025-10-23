import React from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import BioForm from '../components/BioForm';
import MyButton from '../components/myButton';
import MyCard from '../components/MyCard';
import NavBar from '../components/navBar';
import SearchSideBar from '../components/searchSideBar';
import { useUserContext } from '../context/UserContext';


function Profile() {

    //user id of the viewed profile
    const userId = useParams().userId;
    //current user from context
    const { user: currentUser } = useUserContext();
    const [friends, setFriends] = useState([]);
    const [activeButton, setActiveButton] = useState(null);
    const [userBio, setUserBio] = useState({});
    const [isEditingBio, setIsEditingBio] = useState(false);
    const navigate = useNavigate();

    //check if current user is viewing their own profile
    const isOwnProfile = currentUser && currentUser.id === userId;

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
            command: 'delete',
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
        if (!currentUser) {
            console.log('User not logged in');
            return;
        }

        axios.post('http://localhost:3001/api/users', {
            command: 'addFriend',
            data: {
                userId: currentUser.id,
                friendId: userId
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

    function handleRemoveFriend(friendId) {

        axios.post('http://localhost:3001/api/users', {
            command: 'removeFriend',
            data: {
                userId: currentUser.id,
                friendId: friendId
            }
        })
            .then(res => {
                console.log('Remove friend response:', res.data);
                alert('Friend removed successfully!');
                //refresh the friends list
                handleGetFriends();
            })
            .catch(err => {
                console.error('Remove friend error:', err);
                alert('Failed to remove friend');
            })
    }




    return (
        <div>
            <NavBar></NavBar>
            <SearchSideBar />
            <div style={{
                marginLeft: '320px',
                padding: '20px',
                marginTop: '100px'
            }}>
                <h1>Profile</h1>
                <div className="mb-3">
                    {/*ddd roomie button only show if viewing someone else profile */}
                    {!isOwnProfile && currentUser && (
                        <MyButton
                            variant='primary'
                            onClick={handleAddRoomie}
                            style={{ marginRight: '10px' }}
                        >
                            Add Roomie
                        </MyButton>
                    )}

                    {/*edit bio button only show if viewing own profile */}
                    {isOwnProfile && (
                        <MyButton
                            variant='outline-primary'
                            onClick={() => setIsEditingBio(!isEditingBio)}
                            style={{ marginRight: '10px' }}
                        >
                            {isEditingBio ? 'Cancel' : 'Edit Bio'}
                        </MyButton>
                    )}

                    {/*my roomies button only show if viewing own profile */}
                    {isOwnProfile && (
                        <MyButton
                            variant='secondary'
                            onClick={handleGetFriends}
                            style={{ marginRight: '10px' }}
                        >
                            My Roomies
                        </MyButton>
                    )}

                    {/*my bio button only show if viewing own profile */}
                    {isOwnProfile && (
                        <MyButton
                            variant='primary'
                            onClick={handleGetBio}
                            style={{ marginRight: '10px' }}
                        >
                            My Bio
                        </MyButton>
                    )}

                    {/*delete account button only show if viewing own profile */}
                    {isOwnProfile && (
                        <MyButton
                            variant='danger'
                            onClick={handleDeleteUser}
                        >
                            Delete account
                        </MyButton>
                    )}
                </div>


                {/*friends list */}
                {friends.length > 0 && (
                    <div className="mt-4">
                        <h3>My Friends ({friends.length})</h3>
                        <div>
                            {friends.map((friend) => (
                                <MyCard
                                    key={friend._id}
                                    type="users"
                                    data={friend}
                                    onClick={(friendData) => {
                                        // Navigate to friend's profile
                                        navigate(`/profile/${friendData._id}`);
                                    }}
                                    button={
                                        <MyButton
                                            variant='danger'
                                            onClick={() => handleRemoveFriend(friend._id)}
                                        >
                                            Remove Roomie
                                        </MyButton>
                                    }
                                />
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
            </div>
        </div>

    )
}

export default Profile;