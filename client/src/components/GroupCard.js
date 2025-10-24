import React from 'react';
import { useNavigate } from 'react-router-dom';



//GroupCard component to display full info of a group in a card
function GroupCard({ group, userId, onJoin, onLeave, showAdmin }) {

    const navigate = useNavigate();

    const handleCardClick = () => {
        navigate(`/group/${group._id}`);
    };


    return (
        <div className="card h-100" style={{ cursor: 'pointer' }} onClick={handleCardClick}>
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
                        onClick={(e) => {
                            e.stopPropagation();
                            onLeave(group._id);
                        }}>
                        Leave Group
                    </button>
                ) : (
                    <button
                        className="btn btn-primary mt-auto"
                        onClick={(e) => {
                            e.stopPropagation();
                            onJoin(group._id);
                        }}>
                        Join Group
                    </button>
                )}
            </div>
        </div>
    );
}

export default GroupCard;


