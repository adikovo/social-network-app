import axios from 'axios';
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import NavBar from '../components/navBar';
import SearchSideBar from '../components/searchSideBar';
import MyButton from '../components/myButton';
import ThreeDotMenu from '../components/ThreeDotMenu';
import CreateGroupForm from '../components/createGroupForm';
import { useUserContext } from '../context/UserContext';

function GroupDetails() {

    const groupId = useParams().groupId;
    const navigate = useNavigate();
    const { user } = useUserContext();

    const [group, setGroup] = useState(null);
    const [showEditForm, setShowEditForm] = useState(false);

    const fetchGroup = async () => {
        try {
            console.log('Fetching group with ID:', groupId);
            const res = await axios.post('http://localhost:3001/api/groups', {
                command: 'list',
                data: {}
            });
            console.log('API Response:', res.data);
            console.log('Groups array:', res.data.groups);
            const foundGroup = res.data.groups?.find(group => group._id === groupId);
            console.log('Found group:', foundGroup);
            setGroup(foundGroup);
        } catch (error) {
            console.error('Error fetching group:', error);
            setGroup(null);
        }
    };

    useEffect(() => {
        fetchGroup();
    }, [groupId]);

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
    const isMember = user && group && group.members?.includes(user.id);




    return (
        <div>
            <NavBar />
            <SearchSideBar />
            <div style={{ marginLeft: '320px', marginTop: '100px', padding: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <h1 style={{ margin: 0 }}>{group?.name || 'Loading...'}</h1>

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

                {user && group && !group.members?.includes(user.id) && (
                    <MyButton variant='success' onClick={handleJoinGroup}>Join Group</MyButton>
                )}
                {group && (
                    <>
                        <p><strong>Description:</strong> {group.description}</p>
                        <p><strong>Privacy:</strong> {group.privacy}</p>
                        <p><strong>Members:</strong> {group.members ? group.members.length : 0}</p>
                        <p><strong>Created by:</strong> {group.createdByName || 'Unknown'}</p>
                        <MyButton onClick={() => navigate(-1)}>Go Back</MyButton>
                    </>
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
        </div>
    )

}

export default GroupDetails;
