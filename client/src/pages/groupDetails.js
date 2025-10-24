import axios from 'axios';
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import NavBar from '../components/navBar';
import SearchSideBar from '../components/searchSideBar';
import MyButton from '../components/myButton';
import ThreeDotMenu from '../components/ThreeDotMenu';
import { useUserContext } from '../context/UserContext';

function GroupDetails() {

    const groupId = useParams().groupId;
    const navigate = useNavigate();
    const { user } = useUserContext();

    const [group, setGroup] = useState(null);

    useEffect(() => {
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

        }).catch(error => {
            console.error('Error joining group:', error);
        });
    }

    function handleEditGroup() {
        // TODO: Implement edit group functionality
        console.log('Edit group:', groupId);
        // You can navigate to an edit page or show a modal
        // navigate(`/group/${groupId}/edit`);
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

    //check if current user is the creator of the group
    const isCreator = user && group && user.id === group.createdBy;




    return (
        <div>
            <NavBar />
            <SearchSideBar />
            <div style={{ marginLeft: '320px', marginTop: '100px', padding: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <h1 style={{ margin: 0 }}>{group?.name || 'Loading...'}</h1>

                    {/* 3 dot menu - only show if user is creator */}
                    {isCreator && (
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
                    )}
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
        </div>
    )

}

export default GroupDetails;
