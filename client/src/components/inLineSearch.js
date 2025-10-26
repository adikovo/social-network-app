import React, { useState, useEffect } from 'react';
import axios from 'axios';

function InLineSearch({
    placeholder = "Search conversations...",
    conversations = [],
    onSearchResults,
    currentUserId,
    searchMode = 'conversations',
    onFriendResults,
    userFriends = [],
    onLoadingChange
}) {
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredFriends, setFilteredFriends] = useState([]);
    const [friendsWithDetails, setFriendsWithDetails] = useState([]);
    const [isLoadingFriends, setIsLoadingFriends] = useState(false);

    //filter conversations based on search term and pass results to parent
    useEffect(() => {
        if (searchMode === 'conversations') {
            if (searchTerm.trim() === "") {
                if (onSearchResults) {
                    onSearchResults(conversations);
                }
            } else {
                const filtered = conversations.filter(conv =>
                    conv.name.toLowerCase().includes(searchTerm.toLowerCase())
                );
                if (onSearchResults) {
                    onSearchResults(filtered);
                }
            }
        }
    }, [conversations, searchTerm, searchMode]);

    //filter friends when in friends mode and pass results to parent
    useEffect(() => {
        if (searchMode === 'friends') {
            if (searchTerm.trim() === "") {
                const validFriends = friendsWithDetails.filter(friend => friend.name);
                setFilteredFriends(validFriends);
                if (onFriendResults) {
                    onFriendResults(validFriends);
                }
            } else {
                const filtered = friendsWithDetails.filter(friend =>
                    friend.name && friend.name.toLowerCase().includes(searchTerm.toLowerCase())
                );
                setFilteredFriends(filtered);
                if (onFriendResults) {
                    onFriendResults(filtered);
                }
            }
        }
    }, [friendsWithDetails, searchTerm, searchMode]);

    //load friends when switching to friends mode
    useEffect(() => {
        if (searchMode === 'friends' && userFriends.length > 0) {
            console.log('All friends from user context:', userFriends);
            // Check if friends are just IDs or full objects
            if (typeof userFriends[0] === 'string') {
                // Friends are just IDs, need to fetch details
                fetchFriendsDetails(userFriends);
            } else {
                // Friends are already objects with details
                const validFriends = userFriends.filter(friend => friend.name);
                console.log('Valid friends (with names):', validFriends);
                setFriendsWithDetails(validFriends);
                setFilteredFriends(validFriends);
                if (onFriendResults) {
                    onFriendResults(validFriends);
                }
            }
        }
    }, [searchMode, userFriends]);

    const fetchFriendsDetails = async (friendIds) => {
        setIsLoadingFriends(true);
        if (onLoadingChange) {
            onLoadingChange(true);
        }
        try {
            const friendsPromises = friendIds.map(async (friendId) => {
                const response = await axios.get(`http://localhost:3001/api/users/${friendId}`);
                return response.data.success ? response.data.user : null;
            });

            const friends = await Promise.all(friendsPromises);
            const validFriends = friends.filter(friend => friend && friend.name);

            console.log('Fetched friends with details:', validFriends);
            setFriendsWithDetails(validFriends);
            setFilteredFriends(validFriends);
            if (onFriendResults) {
                onFriendResults(validFriends);
            }
        } catch (error) {
            console.error('Error fetching friends details:', error);
        } finally {
            setIsLoadingFriends(false);
            if (onLoadingChange) {
                onLoadingChange(false);
            }
        }
    };

    const handleSearch = (term) => {
        setSearchTerm(term);
    };

    const getPlaceholder = () => {
        switch (searchMode) {
            case 'friends':
                return 'Search friends...';
            case 'conversations':
            default:
                return placeholder;
        }
    };

    return (
        <div>
            {/* search input */}
            <div style={{ position: 'relative', marginBottom: '16px' }}>
                <svg
                    style={{
                        position: 'absolute',
                        left: '12px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        width: '16px',
                        height: '16px',
                        color: '#6b7280'
                    }}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <circle cx="11" cy="11" r="8"></circle>
                    <path d="m21 21-4.35-4.35"></path>
                </svg>
                <input
                    type="text"
                    placeholder={getPlaceholder()}
                    value={searchTerm}
                    onChange={(e) => handleSearch(e.target.value)}
                    style={{
                        width: '100%',
                        padding: '12px 16px 12px 40px',
                        border: '1px solid #d1d5db',
                        borderRadius: '8px',
                        fontSize: '14px',
                        outline: 'none',
                        backgroundColor: 'white',
                        transition: 'border-color 0.2s ease'
                    }}
                    onFocus={(e) => {
                        e.target.style.borderColor = '#3b82f6';
                    }}
                    onBlur={(e) => {
                        e.target.style.borderColor = '#d1d5db';
                    }}
                />
            </div>
        </div>
    );
}

export default InLineSearch;
