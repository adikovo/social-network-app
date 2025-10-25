import React from 'react';
import MyButton from './myButton';
import UserInfo from './UserInfo';


//dynamic card component for displaying different types of search results
function MyCard({ type, data, onClick, button, compact = false }) {
    const itemStyle = {
        padding: '12px',
        backgroundColor: 'white',
        border: '1px solid #e5e7eb',
        borderRadius: '6px',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        marginBottom: '10px',
        maxWidth: compact ? '50%' : '100%'
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
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                            <div style={{ flex: 1 }}>
                                <UserInfo
                                    userId={data._id}
                                    userName={data.name}
                                    profilePicture={data.profilePicture}
                                    size="medium"
                                    email={data.email}
                                    roomiesCount={data.friends ? data.friends.length : 0}
                                />
                            </div>
                            {button && (
                                <div onClick={(e) => e.stopPropagation()}>
                                    {button}
                                </div>
                            )}
                        </div>
                    </>
                );

            case 'posts':
                return (
                    <>
                        <div style={{ marginBottom: '8px' }}>
                            <UserInfo
                                userId={data.authorId}
                                userName={data.authorName || data.author}
                                profilePicture={data.authorProfilePicture}
                                size="small"
                                date={new Date(data.createdAt).toLocaleDateString()}
                            />
                        </div>
                        <div style={{
                            fontWeight: '500',
                            color: '#1f2937',
                            marginBottom: '4px',
                            textAlign: 'center',
                            lineHeight: '1.4'
                        }}>
                            {data.content.length > 100 ? `${data.content.substring(0, 100)}...` : data.content}
                        </div>
                        <div style={{ fontSize: '12px', color: '#6b7280', textAlign: 'center' }}>
                            {data.likes} likes
                        </div>
                    </>
                );

            case 'groups':
                return (
                    <>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                            <div style={{ fontWeight: '500', color: '#1f2937' }}>
                                {data.name}
                            </div>
                            <MyButton
                                variant='success'
                                size='small'
                                onClick={(e) => {
                                    e.stopPropagation();
                                    // Handle join group logic here
                                    //TODO add join handler
                                    console.log('Join group:', data.name);
                                }}
                            >
                                Join
                            </MyButton>
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
            onClick={() => onClick(data)}
        >
            {renderContent()}
        </div>
    );
}

export default MyCard;
