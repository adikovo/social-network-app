import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SearchResults from './SearchResults';
import MyAlert from './MyAlert';
import MyButton from './MyButton';

function SearchResultsOverlay({
    isVisible,
    onClose,
    searchData,
    onUserClick,
    onGroupClick
}) {
    const [searchResults, setSearchResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchType, setSearchType] = useState('');
    const [alert, setAlert] = useState({ show: false, message: '', type: '' });

    //search when component becomes visible and searchData is provided
    useEffect(() => {
        if (isVisible && searchData) {
            performSearch(searchData);
        }
    }, [isVisible, searchData]);

    const performSearch = async (searchData) => {
        setSearchType(searchData.type);
        // For multi-parameter search, create a display string from the search parameters
        const searchTermDisplay = searchData.data ?
            Object.entries(searchData.data).map(([key, value]) => `${key}: ${value}`).join(', ') :
            searchData.field && searchData.term ?
                `${searchData.field}: ${searchData.term}` :
                searchData.term;
        setSearchTerm(searchTermDisplay);
        setIsSearching(true);

        try {
            let res;

            //use different endpoints based on search type
            if (searchData.type === 'groups') {
                //handle both SearchForm and MultiSearchForm data formats
                let searchParams;
                if (searchData.data) {
                    //multiSearchForm format
                    searchParams = searchData.data;
                } else if (searchData.field && searchData.term) {
                    //searchForm format - use the selected field
                    searchParams = { [searchData.field]: searchData.term };
                } else {
                    //fallback to name search
                    searchParams = { name: searchData.term };
                }

                res = await axios.get('http://localhost:3001/api/groups/search', {
                    params: searchParams
                });
            } else if (searchData.type === 'users') {
                //for multi-parameter search, use searchData.data, otherwise use searchData.term
                const searchParams = searchData.data ? searchData.data : { name: searchData.term };

                res = await axios.get('http://localhost:3001/api/users/search', {
                    params: searchParams
                });
            } else if (searchData.type === 'posts') {
                //for multi-parameter search, use searchData.data, otherwise use searchData.term
                const searchParams = searchData.data ? searchData.data : { content: searchData.term };

                //if searching posts and have a groupId, add it to the search
                if (searchData.groupId) {
                    searchParams.groupId = searchData.groupId;
                }

                res = await axios.get('http://localhost:3001/api/posts/search', {
                    params: searchParams
                });
            } else {
                throw new Error('Unknown search type');
            }

            setSearchResults(res.data[searchData.type] || res.data.posts || []);
        } catch (error) {
            console.error('Search error:', error);
            setSearchResults([]);
            setAlert({
                show: true,
                message: 'Error performing search. Please try again.',
                type: 'error'
            });
        } finally {
            setIsSearching(false);
        }
    };

    const handleClose = () => {
        setSearchResults([]);
        setSearchTerm('');
        setSearchType('');
        setAlert({ show: false, message: '', type: '' });
        onClose();
    };

    const getSearchTitle = () => {
        switch (searchType) {
            case 'users': return 'User Search Results';
            case 'posts': return 'Post Search Results';
            case 'groups': return 'Group Search Results';
            default: return 'Search Results';
        }
    };

    if (!isVisible) {
        return null;
    }

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
        }}>
            <div style={{
                backgroundColor: 'white',
                borderRadius: '12px',
                padding: '30px',
                maxWidth: '900px',
                width: '100%',
                maxHeight: '80vh',
                overflowY: 'auto',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
            }}>
                {/*header */}
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '20px',
                    borderBottom: '1px solid #e5e7eb',
                    paddingBottom: '15px'
                }}>
                    <div>
                        <h2 style={{ color: '#1f2937', margin: 0 }}>
                            {getSearchTitle()}
                        </h2>
                        {searchTerm && (
                            <p style={{ color: '#6b7280', fontSize: '14px', margin: '5px 0 0 0' }}>
                                Search term: "{searchTerm}"
                            </p>
                        )}
                    </div>
                    <MyButton
                        onClick={handleClose}
                        variant="close"
                        style={{
                            position: 'static',
                            top: 'auto',
                            right: 'auto',
                            color: '#6b7280',
                            fontSize: '18px',
                            width: 'auto',
                            height: 'auto',
                            padding: '2px 6px',
                            borderRadius: '4px',
                            minWidth: 'auto'
                        }}
                    >
                        ×
                    </MyButton>
                </div>

                {/*content */}
                <div>
                    {isSearching && (
                        <div style={{ textAlign: 'center', padding: '40px' }}>
                            <div style={{ color: '#6b7280' }}>Searching...</div>
                        </div>
                    )}

                    {!isSearching && searchResults && searchResults.length > 0 && (
                        <SearchResults
                            searchType={searchType}
                            results={searchResults}
                            onUserClick={(user) => {
                                onUserClick(user);
                                handleClose();
                            }}
                            onGroupClick={(group) => {
                                onGroupClick(group);
                                handleClose();
                            }}
                            searchTerm={searchTerm}
                        />
                    )}

                    {!isSearching && searchTerm && searchResults && searchResults.length === 0 && (
                        <div style={{
                            textAlign: 'center',
                            color: '#6b7280',
                            padding: '40px',
                            backgroundColor: '#f9fafb',
                            borderRadius: '8px',
                            border: '1px solid #e5e7eb'
                        }}>
                            <h3 style={{ marginBottom: '10px' }}>No results found</h3>
                            <p>No {searchType} found for "{searchTerm}"</p>
                        </div>
                    )}
                </div>

                {/*alert */}
                <MyAlert
                    show={alert.show}
                    message={alert.message}
                    type={alert.type}
                    onClose={() => setAlert({ show: false, message: '', type: '' })}
                />
            </div>
        </div>
    );
}

export default SearchResultsOverlay;
