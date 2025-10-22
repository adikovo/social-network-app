import React from 'react';
import { useState } from 'react';
import axios from 'axios';
import SearchForm from './searchForm';
import SearchResults from './searchResults';


function SearchSideBar() {

    const [searchResults, setSearchResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    const getSearchType = () => {
        const path = window.location.pathname;

        if (path.includes('/feed/')) {
            return {
                type: 'posts',
                fields: ['content', 'author', 'date', 'group'],
                placeholder: 'Search posts...'
            };
        } else if (path.includes('/groups/')) {
            return {
                type: 'groups',
                fields: ['name', 'description', 'createdBy'],
                placeholder: 'Search groups...'
            };
        } else {
            return {
                type: 'users',
                fields: ['name', 'email', ''],
                placeholder: 'Search users...'
            }
        }
    }

    const searchType = getSearchType();

    const handleSearch = async (searchData) => {
        setSearchTerm(searchData.term);
        setIsSearching(true);

        try {
            const res = await axios.post(`http://localhost:3001/api/${searchData.type}`, {
                command: 'search',
                data: {
                    [searchData.field]: searchData.term
                }
            });
            setSearchResults(res.data[searchData.type]);
        }
        catch (error) {
            console.error('search error:', error);
            setSearchResults([]);
        } finally {
            setIsSearching(false);
        }
    };

    //click handlers for different result types
    const handleUserClick = (user) => {
        console.log('User clicked:', user);
        // Navigate to user profile or perform other actions
    };

    const handlePostClick = (post) => {
        console.log('Post clicked:', post);
        // Navigate to post details or perform other actions
    };

    const handleGroupClick = (group) => {
        console.log('Group clicked:', group);
        // Navigate to group details or perform other actions
    };

    return (
        <div style={{
            position: 'fixed',
            left: 0,
            top: '0',
            width: '300px',
            height: '100vh',
            backgroundColor: '#f8f9fa',
            borderRight: '1px solid #e5e7eb',
            padding: '100px 20px 20px 20px', // Top padding to account for navbar
            overflowY: 'auto',
            zIndex: 50
        }}>
            <h5 style={{ marginBottom: '20px', color: '#1f2937' }}>Search</h5>

            {/*search form */}
            <SearchForm
                searchType={searchType.type}
                searchFields={searchType.fields}
                placeholder={searchType.placeholder}
                onSearch={handleSearch}
                isSearching={isSearching}
            />

            {/*search results */}
            <SearchResults
                searchType={searchType.type}
                results={searchResults}
                onUserClick={handleUserClick}
                onPostClick={handlePostClick}
                onGroupClick={handleGroupClick}
                searchTerm={searchTerm}
            />

            {searchTerm && searchResults.length === 0 && !isSearching && (
                <div style={{ textAlign: 'center', color: '#6b7280', marginTop: '20px' }}>
                    No results found for "{searchTerm}"
                </div>
            )}
        </div>
    );
}

export default SearchSideBar;