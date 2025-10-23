import React from 'react';

function DropdownMenu({
    isOpen,
    onClose,
    children,
    position = 'right', // 'right' or 'left'
    width = '160px',
    maxHeight = '300px'
}) {
    if (!isOpen) return null;

    const dropdownStyle = {
        position: 'absolute',
        top: '100%',
        [position]: 0,
        marginTop: '0.5rem',
        backgroundColor: 'white',
        border: '1px solid #e5e7eb',
        borderRadius: '0.5rem',
        boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
        minWidth: width,
        maxHeight: maxHeight,
        overflowY: 'auto',
        zIndex: 101
    };

    return (
        <div style={dropdownStyle}>
            {children}
        </div>
    );
}

export default DropdownMenu;
