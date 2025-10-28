import React, { useState } from 'react';
import SearchForm from './SearchForm';
import MultiSearchForm from './MultiSearchForm';
import { useNavigate } from 'react-router-dom';


function SearchSideBar({ onSearchResults }) {

    const navigate = useNavigate()

    const getSearchType = () => {
        const path = window.location.pathname;

        if (path === '/feed') {
            return {
                type: 'posts',
                fields: ['content', 'author', 'date', 'group'],
                placeholder: 'Search posts...',
                title: 'Search Posts',
                multiSearchFields: [
                    { id: 'content', label: 'Content', type: 'text', placeholder: 'Search in post content...' },
                    { id: 'author', label: 'Author', type: 'text', placeholder: 'Search by author name...' },
                    { id: 'group', label: 'Group', type: 'text', placeholder: 'Search by group name...' },
                    { id: 'fromDate', label: 'From Date', type: 'date' },
                    { id: 'toDate', label: 'To Date', type: 'date' }
                ]
            };
        } else if (path.startsWith('/group/')) {
            const groupId = path.split('/')[2];

            return {
                type: 'posts',
                fields: ['content', 'author', 'date'],
                placeholder: 'Search posts in this group...',
                title: 'Search Group Posts',
                multiSearchFields: [
                    { id: 'content', label: 'Content', type: 'text', placeholder: 'Search in post content...' },
                    { id: 'author', label: 'Author', type: 'text', placeholder: 'Search by author name...' },
                    { id: 'fromDate', label: 'From Date', type: 'date' },
                    { id: 'toDate', label: 'To Date', type: 'date' }
                ],
                groupId: groupId
            };
        } else if (path === '/groups') {
            return {
                type: 'groups',
                fields: ['name', 'description', 'createdBy'],
                placeholder: 'Search groups...',
                title: 'Search Groups',
                multiSearchFields: [
                    { id: 'name', label: 'Name', type: 'text', placeholder: 'Search by group name...' },
                    { id: 'description', label: 'Description', type: 'text', placeholder: 'Search by description...' },
                    { id: 'createdBy', label: 'Created By', type: 'text', placeholder: 'Search by creator name...' }
                ]
            };
        } else {
            return {
                type: 'users',
                fields: ['name', 'age', 'pets', 'budget', 'location', 'smoking', 'cleanliness'],
                placeholder: 'Search users...',
                title: 'Search Users',
                multiSearchFields: [
                    { id: 'name', label: 'Name', type: 'text', placeholder: 'Search by name...' },
                    { id: 'age', label: 'Age', type: 'text', placeholder: 'Search by age...' },
                    { id: 'location', label: 'Location', type: 'text', placeholder: 'Search by location...' },
                    { id: 'budget', label: 'Budget', type: 'text', placeholder: 'Search by budget...' },
                    {
                        id: 'pets',
                        label: 'Pets',
                        type: 'select',
                        options: [
                            { value: 'yes', label: 'Yes, I have pets' },
                            { value: 'no', label: 'No pets' },
                            { value: 'allergic', label: 'Allergic to pets' }
                        ]
                    },
                    {
                        id: 'cleanliness',
                        label: 'Cleanliness',
                        type: 'select',
                        options: [
                            { value: 'very clean', label: 'Very Clean' },
                            { value: 'clean', label: 'Clean' },
                            { value: 'average', label: 'Average' },
                            { value: 'messy', label: 'Messy' }
                        ]
                    },
                    {
                        id: 'smoking',
                        label: 'Smoking',
                        type: 'select',
                        options: [
                            { value: 'yes', label: 'Yes' },
                            { value: 'no', label: 'No' },
                            { value: 'occasionally', label: 'Occasionally' }
                        ]
                    }
                ]
            }
        }
    }

    const searchType = getSearchType();

    const handleSearch = async (searchData) => {
        //call the parent components search handler to show overlay
        if (onSearchResults) {
            // Add groupId to searchData if we're in a group context
            const searchDataWithGroup = {
                ...searchData,
                groupId: searchType.groupId
            };
            onSearchResults(searchDataWithGroup);
        }
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
            padding: '100px 20px 20px 20px',
            overflowY: 'auto',
            zIndex: 50
        }}>
            <h5 style={{ marginBottom: '20px', color: '#1f2937' }}>{searchType.title}</h5>

            {/*search form */}
            {searchType.type === 'posts' || searchType.type === 'users' ? (
                <MultiSearchForm
                    searchType={searchType.type}
                    onSearch={handleSearch}
                    isSearching={false}
                    onClear={() => { }}
                    fields={searchType.multiSearchFields || []}
                />
            ) : (
                <SearchForm
                    searchType={searchType.type}
                    searchFields={searchType.fields}
                    placeholder={searchType.placeholder}
                    onSearch={handleSearch}
                    isSearching={false}
                />
            )}
        </div>
    );
}

export default SearchSideBar;