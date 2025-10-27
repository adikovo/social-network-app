import React from 'react';
import MyButton from './MyButton';
import FormField from './FormField';
import { useState } from 'react';

function MultiSearchForm({
    searchType,
    onSearch,
    isSearching,
    onClear
}) {
    const [searchData, setSearchData] = useState({
        content: '',
        author: '',
        group: '',
        fromDate: '',
        toDate: ''
    });

    function handleInputChange(field, value) {
        setSearchData(prev => ({
            ...prev,
            [field]: value
        }));
    }

    function handleSearch(e) {
        e.preventDefault();

        // Filter out empty fields
        const filledFields = Object.entries(searchData)
            .filter(([key, value]) => value.trim() !== '')
            .reduce((acc, [key, value]) => {
                acc[key] = value.trim();
                return acc;
            }, {});

        if (Object.keys(filledFields).length > 0) {
            onSearch({
                term: '', // Not used in multi-parameter search
                field: '', // Not used in multi-parameter search
                type: searchType,
                data: filledFields // Pass all filled fields
            });
        }
    }

    function handleClear() {
        setSearchData({
            content: '',
            author: '',
            group: '',
            fromDate: '',
            toDate: ''
        });

        if (onClear) {
            onClear();
        }
    }

    const hasAnyInput = Object.values(searchData).some(value => value.trim() !== '');

    return (
        <form onSubmit={handleSearch} style={{ marginBottom: '20px' }}>
            {/* Content Input */}
            <FormField
                id="contentInput"
                label="Content"
                type="text"
                value={searchData.content}
                onChange={(value) => handleInputChange('content', value)}
                placeholder="Search in post content..."
                isEditing={true}
                style={{ marginBottom: '12px' }}
            />

            {/* Author Input */}
            <FormField
                id="authorInput"
                label="Author"
                type="text"
                value={searchData.author}
                onChange={(value) => handleInputChange('author', value)}
                placeholder="Search by author name..."
                isEditing={true}
                style={{ marginBottom: '12px' }}
            />

            {/* Group Input */}
            <FormField
                id="groupInput"
                label="Group"
                type="text"
                value={searchData.group}
                onChange={(value) => handleInputChange('group', value)}
                placeholder="Search by group name..."
                isEditing={true}
                style={{ marginBottom: '12px' }}
            />

            {/* From Date Input */}
            <FormField
                id="fromDateInput"
                label="From Date"
                type="date"
                value={searchData.fromDate}
                onChange={(value) => handleInputChange('fromDate', value)}
                isEditing={true}
                style={{ marginBottom: '12px' }}
            />

            {/* To Date Input */}
            <FormField
                id="toDateInput"
                label="To Date"
                type="date"
                value={searchData.toDate}
                onChange={(value) => handleInputChange('toDate', value)}
                isEditing={true}
                style={{ marginBottom: '15px' }}
            />

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: '10px' }}>
                <MyButton
                    variant='primary'
                    type='submit'
                    disabled={isSearching || !hasAnyInput}
                    style={{ flex: 1 }}
                >
                    {isSearching ? 'Searching...' : 'Search'}
                </MyButton>

                {hasAnyInput && (
                    <MyButton
                        variant='secondary'
                        type='button'
                        onClick={handleClear}
                        style={{ flex: 1 }}
                    >
                        Clear
                    </MyButton>
                )}
            </div>

        </form>
    );
}

export default MultiSearchForm;
