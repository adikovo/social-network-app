import React from 'react';

function MyCard({ type, data, onClick }) {
    const itemStyle = {
        padding: '12px',
        backgroundColor: 'white',
        border: '1px solid #e5e7eb',
        borderRadius: '6px',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        marginBottom: '10px'
    };

    const handleMouseEnter = (e) => {
        e.target.style.backgroundColor = '#f3f4f6';
    };

    const handleMouseLeave = (e) => {
        e.target.style.backgroundColor = 'white';
    };

    //render content based on type
    const renderContent = () => {
        switch (type) {
            case 'users':
                return (
                    <>
                        <div style={{ fontWeight: '500', color: '#1f2937' }}>
                            {data.name}
                        </div>
                        <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '2px' }}>
                            {data.email}
                        </div>
                        <div style={{ fontSize: '12px', color: '#6b7280' }}>
                            Roomies: {data.friends.length}
                        </div>
                    </>
                );

            case 'posts':
                return (
                    <>
                        <div style={{ fontWeight: '500', color: '#1f2937', marginBottom: '4px' }}>
                            {data.content.length > 100 ? `${data.content.substring(0, 100)}...` : data.content}
                        </div>
                        <div style={{ fontSize: '12px', color: '#6b7280' }}>
                            By: {data.author}
                        </div>
                        <div style={{ fontSize: '12px', color: '#6b7280' }}>
                            {new Date(data.createdAt).toLocaleDateString()} • {data.likes} likes
                        </div>
                    </>
                );

            case 'groups':
                return (
                    <>
                        <div style={{ fontWeight: '500', color: '#1f2937' }}>
                            {data.name}
                        </div>
                        <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '2px' }}>
                            {data.description}
                        </div>
                        <div style={{ fontSize: '12px', color: '#6b7280' }}>
                            {data.members ? data.members.length : 0} members • {data.privacy}
                        </div>
                    </>
                );

            default:
                return <div>Unknown type: {type}</div>;
        }
    };

    return (
        <div
            style={itemStyle}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onClick={() => onClick && onClick(data)}
        >
            {renderContent()}
        </div>
    );
}

export default MyCard;
