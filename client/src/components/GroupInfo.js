import React from 'react';

function GroupInfo({ group }) {
    if (!group) {
        return <div>Loading...</div>;
    }

    return (
        <>
            <p style={{ margin: '0 0 8px 0', textAlign: 'left' }}>
                <strong>Description:</strong>
                <span style={{ whiteSpace: 'pre-line' }}>{group.description}</span>
            </p>
            <div style={{ display: 'flex', gap: '20px' }}>
                <p style={{ margin: '0 0 8px 0' }}><strong>Privacy:</strong> {group.privacy}</p>
                <p style={{ margin: '0 0 8px 0' }}><strong>Members:</strong> {group.members ? group.members.length : 0}</p>
                <p style={{ margin: '0 0 8px 0' }}><strong>Created by:</strong> {group.createdByName || 'Unknown'}</p>
            </div>
        </>
    );
}

export default GroupInfo;
