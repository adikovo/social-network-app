import React, { useState } from 'react';
import axios from 'axios';

function CreateGroupForm({ show, onClose, userId, onGroupCreated }) {

    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [privacy, setPrivacy] = useState('public');

    function handleCreateGroup(event) {
        event.preventDefault();

        const groupData = {
            command: 'create',
            data: {
                name: name,
                description: description,
                members: [userId],
                createdBy: userId,
                privacy: privacy,
                posts: []
            }
        };

        axios.post('http://localhost:3001/api/groups', groupData)
            .then(res => {
                console.log('Create group response:', res.data);
                alert('Group created successfully!');

                //reset form
                setName('');
                setDescription('');
                setPrivacy('public');

                //close modal and refresh groups list
                onClose();
                onGroupCreated();
            })
            .catch(err => {
                console.error('Create group error:', err);
                alert('Failed to create group: ' + (err.response?.data?.message || err.message));
            });
    }

    //Don't render if show is false
    if (!show) return null;

    return (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Create New Group</h5>
                        <button
                            type="button"
                            className="btn-close"
                            onClick={onClose}
                        ></button>
                    </div>
                    <form onSubmit={handleCreateGroup}>
                        <div className="modal-body">
                            <div className="mb-3">
                                <label htmlFor="groupName" className="form-label">Group Name</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="groupName"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Enter group name"
                                    required
                                />
                            </div>

                            <div className="mb-3">
                                <label htmlFor="groupDescription" className="form-label">Description</label>
                                <textarea
                                    className="form-control"
                                    id="groupDescription"
                                    rows="3"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder="Enter group description"
                                    required
                                ></textarea>
                            </div>

                            <div className="mb-3">
                                <label htmlFor="groupPrivacy" className="form-label">Privacy</label>
                                <select
                                    className="form-select"
                                    id="groupPrivacy"
                                    value={privacy}
                                    onChange={(e) => setPrivacy(e.target.value)}
                                >
                                    <option value="public">Public</option>
                                    <option value="private">Private</option>
                                </select>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button
                                type="button"
                                className="btn btn-secondary"
                                onClick={onClose}
                            >
                                Cancel
                            </button>
                            <button type="submit" className="btn btn-primary">
                                Create Group
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default CreateGroupForm;