import React from 'react';

function FormField({
    id,
    label,
    type = 'text',
    value,
    onChange,
    placeholder,
    isEditing,
    options = null,
    rows = null,
    className = '',
    style = {}
}) {
    const inputStyle = {
        width: '100%',
        padding: '8px 12px',
        border: '1px solid #d1d5db',
        borderRadius: '6px',
        fontSize: '14px',
        boxSizing: 'border-box',
        textAlign: 'left',
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
            <label htmlFor={id} style={{
                display: 'block',
                marginBottom: '5px',
                fontWeight: '500',
                fontSize: '14px',
                textAlign: 'left'
            }}>
                {label}
            </label>
            {renderInput()}
        </div>
    );
}

export default FormField;
