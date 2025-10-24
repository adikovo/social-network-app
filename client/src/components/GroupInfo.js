import React from 'react';

function GroupInfo({ group }) {
    if (!group) {
        return <div>Loading...</div>;
    }

    return (
        <>
            <p><strong>Description:</strong> {group.description}</p>
            <p><strong>Privacy:</strong> {group.privacy}</p>
            <p><strong>Members:</strong> {group.members ? group.members.length : 0}</p>
            <p><strong>Created by:</strong> {group.createdByName || 'Unknown'}</p>
        </>
    );
}

export default GroupInfo;
