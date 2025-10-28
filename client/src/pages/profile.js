import React from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import BioForm from '../components/BioForm';
import MyButton from '../components/MyButton';
import NavBar from '../components/navBar';
import SearchSideBar from '../components/SearchSideBar';
import SearchResultsOverlay from '../components/SearchResultsOverlay';
import ProfilePicture from '../components/ProfilePicture';
import ThreeDotMenu from '../components/ThreeDotMenu';
import FriendsList from '../components/FriendsList';
import { useUserContext } from '../context/UserContext';
import MyAlert from '../components/MyAlert';
import useMyAlert from '../hooks/useMyAlert';
import { theme } from '../theme/colors';


function Profile() {

    //user id of the viewed profile
    const userId = useParams().userId;
    //current user from context
    const { user: currentUser, isLoading } = useUserContext();
    const [currentMode, setCurrentMode] = useState('bio');
    const [userBio, setUserBio] = useState({});
    const [isEditingBio, setIsEditingBio] = useState(false);
    const [hasPendingRequest, setHasPendingRequest] = useState(false);
    const [hasReceivedRequest, setHasReceivedRequest] = useState(false);
    const [isAlreadyFriend, setIsAlreadyFriend] = useState(false);
    const [profileUser, setProfileUser] = useState(null);
    const [showSearchOverlay, setShowSearchOverlay] = useState(false);
    const [searchData, setSearchData] = useState(null);
    const navigate = useNavigate();
    const { alert, showSuccess, showError, hideAlert } = useMyAlert();

    //redirect to login if not authenticated
    useEffect(() => {
        if (!isLoading && !currentUser) {
            navigate('/login');
            return;
        }
    }, [currentUser, isLoading, navigate]);

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
        axios.get('http://localhost:3001/api/users/friends', {
            params: {
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
        axios.get('http://localhost:3001/api/users/check-pending-request', {
            params: {
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
        axios.get('http://localhost:3001/api/users/check-received-request', {
            params: {
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


    function handleDeleteUser() {

        axios.delete('http://localhost:3001/api/users/delete', {
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
        setCurrentMode('bio');
        axios.get('http://localhost:3001/api/users/bio', {
            params: {
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
        axios.get('http://localhost:3001/api/users/get', {
            params: {
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
        axios.put('http://localhost:3001/api/users/update-bio', {
            userId: userId,
            bio: userBio
        })
            .then(res => {
                console.log('Bio update response:', res.data);
                setIsEditingBio(false);
                showSuccess('Bio updated successfully!');
            })
            .catch(err => {
                console.error('Bio update error:', err);
                showError('Failed to update bio');
            })
    }

    function handleSendFriendRequest() {
        if (!currentUser) {
            console.log('User not logged in');
            return;
        }

        axios.post('http://localhost:3001/api/users/send-friend-request', {
            userId: currentUser.id,
            friendId: userId
        })
            .then(res => {
                console.log('Friend request sent successfully', res.data);
                showSuccess('Friend request sent successfully!');
                setHasPendingRequest(true);
            })
            .catch(err => {
                console.error('send friend request error:', err);
                showError('Failed to send friend request');
            })
    }

    function handleCancelFriendRequest() {
        if (!currentUser) {
            console.log('User not logged in');
            return;
        }

        axios.delete('http://localhost:3001/api/users/cancel-friend-request', {
            data: {
                userId: currentUser.id,
                friendId: userId
            }
        })
            .then(res => {
                console.log('Friend request cancelled successfully', res.data);
                showSuccess('Friend request cancelled successfully!');
                setHasPendingRequest(false);
            })
            .catch(err => {
                console.error('cancel friend request error:', err);
                showError('Failed to cancel friend request');
            })
    }

    function handleAcceptFriendRequest() {
        if (!currentUser) {
            console.log('User not logged in');
            return;
        }

        axios.put('http://localhost:3001/api/users/accept-friend-request', {
            userId: currentUser.id,
            friendId: userId
        })
            .then(res => {
                console.log('Friend request accepted successfully', res.data);
                showSuccess('Friend request accepted successfully!');
                setHasReceivedRequest(false);
                setIsAlreadyFriend(true);
            })
            .catch(err => {
                console.error('accept friend request error:', err);
                showError('Failed to accept friend request');
            })
    }

    function handleDeclineFriendRequest() {
        if (!currentUser) {
            console.log('User not logged in');
            return;
        }

        axios.delete('http://localhost:3001/api/users/decline-friend-request', {
            data: {
                userId: currentUser.id,
                friendId: userId
            }
        })
            .then(res => {
                console.log('Friend request rejected successfully', res.data);
                showSuccess('Friend request rejected successfully!');
                setHasReceivedRequest(false);
            })
            .catch(err => {
                console.error('reject friend request error:', err);
                showError('Failed to reject friend request');
            })
    }


    const handleProfilePictureChange = async (file) => {
        try {
            //create a preview URL for immediate display
            const previewUrl = URL.createObjectURL(file);

            //create FormData to send the file to server
            const formData = new FormData();
            formData.append('userId', currentUser.id);
            formData.append('profilePicture', file);

            const res = await axios.post('http://localhost:3001/api/users/upload-profile-picture', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            //update the profile user state with the new picture
            if (res.data.success && res.data.user) {
                setProfileUser(prevUser => ({
                    ...prevUser,
                    profilePicture: res.data.user.profilePicture
                }));
                showSuccess('Profile picture updated successfully!');
            }
        } catch (error) {
            console.error('Profile picture upload error:', error);
            showError('Failed to update profile picture');
        }
    }

    const handleSearchResults = (searchData) => {
        setSearchData(searchData);
        setShowSearchOverlay(true);
    };

    const handleCloseSearchOverlay = () => {
        setShowSearchOverlay(false);
        setSearchData(null);
    };

    const handleUserClick = (user) => {
        navigate(`/profile/${user._id}`);
    };

    const handleGroupClick = (group) => {
        navigate(`/group/${group._id}`);
    };

    const handleDeleteProfilePicture = async () => {
        if (!window.confirm('Are you sure you want to delete your profile picture?')) {
            return;
        }

        try {
            const res = await axios.delete('http://localhost:3001/api/users/delete-profile-picture', {
                data: {
                    userId: currentUser.id
                }
            });

            if (res.data.success) {
                setProfileUser(prevUser => ({
                    ...prevUser,
                    profilePicture: null
                }));
                showSuccess('Profile picture deleted successfully!');
            }
        } catch (error) {
            console.error('Profile picture delete error:', error);
            showError('Failed to delete profile picture');
        }
    }

    const handleMenuClick = (item) => {
        switch (item.id) {
            case 'editBio':
                setIsEditingBio(!isEditingBio);
                break;
            case 'deleteProfilePicture':
                handleDeleteProfilePicture();
                break;
            case 'deleteAccount':
                handleDeleteUser();
                break;
            default:
                console.log('Unknown menu item:', item.id);
        }
    }

    //show loading while checking for stored user
    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <NavBar></NavBar>
            <SearchSideBar onSearchResults={handleSearchResults} />
            <div style={{
                padding: '20px',
                marginTop: '100px',
                maxWidth: '1200px',
                marginLeft: '320px',
                marginRight: 'auto'
            }}>
                {/*profile header */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '20px'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <ProfilePicture
                            currentImage={profileUser?.profilePicture}
                            onImageChange={handleProfilePictureChange}
                            size="large"
                            editMode={isOwnProfile}
                            userId={profileUser?.id}
                        />
                        <h1 style={{ marginTop: 0, marginRight: 0, marginBottom: 0, marginLeft: '25px' }}>
                            {profileUser ? `${profileUser.name}'s Profile` : 'Profile'}
                        </h1>
                    </div>

                    {/*profile options menu show only when viewing own profile */}
                    {isOwnProfile && (
                        <ThreeDotMenu
                            menuItems={[
                                {
                                    id: 'editBio',
                                    label: 'Edit Bio'
                                },
                                {
                                    id: 'deleteProfilePicture',
                                    label: 'Delete Profile Picture',
                                    danger: true
                                },
                                {
                                    id: 'deleteAccount',
                                    label: 'Delete Account',
                                    danger: true
                                }
                            ]}
                            onItemClick={handleMenuClick}
                        />
                    )}
                </div>

                {/*bio and roomies buttons only show when viewing own profile */}
                {isOwnProfile && (
                    <div className="mb-3">
                        <div style={{ display: 'flex', gap: '10px' }}>
                            <MyButton
                                variant={currentMode === 'bio' ? 'primary' : 'secondary'}
                                onClick={handleGetBio}
                                style={{
                                    transition: 'all 0.2s ease',
                                    transform: currentMode === 'bio' ? 'scale(1.05)' : 'scale(1)',
                                    boxShadow: currentMode === 'bio' ? `0 4px 8px ${theme.primaryShadow}` : 'none'
                                }}
                            >
                                Bio
                            </MyButton>
                            <MyButton
                                variant={currentMode === 'friends' ? 'primary' : 'secondary'}
                                onClick={() => setCurrentMode('friends')}
                                style={{
                                    transition: 'all 0.2s ease',
                                    transform: currentMode === 'friends' ? 'scale(1.05)' : 'scale(1)',
                                    boxShadow: currentMode === 'friends' ? `0 4px 8px ${theme.primaryShadow}` : 'none'
                                }}
                            >
                                My Roomies
                            </MyButton>
                        </div>
                    </div>
                )}

                {/*add roomie button only show if viewing someone else profile */}
                {!isOwnProfile && currentUser && !isAlreadyFriend && (
                    <div className="mb-3">
                        {hasReceivedRequest ? (
                            //show accept/decline buttons when user has received a request
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
                            //show add roomie or cancel request button
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
                    </div>
                )}

                {/*friends list */}
                <FriendsList
                    userId={userId}
                    currentMode={currentMode}
                    onModeChange={setCurrentMode}
                />

                {/*bio section always show */}
                {currentMode === 'bio' && <div className="mt-4">
                    <div>
                        {/*bio form buttons */}
                        {isEditingBio && (
                            <div style={{
                                display: 'flex',
                                justifyContent: 'flex-end',
                                marginBottom: '15px',
                                gap: '10px'
                            }}>
                                <MyButton
                                    variant='secondary'
                                    onClick={() => setIsEditingBio(false)}
                                >
                                    Cancel
                                </MyButton>
                                <MyButton
                                    variant='success'
                                    onClick={handleUpdateBio}
                                >
                                    Save Bio
                                </MyButton>
                            </div>
                        )}

                        <BioForm
                            bio={userBio}
                            onBioChange={setUserBio}
                            isEditing={isEditingBio}
                            showTitle={false}
                        />
                    </div>
                </div>}
                <br />
            </div>

            {/*myAlert component */}
            <MyAlert
                show={alert.show}
                message={alert.message}
                type={alert.type}
                duration={alert.duration}
                onClose={hideAlert}
            />

            <SearchResultsOverlay
                isVisible={showSearchOverlay}
                onClose={handleCloseSearchOverlay}
                searchData={searchData}
                onUserClick={handleUserClick}
                onGroupClick={handleGroupClick}
            />
        </div>
    )
}

export default Profile;