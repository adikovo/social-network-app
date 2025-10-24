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
import { useUserContext } from '../context/UserContext';

function GroupDetails() {

    const groupId = useParams().groupId;
    const navigate = useNavigate();
    const { user } = useUserContext();

    const [group, setGroup] = useState(null);
    const [showEditForm, setShowEditForm] = useState(false);
    const [showMembersModal, setShowMembersModal] = useState(false);
    const [groupPosts, setGroupPosts] = useState([]);

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

    useEffect(() => {
        if (user?.id) {
            fetchGroup();
            fetchGroupPosts();
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
            console.log('Joined group successfully:', response.data);
            //update the group members array 
            setGroup(prevGroup => ({
                ...prevGroup,
                members: [...(prevGroup.members || []), user.id]
            }));
        }).catch(error => {
            console.error('Error joining group:', error);
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
                    groupId: groupId
                }
            }).then(response => {
                console.log('Group deleted successfully:', response.data);
                alert('Group deleted successfully!');
                navigate('/groups');
            }).catch(error => {
                console.error('Error deleting group:', error);
                alert('Failed to delete group: ' + (error.message));
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
                alert('You have left the group successfully!');
                navigate('/groups');
            }).catch(error => {
                console.error('Error leaving group:', error);
                alert('Failed to leave group: ' + (error.message));
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




    return (
        <div>
            <NavBar />
            <SearchSideBar />
            <div style={{ marginLeft: '320px', marginTop: '100px', padding: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                        <h1 style={{ margin: 0 }}>{group?.name || 'Loading...'}</h1>
                        {group && (
                            <MyButton onClick={() => setShowMembersModal(true)}>
                                View Members ({group.members ? group.members.length : 0})
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
                    <MyButton variant='success' onClick={handleJoinGroup}>Join Group</MyButton>
                )}
                {group && <GroupInfo group={group} />}

                {/* show create post for members only */}
                {isMember && (
                    <CreatePost onPostCreated={handlePostCreated} groupId={groupId} />
                )}

                {/*show posts based on group privacy */}
                {(group?.privacy === 'public' || isMember) && (
                    <div style={{ marginTop: '20px' }}>
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

            {/* Members Modal TODO: change itttt!!! */}
            {showMembersModal && (
                <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Group Members</h5>
                                <button
                                    type="button"
                                    className="btn-close"
                                    onClick={() => setShowMembersModal(false)}
                                ></button>
                            </div>
                            <div className="modal-body">
                                {group?.membersWithNames && group.membersWithNames.length > 0 ? (
                                    <div className="list-group">
                                        {group.membersWithNames.map((member, index) => (
                                            <div key={member.id || index} className="list-group-item d-flex justify-content-between align-items-center">
                                                <div>
                                                    <strong>{member.name}</strong>
                                                    {member.id === group.createdBy && (
                                                        <span className="badge bg-primary ms-2">Creator</span>
                                                    )}
                                                    {group.admins?.includes(member.id) && member.id !== group.createdBy && (
                                                        <span className="badge bg-secondary ms-2">Admin</span>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p>No members found.</p>
                                )}
                            </div>
                            <div className="modal-footer">
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={() => setShowMembersModal(false)}
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )

}

export default GroupDetails;
