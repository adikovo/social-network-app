import React from 'react';
import { useNavigate } from 'react-router-dom';



//GroupCard component to display full info of a group in a card
function GroupCard({ group, userId, onJoin, onLeave, showAdmin }) {

    const navigate = useNavigate();
    const MAX_DESCRIPTION_LENGTH = 120;

    const handleCardClick = () => {
        navigate(`/group/${group._id}`);
    };

    // if description  too long
    const truncateDescription = (description) => {
        if (!description) return '';
        if (description.length <= MAX_DESCRIPTION_LENGTH) return description;
        return description.substring(0, MAX_DESCRIPTION_LENGTH) + '...';
    };

    // Style objects for cleaner code
    const cardStyles = {
        cursor: 'pointer',
        height: '280px',
        display: 'flex',
        flexDirection: 'column'
    };

    const titleStyles = {
        fontSize: '1.1rem',
        marginBottom: '12px',
        lineHeight: '1.3',
        height: '2.6rem',
        overflow: 'hidden',
        display: '-webkit-box',
        WebkitLineClamp: 2,
        WebkitBoxOrient: 'vertical'
    };

    const descriptionStyles = {
        flexGrow: 1,
        fontSize: '0.9rem',
        lineHeight: '1.4',
        color: '#666',
        marginBottom: '12px',
        height: '4.2rem',
        overflow: 'hidden',
        display: '-webkit-box',
        WebkitLineClamp: 3,
        WebkitBoxOrient: 'vertical'
    };

    return (
        <div className="card" style={cardStyles} onClick={handleCardClick}>
            <div className="card-body d-flex flex-column" style={{ height: '100%' }}>
                <h5 className="card-title" style={titleStyles}>{group.name}</h5>
                <p className="card-text" style={descriptionStyles}>{truncateDescription(group.description)}</p>
                <div className="mb-3" style={{ marginTop: 'auto' }}>
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
                <div style={{ marginTop: 'auto' }}>
                    {group.members?.includes(userId) ? (
                        <button
                            className="btn btn-secondary w-100"
                            onClick={(e) => {
                                e.stopPropagation();
                                onLeave(group._id);
                            }}>
                            Leave Group
                        </button>
                    ) : (
                        <button
                            className="btn btn-primary w-100"
                            onClick={(e) => {
                                e.stopPropagation();
                                onJoin(group._id);
                            }}>
                            Join Group
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}

export default GroupCard;


