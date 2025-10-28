import React from 'react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import CreateGroupForm from '../components/CreateGroupForm';
import GroupCard from '../components/GroupCard';
import NavBar from '../components/navBar';
import SearchSideBar from '../components/SearchSideBar';
import SearchResultsOverlay from '../components/SearchResultsOverlay';
import MyButton from '../components/MyButton';
import { useUserContext } from '../context/UserContext';
import MyAlert from '../components/MyAlert';
import useMyAlert from '../hooks/useMyAlert';

function Groups() {

    //get current user from context
    const { user: currentUser, isLoading } = useUserContext();

    const navigate = useNavigate();
    const [groups, setGroups] = useState([]);
    const [showCreateGroup, setShowCreateGroup] = useState(false);
    const [showSearchOverlay, setShowSearchOverlay] = useState(false);
    const [searchData, setSearchData] = useState(null);
    const [showAllGroups, setShowAllGroups] = useState(false);
    const { alert, showSuccess, showError, hideAlert } = useMyAlert();

    //if user is not loaded yet, redirect to login
    useEffect(() => {
        if (!isLoading && !currentUser) {
            navigate('/login');
            return;
        }
    }, [currentUser, isLoading, navigate]);

    function fetchGroups(showAll = false) {
        //if showAll is true, fetch all groups
        //else fetch all groups the user is a member 
        const data = showAll ? {} : { userId: currentUser?.id }

        //fetch all user's groups from the server
        axios.get('http://localhost:3001/api/groups/list', {
            params: data
        })
            .then(res => {
                console.log('Groups response:', res.data);
                setGroups(res.data.groups);
            })
            .catch(err => {
                console.error('Groups error:', err);
            })
    }

    function handleShowAllGroups() {
        setShowAllGroups(true);
        fetchGroups(true);
    }

    function handleShowMyGroups() {
        setShowAllGroups(false);
        fetchGroups(false);
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

    function handleJoinGroup(groupId) {
        axios.post('http://localhost:3001/api/groups/join', {
            groupId: groupId,
            userId: currentUser?.id
        })
            .then(res => {
                console.log('join group response:', res.data);
                showSuccess('Successfully joined the group!');
                //refresh the groups list
                fetchGroups();
            })
            .catch(err => {
                console.error('Join group error:', err);
                showError('Failed to join group: ' + (err.message));
            })
    }

    function handleLeaveGroup(groupId) {
        axios.delete('http://localhost:3001/api/groups/leave', {
            data: {
                userId: currentUser?.id,
                groupId: groupId
            }
        })
            .then(res => {
                console.log('leave group response:', res.data);
                showSuccess('Successfully left the group!');

                //refresh the groups list
                fetchGroups();
            })
            .catch(err => {
                console.error('Leave group error:', err);
                showError('Failed to leave group: ' + (err.message));
            })
    }





    useEffect(() => {
        if (currentUser) {
            fetchGroups();
        }
    }, [currentUser])

    // Show loading while checking for stored user
    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <NavBar></NavBar>
            <SearchSideBar onSearchResults={handleSearchResults} />
            <div style={{ padding: '20px', maxWidth: '800px', marginLeft: '320px', marginRight: 'auto', marginTop: '70px' }}>
                {/*header with title and buttons */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <p style={{ margin: 0, fontSize: '24px', fontWeight: 'bold' }}>{showAllGroups ? 'All Groups:' : 'Your Groups:'}</p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        {!showAllGroups ? (
                            <MyButton
                                variant="outline-secondary"
                                onClick={handleShowAllGroups}>
                                Show All Groups
                            </MyButton>
                        ) : (
                            <MyButton
                                variant="outline-secondary"
                                onClick={handleShowMyGroups}>
                                Show My Groups
                            </MyButton>
                        )}
                        <MyButton
                            variant="primary"
                            onClick={() => setShowCreateGroup(true)}>
                            Create New Group
                        </MyButton>
                    </div>
                </div>

                <div className="row">
                    {/* map through groups and display each group */}
                    {groups.map((group) => (
                        <div key={group._id} className="col-md-4 mb-4">
                            <GroupCard
                                group={group}
                                userId={currentUser?.id}
                                onJoin={handleJoinGroup}
                                onLeave={handleLeaveGroup}
                                showAdmin={true}
                            />
                        </div>
                    ))}
                </div>

                {groups.length === 0 && (
                    <div className="text-center mt-5">
                        <p>{showAllGroups ? 'No groups found.' : 'No groups found. Join some groups to get started!'}</p>
                    </div>
                )}

                <CreateGroupForm
                    show={showCreateGroup}
                    onClose={() => setShowCreateGroup(false)}
                    userId={currentUser?.id}
                    onGroupCreated={fetchGroups}
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

export default Groups;