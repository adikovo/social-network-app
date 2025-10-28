function StatsCard({ label, value }) {
    return (
        <div style={{
            padding: '20px',
            backgroundColor: '#8B5CF6',
            borderRadius: '8px',
            boxShadow: '0 2px 4px rgba(139, 92, 246, 0.2)',
            border: '1px solid #7C3AED'
        }}>
            <h3 style={{
                margin: 0,
                color: 'white',
                fontSize: '14px',
                textTransform: 'uppercase',
                fontWeight: '600'
            }}>
                {label}
            </h3>
            <p style={{
                margin: '10px 0 0 0',
                fontSize: '32px',
                fontWeight: 'bold',
                color: 'white'
            }}>
                {value}
            </p>
        </div>
    );
}

export default StatsCard;
