import React from 'react';

//GroupCard component to display a group card
function GroupCard({ group, userId, onJoin, onLeave, showAdmin }) {
    return (
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
                    {showAdmin && (
                        <>
                            <br />
                            <small className="text-muted">
                                <strong>Admin:</strong> {group.createdByName || group.createdBy}
                            </small>
                        </>
                    )}
                </div>
                {group.members?.includes(userId) ? (
                    <button
                        className="btn btn-secondary me-2"
                        onClick={() => onLeave(group._id)}>
                        Leave Group
                    </button>
                ) : (
                    <button
                        className="btn btn-primary mt-auto"
                        onClick={() => onJoin(group._id)}>
                        Join Group
                    </button>
                )}
            </div>
        </div>
    );
}

export default GroupCard;


