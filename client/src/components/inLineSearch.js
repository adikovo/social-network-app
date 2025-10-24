import React, { useState } from 'react';
import MyButton from './myButton';

function InLineSearch({
    placeholder = "Search...",
    onSearch,
    searchResults = null,
    searchTerm = "",
    isSearching = false,
    renderResults = null,
    showResults = true
}) {
    const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (onSearch) {
            onSearch(localSearchTerm);
        }
    };

    const handleInputChange = (e) => {
        const val = e.target.value;
        setLocalSearchTerm(val);

        // Clear results when input is cleared
        if (val.trim() === '' && onSearch) {
            onSearch('');
        }
    };

    return (
        <div>
            <form onSubmit={handleSubmit} className="mb-4" style={{ maxWidth: '500px', margin: '10px' }}>
                <div className="input-group">
                    <input
                        type="text"
                        className="form-control"
                        placeholder={placeholder}
                        value={localSearchTerm}
                        onChange={handleInputChange}
                    />
                    <MyButton variant="primary" type="submit" disabled={isSearching}>
                        {isSearching ? 'Searching...' : 'Search'}
                    </MyButton>
                </div>
            </form>

            {showResults && Array.isArray(searchResults) && (
                <div className="mb-4">
                    <h5>{localSearchTerm ? `${localSearchTerm} in Results` : 'Search Results'}</h5>
                    <div className="row">
                        {searchResults.length === 0 && (
                            <div className="col-12"><p className="text-muted">No results found.</p></div>
                        )}
                        {searchResults.length > 0 && renderResults && renderResults(searchResults)}
                    </div>
                </div>
            )}
        </div>
    );
}

export default InLineSearch;
