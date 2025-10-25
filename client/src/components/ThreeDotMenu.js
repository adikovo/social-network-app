import React, { useState, useEffect, useRef } from 'react';
import DropdownMenu from './DropdownMenu';

function ThreeDotMenu({
    menuItems = [],
    onItemClick
}) {

    const position = "right";
    const width = "140px";
    const [showDropdown, setShowDropdown] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowDropdown(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const toggleDropdown = () => {
        setShowDropdown(!showDropdown);
    };

    const handleItemClick = (item) => {
        setShowDropdown(false);
        if (onItemClick) {
            onItemClick(item);
        }
    };

    const buttonStyle = {
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        padding: '4px',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#666',
        fontSize: '20px',
        fontWeight: 'bold',
        width: '32px',
        height: '32px',
        transition: 'background-color 0.2s ease'
    };

    const defaultItemStyle = {
        width: '100%',
        padding: '8px 12px',
        border: 'none',
        background: 'none',
        textAlign: 'left',
        cursor: 'pointer',
        fontSize: '14px',
        color: '#333',
        borderBottom: '1px solid #e5e7eb'
    };

    const dangerItemStyle = {
        ...defaultItemStyle,
        color: '#dc2626',
        borderBottom: 'none'
    };

    return (
        <div ref={dropdownRef} style={{ position: 'relative' }}>
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    toggleDropdown();
                }}
                style={buttonStyle}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#f5f5f5'}
                onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                title="More options"
            >
                ⋯
            </button>

            <DropdownMenu
                isOpen={showDropdown}
                onClose={() => setShowDropdown(false)}
                position={position}
                width={width}
            >
                {menuItems.map((item, index) => (
                    <button
                        key={item.id || index}
                        onClick={() => handleItemClick(item)}
                        style={item.danger ? dangerItemStyle : defaultItemStyle}
                        onMouseEnter={(e) => e.target.style.backgroundColor = item.danger ? '#fef2f2' : '#f5f5f5'}
                        onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                    >
                        {item.label}
                    </button>
                ))}
            </DropdownMenu>
        </div>
    );
}

export default ThreeDotMenu;
