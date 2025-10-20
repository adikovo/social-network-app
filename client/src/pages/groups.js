import React from 'react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import CreateGroupForm from '../components/createGroupForm';
import GroupCard from '../components/GroupCard';

function Groups() {

    //get current user's userId from url 
    const userId = useParams().userId;

    const navigate = useNavigate();
    const [groups, setGroups] = useState([]);
    const [showCreateGroup, setShowCreateGroup] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [searchResults, setSearchResults] = useState(null);
    const [isSearching, setIsSearching] = useState(false);

    function fetchGroups(showAll = false) {

        //if showAll is true, fetch all groups
        //else fetch all groups the user is a member 
        const data = showAll ? {} : { userId: userId }

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
                name: trimmed,
                createdBy: trimmed
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
                    userId: userId
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
                    userId: userId,
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
    }, [userId])


    return (
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
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
                                    userId={userId}
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
                            userId={userId}
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

            {/* Navigation buttons */}
            <div className="mt-4">
                <button
                    className="btn btn-secondary me-2"
                    onClick={() => setShowCreateGroup(true)}>
                    Create New Group
                </button>
                <button
                    className="btn btn-secondary me-2"
                    onClick={() => navigate(`/feed/${userId}`)}>
                    Back to Feed
                </button>
                <button
                    className="btn btn-outline-primary"
                    onClick={() => fetchGroups(true)}>
                    Show All Groups
                </button>

            </div>

            <CreateGroupForm
                show={showCreateGroup}
                onClose={() => setShowCreateGroup(false)}
                userId={userId}
                onGroupCreated={fetchGroups}
            />
        </div>
    )
}

export default Groups;