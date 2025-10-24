import React from 'react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import CreateGroupForm from '../components/createGroupForm';
import GroupCard from '../components/GroupCard';
import NavBar from '../components/navBar';
import SearchSideBar from '../components/searchSideBar';
import { useUserContext } from '../context/UserContext';

function Groups() {

    //get current user from context
    const { user: currentUser } = useUserContext();

    const navigate = useNavigate();

    //if user is not loaded yet, redirect to login
    useEffect(() => {
        if (!currentUser) {
            navigate('/login');
            return;
        }
    }, [currentUser, navigate]);
    const [groups, setGroups] = useState([]);
    const [showCreateGroup, setShowCreateGroup] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [searchResults, setSearchResults] = useState(null);
    const [isSearching, setIsSearching] = useState(false);

    function fetchGroups(showAll = false) {

        //if showAll is true, fetch all groups
        //else fetch all groups the user is a member 
        const data = showAll ? {} : { userId: currentUser.id }

        //fetch all user's groups from the server
        axios.post('http://localhost:3001/api/groups',
            {
                command: 'list',
                data: data
            })
            .then(res => {
                console.log('Groups response:', res.data);
                setGroups(res.data.groups);
            })
            .catch(err => {
                console.error('Groups error:', err);
            })
    }

    function handleSearch(e) {

        e.preventDefault();
        const trimmed = searchTerm.trim();
        if (!trimmed) {
            //hide results section if submitting with empty input
            setSearchResults(null);
            return;
        }
        setIsSearching(true);
        axios.post('http://localhost:3001/api/groups', {
            command: 'search',
            data: {
                name: trimmed
            }
        })
            .then(res => {
                setSearchResults(res.data.groups || []);
            })
            .catch(err => {
                console.error('Group search error:', err);
                setSearchResults([]);
            })
            .finally(() => setIsSearching(false));
    }

    function handleJoinGroup(groupId) {

        axios.post('http://localhost:3001/api/groups',
            {
                command: 'joinGroup',
                data: {
                    groupId: groupId,
                    userId: currentUser.id
                }
            }
        )
            .then(res => {
                console.log('join group response:', res.data);
                alert('Successfully joined the group!');
                //refresh the groups list
                fetchGroups();
            })
            .catch(err => {
                console.error('Join group error:', err);
                alert('Failed to join group: ' + (err.message));
            })
    }

    function handleLeaveGroup(groupId) {

        axios.post('http://localhost:3001/api/groups',
            {
                command: 'leaveGroup',
                data: {
                    userId: currentUser.id,
                    groupId: groupId
                }
            }
        )
            .then(res => {
                console.log('leave group response:', res.data);
                alert('Successfully left the group!');

                //refresh the groups list
                fetchGroups();
            })
            .catch(err => {
                console.error('Leave group error:', err);
                alert('Failed to leave group: ' + (err.message));
            })
    }


    const handleEditGroup = (groupId) => {
        //TODO: Implement edit group functionality
        console.log('Edit group:', groupId);
    }


    function handleDeleteGroup(groupId) {
        //send delete request to group controller
        axios.post('http://localhost:3001/api/groups',
            {
                command: 'delete',
                data: {
                    groupId: groupId
                }
            }
        )
            .then(res => {
                console.log('delete group response:', res.data);
                alert('Group deleted successfully!');
                //refresh the groups list
                fetchGroups();
            })
            .catch(err => {
                console.error('Delete group error:', err);
                alert('Failed to delete group: ' + (err.message));
            })
    }





    useEffect(() => {
        fetchGroups();
    }, [currentUser.id])


    return (
        <div style={{ marginLeft: '320px', padding: '20px', maxWidth: '800px' }}>
            <NavBar></NavBar>
            <SearchSideBar />
            <h1>Groups</h1>
            <form onSubmit={handleSearch} className="mb-4" style={{ maxWidth: '500px', margin: '10px' }}>
                <div className="input-group">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Search groups by name..."
                        value={searchTerm}
                        onChange={(e) => {
                            const val = e.target.value;
                            setSearchTerm(val);
                            if (val.trim() === '') {
                                //clear previous results when input is cleared
                                setSearchResults(null);
                            }
                        }}
                    />
                    <button className="btn btn-primary" type="submit" disabled={isSearching}>
                        {isSearching ? 'Searching...' : 'Search'}
                    </button>
                </div>
            </form>
            {Array.isArray(searchResults) && (
                <div className="mb-4">
                    <h5>{searchTerm ? `${searchTerm} in Groups` : 'Search Results in Groups'}</h5>
                    <div className="row">
                        {searchResults.length === 0 && (
                            <div className="col-12"><p className="text-muted">No groups found.</p></div>
                        )}
                        {searchResults.map((group) => (
                            <div key={group._id} className="col-md-4 mb-4">
                                <GroupCard
                                    group={group}
                                    userId={currentUser.id}
                                    onJoin={handleJoinGroup}
                                    onLeave={handleLeaveGroup}
                                    showAdmin={false}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <p>Your Groups:</p>

            <div className="row">
                {/* map through groups and display each group */}
                {groups.map((group) => (
                    <div key={group._id} className="col-md-4 mb-4">
                        <GroupCard
                            group={group}
                            userId={currentUser.id}
                            onJoin={handleJoinGroup}
                            onLeave={handleLeaveGroup}
                            showAdmin={true}
                        />
                    </div>
                ))}
            </div>

            {groups.length === 0 && (
                <div className="text-center mt-5">
                    <p>No groups found. Join some groups to get started!</p>
                </div>
            )}

            {/*navigation buttons */}
            <div className="mt-4">
                <button
                    className="btn btn-secondary me-2"
                    onClick={() => setShowCreateGroup(true)}>
                    Create New Group
                </button>
                <button
                    className="btn btn-secondary me-2"
                    onClick={() => navigate('/feed')}>
                    Back to Feed
                </button>

            </div>

            <CreateGroupForm
                show={showCreateGroup}
                onClose={() => setShowCreateGroup(false)}
                userId={currentUser.id}
                onGroupCreated={fetchGroups}
            />
        </div>
    )
}

export default Groups;