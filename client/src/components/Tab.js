const Tab = ({ label, isActive, onClick }) => {
    return (
        <button
            onClick={onClick}
            style={{
                padding: '12px 24px',
                backgroundColor: isActive ? '#fff' : 'transparent',
                border: 'none',
                borderBottom: isActive ? '3px solid #2563eb' : 'none',
                cursor: 'pointer',
                fontSize: '16px',
                fontWeight: isActive ? 'bold' : 'normal',
                color: isActive ? '#2563eb' : '#666',
                transition: 'all 0.2s ease'
            }}
        >
            {label}
        </button>
    );
};

export default Tab;
