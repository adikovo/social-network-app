import React from 'react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

function Groups() {

    //get current user's userId from url 
    const userId = useParams().userId;

    const navigate = useNavigate();
    const [groups, setGroups] = useState([]);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [privacy, setPrivacy] = useState('public');
    const [createdBy, setCreatedBy] = useState('');
    const [members, setMembers] = useState([]);
    const [posts, setPosts] = useState([]);

    function fetchGroups(showAll = false) {

        //if showAll is true, fetch all groups
        //else fetch all groups the user is a member 
        const data = showAll ? {} : { userId: userId }

        //fetch all user's groups from the server
        axios.post('http://localhost:3001/api/groups',
            { command: 'list', data: data })
            .then(res => {
                console.log('Groups response:', res.data);
                setGroups(res.data.groups);
            })
            .catch(err => {
                console.error('Groups error:', err);
            })
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

    useEffect(() => {
        fetchGroups();
    }, [userId])


    return (
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
            <h1>Groups</h1>
            <p>Discover and join groups that interest you!</p>

            <div className="row">
                {groups.map((group) => (
                    <div key={group._id} className="col-md-4 mb-4">
                        <div className="card h-100">
                            <div className="card-body d-flex flex-column">
                                <h5 className="card-title">{group.name}</h5>
                                <p className="card-text flex-grow-1">{group.description}</p>

                                <div className="mb-3">
                                    <small className="text-muted">
                                        <strong>Members:</strong> {group.members ? group.members.length : 0}
                                    </small>
                                    <br />
                                    <small className="text-muted">
                                        <strong>Privacy:</strong> {group.privacy}
                                    </small>
                                    <br />
                                    <small className="text-muted">
                                        <strong>Created by:</strong> {group.createdBy}
                                    </small>
                                </div>

                                <button
                                    className="btn btn-primary mt-auto"
                                    onClick={() => handleJoinGroup(group._id)}
                                >
                                    Join Group
                                </button>
                            </div>
                        </div>
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
                    onClick={() => navigate(`/feed/${userId}`)}
                >
                    Back to Feed
                </button>
                <button
                    className="btn btn-outline-primary"
                    onClick={() => fetchGroups(true)}
                >
                    Show All Groups
                </button>
            </div>
        </div>
    )
}

export default Groups;