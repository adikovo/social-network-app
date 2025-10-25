import React from 'react';
import MyButton from './myButton';
import { useState } from 'react';

function SearchForm({
    searchType,
    onSearch,
    isSearching,
    placeholder,
    searchFields
}) {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedField, setSelectedField] = useState(searchFields[0]);

    function handleSearch(e) {
        e.preventDefault();
        if (searchTerm.trim()) {
            //call the onSearch function with the search fields
            onSearch({
                //searchData passed to searchSideBar
                term: searchTerm.trim(),
                field: selectedField,
                type: searchType
            });
        }
    }


    return (
        <form onSubmit={handleSearch} style={{ marginBottom: '20px' }}>
            {/*field select */}
            {searchFields.length > 1 && (
                <div style={{ marginBottom: '10px' }}>
                    <label htmlFor="searchField" style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
                        Search by:
                    </label>
                    <select
                        id="searchField"
                        value={selectedField}
                        onChange={(e) => setSelectedField(e.target.value)}
                        style={{
                            width: '100%',
                            padding: '8px 12px',
                            border: '1px solid #d1d5db',
                            borderRadius: '6px',
                            fontSize: '14px',
                        }}
                    >
                        {searchFields.map(field => (
                            <option key={field} value={field}>
                                {field.charAt(0).toUpperCase() + field.slice(1)}
                            </option>
                        ))}
                    </select>
                </div>
            )}

            {/*search input*/}
            <div style={{ marginBottom: '10px' }}>
                <label htmlFor="searchInput" style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
                    Search {searchType} by {selectedField}
                </label>
                <input
                    id="searchInput"
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder={placeholder || `Enter ${searchType}...`}
                    style={{
                        width: '100%',
                        padding: '8px 12px',
                        border: '1px solid #d1d5db',
                        borderRadius: '6px',
                        fontSize: '14px',
                    }}
                />
            </div>
            <MyButton variant='primary' type='submit' disabled={isSearching}>
                {isSearching ? 'Searching...' : 'Search'}
            </MyButton>

        </form>
    )
}

export default SearchForm;