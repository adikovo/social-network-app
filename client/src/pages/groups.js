import React from 'react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import CreateGroupForm from '../components/createGroupForm';
import GroupCard from '../components/GroupCard';
import NavBar from '../components/navBar';
import SearchSideBar from '../components/searchSideBar';
import MyButton from '../components/myButton';
import { useUserContext } from '../context/UserContext';

function Groups() {

    //get current user from context
    const { user: currentUser, isLoading } = useUserContext();

    const navigate = useNavigate();
    const [groups, setGroups] = useState([]);
    const [showCreateGroup, setShowCreateGroup] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [searchResults, setSearchResults] = useState(null);
    const [isSearching, setIsSearching] = useState(false);

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

    function handleSearch(searchTerm) {
        const trimmed = searchTerm.trim();
        if (!trimmed) {
            //hide results section if submitting with empty input
            setSearchResults(null);
            setSearchTerm('');
            return;
        }

        setSearchTerm(trimmed);
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
        <div style={{ marginLeft: '320px', padding: '20px', maxWidth: '800px' }}>
            <NavBar></NavBar>
            <SearchSideBar />

            <p style={{ marginTop: '70px' }}>Your Groups:</p>

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
                <MyButton
                    variant="primary"
                    className="me-2"
                    onClick={() => setShowCreateGroup(true)}>
                    Create New Group
                </MyButton>
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