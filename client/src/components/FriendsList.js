import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import MyCard from './MyCard';
import MyButton from './MyButton';
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
    const [isCurrentUserAdmin, setIsCurrentUserAdmin] = useState(false);
    const [groupData, setGroupData] = useState(null);
    const { alert, showSuccess, showError, hideAlert } = useMyAlert();

    //check if current user is viewing their own profile
    const isOwnProfile = currentUser && currentUser.id === userId;

    //fetch data when component mounts or dependencies change
    useEffect(() => {
        if (type === 'friends' && userId && isOwnProfile) {
            handleGetFriends();
        } else if (type === 'groupMembers' && groupId) {
            handleGetGroupMembers();
            checkAdminStatus();
        }
    }, [userId, groupId, type, isOwnProfile]);

    function handleGetFriends() {
        if (onModeChange) onModeChange('friends');
        setLoading(true);

        axios.get('http://localhost:3001/api/users/friends', {
            params: {
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

        axios.get('http://localhost:3001/api/groups/get', {
            params: {
                groupId: groupId,
                userId: currentUser?.id
            }
        })
            .then(res => {
                console.log('Group members response:', res.data);
                setGroupData(res.data.group);
                setMembers(res.data.group.membersWithNames || []);
            })
            .catch(err => {
                console.error('Group members error:', err);
            })
            .finally(() => setLoading(false));
    }

    //check if current user is an admin of the group
    function checkAdminStatus() {
        if (!groupId || !currentUser?.id) return;

        axios.get('http://localhost:3001/api/groups/check-admin', {
            params: {
                groupId: groupId,
                userId: currentUser.id
            }
        })
            .then(res => {
                console.log('Admin check response:', res.data);
                setIsCurrentUserAdmin(res.data.isAdmin || false);
            })
            .catch(err => {
                console.error('Admin check error:', err);
                setIsCurrentUserAdmin(false);
            });
    }

    function handlePromoteToAdmin(memberId) {
        if (!groupId || !currentUser?.id) return;

        axios.put('http://localhost:3001/api/groups/add-admin', {
            groupId: groupId,
            userId: memberId,
            requestingUserId: currentUser.id
        })
            .then(res => {
                console.log('Promote to admin response:', res.data);
                showSuccess('Member promoted to admin successfully!');
                //refresh the group members list
                handleGetGroupMembers();
            })
            .catch(err => {
                console.error('Promote to admin error:', err);
                showError('Failed to promote member to admin: ' + (err.response?.data?.message || err.message));
            });
    }

    function handleRemoveAdmin(memberId) {
        if (!groupId || !currentUser?.id) return;

        axios.delete('http://localhost:3001/api/groups/remove-admin', {
            data: {
                groupId: groupId,
                userId: memberId,
                requestingUserId: currentUser.id
            }
        })
            .then(res => {
                console.log('Remove admin response:', res.data);
                showSuccess('Admin privileges removed successfully!');
                //refresh the group members list
                handleGetGroupMembers();
            })
            .catch(err => {
                console.error('Remove admin error:', err);
                showError('Failed to remove admin privileges: ' + (err.response?.data?.message || err.message));
            });
    }

    function handleRemoveFriend(friendId) {
        axios.delete('http://localhost:3001/api/users/remove-friend', {
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

    //dont render if not in the right mode
    if (type === 'friends' && (currentMode !== 'friends' || !isOwnProfile)) {
        return null;
    }

    //for group members, always render if groupId is provided
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
            //check if this member is an admin
            const isMemberAdmin = groupData?.admins?.includes(member.id) || false;
            const isCreator = groupData?.createdBy === member.id;

            //show admin management buttons for admins
            //only creators can remove admin privileges, admins can promote members
            const isCurrentUserCreator = groupData?.createdBy === currentUser?.id;
            const showPromoteButton = isCurrentUserAdmin && !isCreator && member.id !== currentUser?.id;
            const showRemoveAdminButton = isCurrentUserCreator && isMemberAdmin && member.id !== currentUser?.id;

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
                    button={
                        (showPromoteButton || showRemoveAdminButton) ? (
                            <div style={{ display: 'flex', gap: '8px' }}>
                                {showRemoveAdminButton && (
                                    <MyButton
                                        variant='warning'
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            if (window.confirm(`Are you sure you want to remove admin privileges from ${member.name}?`)) {
                                                handleRemoveAdmin(member.id);
                                            }
                                        }}
                                    >
                                        Remove Admin
                                    </MyButton>
                                )}
                                {showPromoteButton && !isMemberAdmin && (
                                    <MyButton
                                        variant='success'
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            if (window.confirm(`Are you sure you want to promote ${member.name} to admin?`)) {
                                                handlePromoteToAdmin(member.id);
                                            }
                                        }}
                                    >
                                        Make Admin
                                    </MyButton>
                                )}
                            </div>
                        ) : isMemberAdmin ? (
                            <div style={{
                                padding: '4px 8px',
                                backgroundColor: '#e3f2fd',
                                color: '#1976d2',
                                borderRadius: '4px',
                                fontSize: '0.8rem',
                                fontWeight: 'bold'
                            }}>
                                Admin
                            </div>
                        ) : isCreator ? (
                            <div style={{
                                padding: '4px 8px',
                                backgroundColor: '#fff3e0',
                                color: '#f57c00',
                                borderRadius: '4px',
                                fontSize: '0.8rem',
                                fontWeight: 'bold'
                            }}>
                                Creator
                            </div>
                        ) : null
                    }
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
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(2, 1fr)',
                        gap: '20px',
                        maxWidth: '100%'
                    }}>
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
