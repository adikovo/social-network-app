import React from 'react';
import MyButton from './MyButton';
import FormField from './FormField';
import { useState } from 'react';

function MultiSearchForm({
    searchType,
    onSearch,
    isSearching,
    onClear,
    fields
}) {
    //initialize state dynamically based on fields
    const initialState = fields.reduce((acc, field) => {
        acc[field.id] = '';
        return acc;
    }, {});

    const [searchData, setSearchData] = useState(initialState);

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
        setSearchData(initialState);
        if (onClear) {
            onClear();
        }
    }

    const hasAnyInput = Object.values(searchData).some(value => value.trim() !== '');

    return (
        <form onSubmit={handleSearch} style={{ marginBottom: '20px' }}>
            {/* Dynamic Form Fields */}
            {fields.map((field, index) => (
                <FormField
                    key={field.id}
                    id={field.id}
                    label={field.label}
                    type={field.type}
                    value={searchData[field.id]}
                    onChange={(value) => handleInputChange(field.id, value)}
                    placeholder={field.placeholder}
                    options={field.options}
                    isEditing={true}
                    style={{ marginBottom: index === fields.length - 1 ? '15px' : '12px' }}
                />
            ))}

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
