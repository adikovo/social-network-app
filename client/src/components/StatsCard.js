function StatsCard({ label, value }) {
    return (
        <div style={{
            padding: '20px',
            backgroundColor: '#f8f9fa',
            borderRadius: '8px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
            <h3 style={{
                margin: 0,
                color: '#666',
                fontSize: '14px',
                textTransform: 'uppercase'
            }}>
                {label}
            </h3>
            <p style={{
                margin: '10px 0 0 0',
                fontSize: '32px',
                fontWeight: 'bold',
                color: '#333'
            }}>
                {value}
            </p>
        </div>
    );
}

export default StatsCard;
