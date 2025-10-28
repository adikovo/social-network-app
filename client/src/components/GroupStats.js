import React, { useState } from 'react';
import MyButton from './MyButton';
import StatsCard from './StatsCard';
import Tab from './Tab';
import TopContributorsChart from './TopContributorsChart';
import MemberJoinTimelineChart from './MemberJoinTimelineChart';

function GroupStats({ groupStats, onBack }) {
    const [activeTab, setActiveTab] = useState('contributors');

    return (
        <div style={{ marginTop: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
                <MyButton
                    variant='secondary'
                    onClick={onBack}
                    style={{ marginRight: '15px' }}
                >
                    ← Back to Feed
                </MyButton>
            </div>

            {/*stats content with charts */}
            {groupStats ? (
                <div>
                    {/*summary cards */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '30px' }}>
                        <StatsCard label="Total Posts" value={groupStats.totalPosts} />
                        <StatsCard label="Total Members" value={groupStats.totalMembers} />
                        <StatsCard label="Active Contributors" value={groupStats.topContributors.length} />
                    </div>

                    {/*tabs for different charts */}
                    <div style={{ marginBottom: '20px' }}>
                        <div style={{ display: 'flex', borderBottom: '2px solid #e5e7eb' }}>
                            <Tab
                                label="Top Contributors"
                                isActive={activeTab === 'contributors'}
                                onClick={() => setActiveTab('contributors')}
                            />
                            <Tab
                                label="Member Join Timeline"
                                isActive={activeTab === 'timeline'}
                                onClick={() => setActiveTab('timeline')}
                            />
                        </div>
                    </div>

                    {/*chart content based on active tab */}
                    {activeTab === 'contributors' ? (
                        groupStats.topContributors && groupStats.topContributors.length > 0 ? (
                            <TopContributorsChart data={groupStats.topContributors} />
                        ) : (
                            <div style={{ padding: '40px', textAlign: 'center', color: '#666', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
                                <p>No contributors data available yet. Posts will appear here as members create content.</p>
                            </div>
                        )
                    ) : (
                        groupStats.memberJoinTimeline && groupStats.memberJoinTimeline.length > 0 ? (
                            <MemberJoinTimelineChart data={groupStats.memberJoinTimeline} />
                        ) : (
                            <div style={{ padding: '40px', textAlign: 'center', color: '#666', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
                                <p>No join data available yet.</p>
                            </div>
                        )
                    )}
                </div>
            ) : (
                <div style={{ padding: '40px', textAlign: 'center', color: '#666' }}>
                    <p>Loading statistics...</p>
                </div>
            )}
        </div>
    );
}

export default GroupStats;
