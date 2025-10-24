import React from 'react';

function FormField({
    id,
    label,
    type = 'text',
    value,
    onChange,
    placeholder,
    isEditing,
    options = null, // for select fields
    rows = null, // for textarea
    className = '',
    style = {}
}) {
    const inputStyle = {
        borderRadius: type === 'textarea' ? '10px' : '8px',
        textAlign: 'left',
        fontSize: type === 'textarea' ? '1rem' : '0.9rem',
        padding: type === 'textarea' ? '0.75rem' : '0.5rem',
        ...style
    };

    const renderInput = () => {
        if (!isEditing) {
            return (
                <div className={`form-control-plaintext p-${type === 'textarea' ? '3' : '2'} bg-light rounded`} style={inputStyle}>
                    <span style={{ color: '#212529', fontWeight: '500' }}>
                        {value || 'Not specified'}
                    </span>
                </div>
            );
        }

        if (type === 'textarea') {
            return (
                <textarea
                    className="form-control"
                    id={id}
                    rows={rows}
                    value={value || ''}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={placeholder}
                    style={{ ...inputStyle, minHeight: '100px' }}
                />
            );
        }

        if (type === 'select') {
            return (
                <select
                    className="form-select"
                    id={id}
                    value={value || ''}
                    onChange={(e) => onChange(e.target.value)}
                    style={inputStyle}
                >
                    <option value="">Select...</option>
                    {options?.map(option => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
            );
        }

        return (
            <input
                type={type}
                className="form-control"
                id={id}
                value={value || ''}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                style={inputStyle}
            />
        );
    };

    return (
        <div className={`mb-${type === 'textarea' ? '3' : '2'} ${className}`}>
            <label htmlFor={id} className="form-label" style={{
                color: '#212529',
                fontWeight: '600',
                textAlign: 'left',
                display: 'block',
                fontSize: type === 'textarea' ? '1rem' : '0.9rem'
            }}>
                {label}
            </label>
            {renderInput()}
        </div>
    );
}

export default FormField;
