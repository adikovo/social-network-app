import React, { useState, useEffect } from 'react';
import axios from 'axios';
import MyAlert from './MyAlert';
import useMyAlert from '../hooks/useMyAlert';

function CreateGroupForm({ show, onClose, userId, onGroupCreated, editMode = false, groupToEdit = null }) {

    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [privacy, setPrivacy] = useState('public');
    const { alert, showSuccess, showError, hideAlert } = useMyAlert();

    // form with existing group data when editing
    useEffect(() => {
        if (editMode && groupToEdit) {
            setName(groupToEdit.name || '');
            setDescription(groupToEdit.description || '');
            setPrivacy(groupToEdit.privacy || 'public');
        } else {
            // Reset form for create mode
            setName('');
            setDescription('');
            setPrivacy('public');
        }
    }, [editMode, groupToEdit]);

    function handleSubmit(event) {
        event.preventDefault();

        if (editMode) {
            //edit existing group
            const groupData = {
                groupId: groupToEdit._id,
                newName: name,
                newDescription: description,
                newPrivacy: privacy,
                userId: userId
            };

            axios.post('http://localhost:3001/api/groups/update', groupData)
                .then(res => {
                    console.log('Update group response:', res.data);
                    showSuccess('Group updated successfully!');
                    onClose();
                    onGroupCreated();
                })
                .catch(err => {
                    console.error('Update group error:', err);
                    showError('Failed to update group: ' + (err.response?.data?.message || err.message));
                });
        } else {
            // Create new group
            const groupData = {
                name: name,
                description: description,
                members: [userId],
                createdBy: userId,
                privacy: privacy,
                posts: []
            };

            axios.post('http://localhost:3001/api/groups/create', groupData)
                .then(res => {
                    console.log('Create group response:', res.data);
                    showSuccess('Group created successfully!');
                    onClose();
                    onGroupCreated();
                })
                .catch(err => {
                    console.error('Create group error:', err);
                    showError('Failed to create group: ' + (err.response?.data?.message || err.message));
                });
        }
    }

    if (!show) return null;

    return (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">{editMode ? 'Edit Group' : 'Create New Group'}</h5>
                        <button
                            type="button"
                            className="btn-close"
                            onClick={onClose}
                        ></button>
                    </div>
                    <form onSubmit={handleSubmit}>
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
                                    maxLength="100"
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
                                    maxLength="1000"
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
                                {editMode ? 'Save Changes' : 'Create Group'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            {/* MyAlert Component */}
            <MyAlert
                show={alert.show}
                message={alert.message}
                type={alert.type}
                duration={alert.duration}
                onClose={hideAlert}
            />
        </div>
    );
}

export default CreateGroupForm;