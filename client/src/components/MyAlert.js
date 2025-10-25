import React, { useState, useEffect } from 'react';

const MyAlert = ({
    show,
    message,
    type = 'success',
    duration = 3000,
    onClose
}) => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (show) {
            setIsVisible(true);
            const timer = setTimeout(() => {
                handleClose();
            }, duration);
            return () => clearTimeout(timer);
        }
    }, [show, duration]);

    const handleClose = () => {
        setIsVisible(false);
        setTimeout(() => {
            if (onClose) onClose();
        }, 300); // Wait for animation to complete
    };

    if (!show && !isVisible) return null;

    const getIcon = () => {
        switch (type) {
            case 'success':
                return (
                    <div style={{
                        width: '24px',
                        height: '24px',
                        backgroundColor: '#000',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0
                    }}>
                        <span style={{
                            color: '#fff',
                            fontSize: '14px',
                            fontWeight: 'bold'
                        }}>✓</span>
                    </div>
                );
            case 'error':
                return (
                    <div style={{
                        width: '24px',
                        height: '24px',
                        backgroundColor: '#dc3545',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0
                    }}>
                        <span style={{
                            color: '#fff',
                            fontSize: '14px',
                            fontWeight: 'bold'
                        }}>✕</span>
                    </div>
                );
            case 'warning':
                return (
                    <div style={{
                        width: '24px',
                        height: '24px',
                        backgroundColor: '#ffc107',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0
                    }}>
                        <span style={{
                            color: '#000',
                            fontSize: '14px',
                            fontWeight: 'bold'
                        }}>!</span>
                    </div>
                );
            case 'info':
                return (
                    <div style={{
                        width: '24px',
                        height: '24px',
                        backgroundColor: '#17a2b8',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0
                    }}>
                        <span style={{
                            color: '#fff',
                            fontSize: '14px',
                            fontWeight: 'bold'
                        }}>?</span>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div style={{
            position: 'fixed',
            top: '20px',
            right: '20px',
            zIndex: 9999,
            transform: isVisible ? 'translateX(0)' : 'translateX(100%)',
            transition: 'transform 0.3s ease-in-out',
            opacity: isVisible ? 1 : 0
        }}>
            <div style={{
                backgroundColor: '#fff',
                borderRadius: '12px',
                padding: '16px 20px',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
                border: '1px solid #e0e0e0',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                minWidth: '300px',
                maxWidth: '500px',
                fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", sans-serif'
            }}>
                {getIcon()}

                <span style={{
                    color: '#000',
                    fontSize: '16px',
                    fontWeight: '500',
                    flex: 1,
                    lineHeight: '1.4'
                }}>
                    {message}
                </span>
            </div>
        </div>
    );
};

export default MyAlert;
