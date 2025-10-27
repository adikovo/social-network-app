import React from 'react';
import MyCard from './MyCard';


function SearchResults({
    //what type of search is being performed
    searchType,
    //results array
    results,
    //callbacks for click on results
    onUserClick,
    onPostClick,
    onGroupClick,
    //the search term for display
    searchTerm
}) {

    const renderResults = () => {
        return results.map((item) => {
            //get the click handler based on search type
            const getClickHandler = () => {
                switch (searchType) {
                    case 'users': return onUserClick;
                    case 'posts': return onPostClick;
                    case 'groups': return onGroupClick;
                    default: return null;
                }
            };

            return (
                <MyCard
                    key={item._id}
                    type={searchType}
                    data={item}
                    onClick={getClickHandler()}
                />
            );
        });
    };

    if (!results || results.length === 0) {
        return null;
    }

    return (
        <div>
            <h4 style={{ marginBottom: '15px', color: '#374151' }}>
                Results ({results.length})
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {renderResults()}
            </div>
        </div>
    );
}

export default SearchResults;
