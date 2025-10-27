import React from 'react';

function SelectField({
    id,
    label,
    value,
    onChange,
    isEditing,
    options = [],
    placeholder = "Select...",
    className = '',
    style = {},
    showAnyOption = false,
    anyOptionText = "Any"
}) {
    const selectStyle = {
        borderRadius: '8px',
        textAlign: 'left',
        fontSize: '0.9rem',
        padding: '0.5rem',
        width: '100%',
        border: '1px solid #d1d5db',
        ...style
    };

    const renderSelect = () => {
        if (!isEditing) {
            return (
                <div className="form-control-plaintext p-2 bg-light rounded" style={selectStyle}>
                    <span style={{ color: '#212529', fontWeight: '500' }}>
                        {value || 'Not specified'}
                    </span>
                </div>
            );
        }

        return (
            <select
                className="form-select"
                id={id}
                value={value || ''}
                onChange={(e) => onChange(e.target.value)}
                style={selectStyle}
            >
                <option value="">{placeholder}</option>
                {showAnyOption && <option value="">{anyOptionText}</option>}
                {options.map(option => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
        );
    };

    return (
        <div className={`mb-2 ${className}`}>
            <label htmlFor={id} className="form-label" style={{
                color: '#212529',
                fontWeight: '600',
                textAlign: 'left',
                display: 'block',
                fontSize: '0.9rem'
            }}>
                {label}
            </label>
            {renderSelect()}
        </div>
    );
}

export default SelectField;
