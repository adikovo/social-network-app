import React from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
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
    const [hasPendingRequest, setHasPendingRequest] = useState(false);
    const [hasReceivedRequest, setHasReceivedRequest] = useState(false);
    const [isAlreadyFriend, setIsAlreadyFriend] = useState(false);
    const [profileUser, setProfileUser] = useState(null);
    const navigate = useNavigate();

    //check if current user is viewing their own profile
    const isOwnProfile = currentUser && currentUser.id === userId;

    //check friendship status when component loads or when userId/currentUser changes
    useEffect(() => {
        if (currentUser && userId && !isOwnProfile) {
            checkFriendshipStatus();
        }
    }, [currentUser, userId, isOwnProfile]);

    //load bio and user data when component loads
    useEffect(() => {
        if (userId) {
            handleGetBio();
            handleGetUser();
        }
    }, [userId]);

    function checkFriendshipStatus() {
        if (!currentUser || !userId) return;

        //check if already friends
        axios.post('http://localhost:3001/api/users', {
            command: 'getFriends',
            data: {
                userId: currentUser.id
            }
        })
            .then(res => {
                const friends = res.data.friends || [];
                const isFriend = friends.some(friend => friend._id === userId);
                setIsAlreadyFriend(isFriend);

                //if not friends, check for pending and received requests
                if (!isFriend) {
                    checkPendingRequest();
                    checkReceivedRequest();
                }
            })
            .catch(err => {
                console.error('Error checking friends:', err);
            });
    }

    function checkPendingRequest() {
        axios.post('http://localhost:3001/api/users', {
            command: 'checkPendingRequest',
            data: {
                userId: currentUser.id,
                friendId: userId
            }
        })
            .then(res => {
                setHasPendingRequest(res.data.hasPendingRequest);
            })
            .catch(err => {
                console.error('Error checking pending request:', err);
            });
    }

    function checkReceivedRequest() {
        axios.post('http://localhost:3001/api/users', {
            command: 'checkReceivedRequest',
            data: {
                userId: currentUser.id,
                friendId: userId
            }
        })
            .then(res => {
                setHasReceivedRequest(res.data.hasReceivedRequest);
            })
            .catch(err => {
                console.error('Error checking received request:', err);
            });
    }

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

    function handleGetUser() {
        axios.post('http://localhost:3001/api/users', {
            command: 'getUser',
            data: {
                userId: userId
            }
        })
            .then(res => {
                console.log('User response:', res.data);
                setProfileUser(res.data.user);
            })
            .catch(err => {
                console.error('User error:', err);
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

    function handleSendFriendRequest() {
        if (!currentUser) {
            console.log('User not logged in');
            return;
        }

        axios.post('http://localhost:3001/api/users', {
            command: 'sendFriendRequest',
            data: {
                userId: currentUser.id,
                friendId: userId
            }
        })
            .then(res => {
                console.log('Friend request sent successfully', res.data);
                alert('Friend request sent successfully!');
                setHasPendingRequest(true);
            })
            .catch(err => {
                console.error('send friend request error:', err);
                alert('Failed to send friend request');
            })
    }

    function handleCancelFriendRequest() {
        if (!currentUser) {
            console.log('User not logged in');
            return;
        }

        axios.post('http://localhost:3001/api/users', {
            command: 'cancelFriendRequest',
            data: {
                userId: currentUser.id,
                friendId: userId
            }
        })
            .then(res => {
                console.log('Friend request cancelled successfully', res.data);
                alert('Friend request cancelled successfully!');
                setHasPendingRequest(false);
            })
            .catch(err => {
                console.error('cancel friend request error:', err);
                alert('Failed to cancel friend request');
            })
    }

    function handleAcceptFriendRequest() {
        if (!currentUser) {
            console.log('User not logged in');
            return;
        }

        axios.post('http://localhost:3001/api/users', {
            command: 'acceptFriendRequest',
            data: {
                userId: currentUser.id,
                friendId: userId
            }
        })
            .then(res => {
                console.log('Friend request accepted successfully', res.data);
                alert('Friend request accepted successfully!');
                setHasReceivedRequest(false);
                setIsAlreadyFriend(true);
            })
            .catch(err => {
                console.error('accept friend request error:', err);
                alert('Failed to accept friend request');
            })
    }

    function handleDeclineFriendRequest() {
        if (!currentUser) {
            console.log('User not logged in');
            return;
        }

        axios.post('http://localhost:3001/api/users', {
            command: 'declineFriendRequest',
            data: {
                userId: currentUser.id,
                friendId: userId
            }
        })
            .then(res => {
                console.log('Friend request rejected successfully', res.data);
                alert('Friend request rejected successfully!');
                setHasReceivedRequest(false);
            })
            .catch(err => {
                console.error('reject friend request error:', err);
                alert('Failed to reject friend request');
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
                <h1>{profileUser ? `${profileUser.name}'s Profile` : 'Profile'}</h1>
                <div className="mb-3">
                    {/*add roomie button only show if viewing someone else profile */}
                    {!isOwnProfile && currentUser && !isAlreadyFriend && (
                        <>
                            {hasReceivedRequest ? (
                                // Show accept/decline buttons when user has received a request
                                <>
                                    <MyButton
                                        variant='success'
                                        onClick={handleAcceptFriendRequest}
                                        style={{ marginRight: '10px' }}
                                    >
                                        Accept
                                    </MyButton>
                                    <MyButton
                                        variant='danger'
                                        onClick={handleDeclineFriendRequest}
                                        style={{ marginRight: '10px' }}
                                    >
                                        Decline
                                    </MyButton>
                                </>
                            ) : (
                                // show add roomie or cancel request button
                                <MyButton
                                    variant={hasPendingRequest ? 'secondary' : 'primary'}
                                    onClick={hasPendingRequest ? handleCancelFriendRequest : handleSendFriendRequest}
                                    style={{
                                        marginRight: '10px',
                                        backgroundColor: hasPendingRequest ? '#6c757d' : undefined,
                                        borderColor: hasPendingRequest ? '#6c757d' : undefined
                                    }}
                                >
                                    {hasPendingRequest ? 'Cancel Request' : 'Add Roomie'}
                                </MyButton>
                            )}
                        </>
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

                {/*bio section - always show */}
                <div className="mt-4">

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
                <br />
            </div>
        </div>

    )
}

export default Profile;