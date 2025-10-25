import React from 'react';

function GroupInfo({ group }) {
    if (!group) {
        return <div>Loading...</div>;
    }

    return (
        <>
            <p style={{ margin: '0 0 8px 0' }}><strong>Description:</strong> {group.description}</p>
            <p style={{ margin: '0 0 8px 0' }}><strong>Privacy:</strong> {group.privacy}</p>
            <p style={{ margin: '0 0 8px 0' }}><strong>Members:</strong> {group.members ? group.members.length : 0}</p>
            <p style={{ margin: '0 0 8px 0' }}><strong>Created by:</strong> {group.createdByName || 'Unknown'}</p>
        </>
    );
}

export default GroupInfo;
