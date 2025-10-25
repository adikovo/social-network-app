import axios from 'axios';
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import NavBar from '../components/navBar';
import SearchSideBar from '../components/searchSideBar';
import MyButton from '../components/myButton';
import ThreeDotMenu from '../components/ThreeDotMenu';
import CreateGroupForm from '../components/createGroupForm';
import GroupInfo from '../components/GroupInfo';
import CreatePost from '../components/CreatePost';
import Post from '../components/Post';
import FriendsList from '../components/FriendsList';
import { useUserContext } from '../context/UserContext';
import MyAlert from '../components/MyAlert';
import useMyAlert from '../hooks/useMyAlert';

function GroupDetails() {

    const groupId = useParams().groupId;
    const navigate = useNavigate();
    const { user, isLoading } = useUserContext();

    const [group, setGroup] = useState(null);
    const [showEditForm, setShowEditForm] = useState(false);
    const [showMembers, setShowMembers] = useState(false);
    const [groupPosts, setGroupPosts] = useState([]);
    const [hasPendingJoinRequest, setHasPendingJoinRequest] = useState(false);
    const { alert, showSuccess, showError, showInfo, hideAlert } = useMyAlert();

    // Redirect to login if not authenticated
    useEffect(() => {
        if (!isLoading && !user) {
            navigate('/login');
            return;
        }
    }, [user, isLoading, navigate]);

    const fetchGroup = async () => {
        try {
            console.log('Fetching group with ID:', groupId);
            const res = await axios.post('http://localhost:3001/api/groups', {
                command: 'getGroup',
                data: {
                    groupId: groupId,
                    userId: user?.id
                }
            });
            console.log('API Response:', res.data);
            setGroup(res.data.group);
        } catch (error) {
            console.error('Error fetching group:', error);
            setGroup(null);
        }
    };

    const fetchGroupPosts = async () => {
        try {
            const res = await axios.post('http://localhost:3001/api/groups', {
                command: 'getGroupPosts',
                data: {
                    groupId: groupId,
                    userId: user?.id
                }
            });
            console.log('Group posts response:', res.data);
            setGroupPosts(res.data.posts || []);
        } catch (error) {
            console.error('Error fetching group posts:', error);
            setGroupPosts([]);
        }
    };

    const checkJoinRequestStatus = async () => {
        try {
            const res = await axios.post('http://localhost:3001/api/groups', {
                command: 'checkJoinRequestStatus',
                data: {
                    groupId: groupId,
                    userId: user?.id
                }
            });
            console.log('Join request status response:', res.data);
            setHasPendingJoinRequest(res.data.hasPendingRequest);
        } catch (error) {
            console.error('Error checking join request status:', error);
            setHasPendingJoinRequest(false);
        }
    };

    useEffect(() => {
        if (user?.id) {
            fetchGroup();
            fetchGroupPosts();
            checkJoinRequestStatus();
        }
    }, [groupId, user?.id]);

    function handleJoinGroup() {
        if (!user) {
            console.log('User not logged in');
            return;
        }

        axios.post('http://localhost:3001/api/groups', {
            command: 'joinGroup',
            data: {
                groupId: groupId,
                userId: user.id
            }
        }).then(response => {
            console.log('Join group response:', response.data);
            if (response.data.message === 'join request sent successfully') {
                // For private groups, show pending state
                setHasPendingJoinRequest(true);
                showInfo('Join request sent! Waiting for admin approval.');
            } else if (response.data.message === 'user joined group successfully') {
                // For public groups, add to members immediately
                setGroup(prevGroup => ({
                    ...prevGroup,
                    members: [...(prevGroup.members || []), user.id]
                }));
                showSuccess('Successfully joined the group!');
            }
        }).catch(error => {
            console.error('Error joining group:', error);
            showError('Failed to join group');
        });
    }

    function handleEditGroup() {
        setShowEditForm(true);
    }

    function handleGroupUpdated() {
        // refresh group data after successful update
        fetchGroup();
    }

    const handlePostCreated = (newPost) => {
        //add the new post to the beginning of the group posts array
        setGroupPosts(prevPosts => [newPost, ...prevPosts]);
    };


    const handlePostUpdated = (deletedPostId, updatedPost) => {
        if (deletedPostId) {
            //remove the deleted post from arrray
            setGroupPosts(prevPosts => prevPosts.filter(post => post._id !== deletedPostId));
        }
        else if (updatedPost) {
            //update the specific post in local state
            setGroupPosts(prevPosts =>
                prevPosts.map(post =>
                    post._id === updatedPost._id ? updatedPost : post
                )
            );
        } else {
            // For other updates, refresh from server
            fetchGroupPosts();
        }
    };

    function handleDeleteGroup() {
        if (window.confirm('Are you sure you want to delete this group? This action cannot be undone.')) {
            axios.post('http://localhost:3001/api/groups', {
                command: 'delete',
                data: {
                    groupId: groupId,
                    userId: user.id
                }
            }).then(response => {
                console.log('Group deleted successfully:', response.data);
                showSuccess('Group deleted successfully!');
                navigate('/groups');
            }).catch(error => {
                console.error('Error deleting group:', error);
                showError('Failed to delete group: ' + (error.response?.data?.message || error.message));
            });
        }
    }

    function handleLeaveGroup() {
        if (window.confirm('Are you sure you want to leave this group?')) {
            axios.post('http://localhost:3001/api/groups', {
                command: 'leaveGroup',
                data: {
                    userId: user.id,
                    groupId: groupId
                }
            }).then(response => {
                console.log('Left group successfully:', response.data);
                //update the group members array after leaving the group
                setGroup(prevGroup => ({
                    ...prevGroup,
                    members: prevGroup.members?.filter(memberId => memberId !== user.id) || []
                }));
                showSuccess('You have left the group successfully!');
                navigate('/groups');
            }).catch(error => {
                console.error('Error leaving group:', error);
                showError('Failed to leave group: ' + (error.message));
            });
        }
    }

    //check if current user is the creator of the group
    const isCreator = user && group && user.id === group.createdBy;
    //check if current user is a member of the group 
    const isMember = user && group && (
        group.members?.includes(user.id) ||
        group.admins?.includes(user.id)
    );

    // Show loading while checking for stored user
    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (!group) {
        return (
            <div>
                <NavBar />
                <SearchSideBar />
                <div style={{ marginLeft: '320px', marginTop: '100px', padding: '20px' }}>
                    <div>Group not found or you don't have permission to view it.</div>
                </div>
            </div>
        );
    }

    return (
        <div>
            <NavBar />
            <SearchSideBar />
            <div style={{ marginLeft: '320px', marginTop: '100px', padding: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                        <h1 style={{ margin: 0 }}>{group?.name || 'Loading...'}</h1>
                        {group && (
                            <MyButton onClick={() => setShowMembers(!showMembers)}>
                                {showMembers ? 'Hide Members' : `View Members (${group.members ? group.members.length : 0})`}
                            </MyButton>
                        )}
                    </div>

                    {/*show different buttons based on user role */}
                    {isCreator ? (
                        /* 3 dot menu - only show if user is creator */
                        <ThreeDotMenu
                            menuItems={[
                                { id: 'edit', label: 'Edit Group', action: 'edit' },
                                { id: 'delete', label: 'Delete Group', action: 'delete', danger: true }
                            ]}
                            onItemClick={(item) => {
                                if (item.action === 'edit') {
                                    handleEditGroup();
                                } else if (item.action === 'delete') {
                                    handleDeleteGroup();
                                }
                            }}
                        />
                    ) : isMember ? (
                        /* leave button only show if user is a member but not creator */
                        <MyButton
                            variant='danger'
                            onClick={handleLeaveGroup}
                        >
                            Leave Group
                        </MyButton>
                    ) : null}
                </div>

                {user && group && !isMember && (
                    <MyButton
                        variant={hasPendingJoinRequest ? 'secondary' : 'success'}
                        onClick={hasPendingJoinRequest ? null : handleJoinGroup}
                        disabled={hasPendingJoinRequest}
                    >
                        {hasPendingJoinRequest ? 'Pending' : 'Join Group'}
                    </MyButton>
                )}
                {group && <GroupInfo group={group} />}

                {/* show create post for members only - hide when showing members */}
                {isMember && !showMembers && (
                    <CreatePost
                        onPostCreated={handlePostCreated}
                        groupId={groupId}
                    />
                )}

                {/* show members list or posts based on state */}
                {showMembers ? (
                    <div style={{ marginTop: '20px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
                            <MyButton
                                variant='secondary'
                                onClick={() => setShowMembers(false)}
                                style={{ marginRight: '15px' }}
                            >
                                ← Back to Feed
                            </MyButton>
                        </div>
                        {group.privacy === 'private' && !isMember ? null : (
                            <FriendsList
                                type="groupMembers"
                                groupId={groupId}
                                showInModal={false}
                            />
                        )}
                    </div>
                ) : (
                    /*show posts based on group privacy */
                    <div style={{ marginTop: '20px' }}>
                        {group?.privacy === 'private' && !isMember ? null : (
                            <>
                                {groupPosts.length > 0 ? (
                                    groupPosts.map((post) => (
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
                                        <p>No posts in this group yet.</p>
                                        {isMember && <p>Be the first to share something!</p>}
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                )}
            </div>

            {/*edit group form */}
            <CreateGroupForm
                show={showEditForm}
                onClose={() => setShowEditForm(false)}
                userId={user?.id}
                onGroupCreated={handleGroupUpdated}
                editMode={true}
                groupToEdit={group}
            />

            {/* MyAlert Component */}
            <MyAlert
                show={alert.show}
                message={alert.message}
                type={alert.type}
                duration={alert.duration}
                onClose={hideAlert}
            />

        </div>
    )

}

export default GroupDetails;
