import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import MyCard from './MyCard';
import MyButton from './myButton';
import { useUserContext } from '../context/UserContext';
import MyAlert from './MyAlert';
import useMyAlert from '../hooks/useMyAlert';

function FriendsList({
    userId,
    currentMode,
    onModeChange,
    //'friends' or 'groupMembers'
    type = 'friends',
    groupId = null,
    group = null,
    showInModal = false,
    onClose = null
}) {
    const navigate = useNavigate();
    const { user: currentUser } = useUserContext();
    const [members, setMembers] = useState([]);
    const [loading, setLoading] = useState(false);
    const { alert, showSuccess, showError, hideAlert } = useMyAlert();

    // Check if current user is viewing their own profile
    const isOwnProfile = currentUser && currentUser.id === userId;

    // Fetch data when component mounts or dependencies change
    useEffect(() => {
        if (type === 'friends' && userId && isOwnProfile) {
            handleGetFriends();
        } else if (type === 'groupMembers' && groupId) {
            handleGetGroupMembers();
        }
    }, [userId, groupId, type, isOwnProfile]);

    function handleGetFriends() {
        if (onModeChange) onModeChange('friends');
        setLoading(true);

        axios.post('http://localhost:3001/api/users', {
            command: 'getFriends',
            data: {
                userId: userId
            }
        })
            .then(res => {
                console.log('Friends response:', res.data);
                setMembers(res.data.friends);
            })
            .catch(err => {
                console.error('Friends error:', err);
            })
            .finally(() => setLoading(false));
    }

    function handleGetGroupMembers() {
        setLoading(true);

        axios.post('http://localhost:3001/api/groups', {
            command: 'getGroup',
            data: {
                groupId: groupId,
                userId: currentUser?.id
            }
        })
            .then(res => {
                console.log('Group members response:', res.data);
                setMembers(res.data.group.membersWithNames || []);
            })
            .catch(err => {
                console.error('Group members error:', err);
            })
            .finally(() => setLoading(false));
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
                showSuccess('Friend removed successfully!');
                //refresh the friends list
                handleGetFriends();
            })
            .catch(err => {
                console.error('Remove friend error:', err);
                showError('Failed to remove friend');
            })
    }

    // Don't render if not in the right mode
    if (type === 'friends' && (currentMode !== 'friends' || !isOwnProfile)) {
        return null;
    }

    // For group members, always render if groupId is provided
    if (type === 'groupMembers' && !groupId) {
        return null;
    }

    const getTitle = () => {
        if (type === 'friends') {
            return `My Roomies (${members.length})`;
        } else if (type === 'groupMembers') {
            return `Group Members (${members.length})`;
        }
        return '';
    };

    const getEmptyMessage = () => {
        if (type === 'friends') {
            return 'No friends found.';
        } else if (type === 'groupMembers') {
            return 'No members found.';
        }
        return '';
    };

    const renderMemberCard = (member) => {
        if (type === 'friends') {
            return (
                <MyCard
                    key={member._id}
                    type="users"
                    data={member}
                    compact={true}
                    profilePictureSize="medium"
                    onClick={(friendData) => {
                        navigate(`/profile/${friendData._id}`);
                    }}
                    button={
                        <MyButton
                            variant='danger'
                            onClick={() => handleRemoveFriend(member._id)}
                        >
                            Remove Roomie
                        </MyButton>
                    }
                />
            );
        } else if (type === 'groupMembers') {
            return (
                <MyCard
                    key={member.id}
                    type="users"
                    data={member}
                    compact={false}
                    profilePictureSize="medium"
                    onClick={(memberData) => {
                        navigate(`/profile/${memberData.id}`);
                        if (onClose) onClose();
                    }}
                />
            );
        }
        return null;
    };

    if (loading) {
        return (
            <div className="mt-4">
                <p>Loading...</p>
            </div>
        );
    }

    return (
        <div className={showInModal ? "" : "mt-4"}>
            {members.length > 0 ? (
                <>
                    <h3>{getTitle()}</h3>
                    <div>
                        {members.map((member) => renderMemberCard(member))}
                    </div>
                </>
            ) : (
                <p className="text-muted">{getEmptyMessage()}</p>
            )}

            {/* MyAlert Component */}
            <MyAlert
                show={alert.show}
                message={alert.message}
                type={alert.type}
                duration={alert.duration}
                onClose={hideAlert}
            />
        </div>
    );
}

export default FriendsList;
