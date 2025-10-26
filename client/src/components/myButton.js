import React from 'react';

function MyButton({
    children,
    variant = 'primary',
    size = 'normal',
    disabled = false,
    className = '',
    onClick,
    type = 'button',
    ...props
}) {
    //base button classes
    const baseClasses = 'btn';

    const variantClasses = {
        primary: 'btn-primary',
        secondary: 'btn-secondary',
        outline: 'btn-outline-primary',
        success: 'btn-success',
        danger: 'btn-danger',
        warning: 'btn-warning',
        info: 'btn-info',
        light: 'btn-light',
        dark: 'btn-dark',
        nav: 'btn-nav',
        dropdown: 'btn-dropdown',
        icon: 'btn-icon',
        like: 'btn-like',
        comment: 'btn-comment',
        close: 'btn-close',
        navPrev: 'btn-nav-prev',
        navNext: 'btn-nav-next',
        notification: 'btn-notification',
        youtube: 'btn-youtube'
    };

    //different button sizes
    const sizeClasses = {
        small: 'btn-sm',
        normal: '',
        large: 'btn-lg'
    };


    //combine all classes together
    const allClasses = [
        baseClasses,
        variantClasses[variant] || variantClasses.primary,
        sizeClasses[size] || '',
        className
    ].filter(Boolean).join(' ');

    //shadow colors for each variant
    const shadowColors = {
        primary: 'rgb(99 102 241 / 0.5)',
        secondary: 'rgb(100 116 139 / 0.5)',
        outline: 'rgb(99 102 241 / 0.4)',
        success: 'rgb(16 185 129 / 0.5)',
        danger: 'rgb(239 68 68 / 0.5)',
        warning: 'rgb(245 158 11 / 0.5)',
        info: 'rgb(59 130 246 / 0.5)',
        light: 'rgb(148 163 184 / 0.5)',
        dark: 'rgb(15 23 42 / 0.5)',
        nav: 'rgb(107 114 128 / 0.3)',
        dropdown: 'rgb(107 114 128 / 0.2)',
        icon: 'rgb(107 114 128 / 0.2)',
        like: 'rgb(231 76 60 / 0.3)',
        comment: 'rgb(107 114 128 / 0.3)',
        close: 'rgb(255 255 255 / 0.3)',
        navPrev: 'rgb(255 255 255 / 0.3)',
        navNext: 'rgb(255 255 255 / 0.3)',
        notification: 'rgb(99 102 241 / 0.3)',
        youtube: 'rgb(255 0 0 / 0.3)'
    };

    return (
        <button
            type={type}
            className={allClasses}
            disabled={disabled}
            onClick={onClick}
            style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: size === 'small' ? '0.375rem 0.75rem' : size === 'large' ? '0.75rem 1.5rem' : '0.5rem 1rem',
                fontSize: size === 'small' ? '0.875rem' : size === 'large' ? '1.125rem' : '1rem',
                fontWeight: '500',
                lineHeight: '1',
                textDecoration: 'none',
                border: '1px solid transparent',
                borderRadius: '0.5rem',
                cursor: disabled ? 'not-allowed' : 'pointer',
                opacity: disabled ? 0.6 : 1,
                ...(variant === 'primary' && {
                    background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
                    color: 'white',
                    borderColor: '#6366f1',
                    boxShadow: '0 1px 2px 0 rgb(0 0 0 / 0.05)'
                }),
                ...(variant === 'secondary' && {
                    backgroundColor: '#f8fafc',
                    color: '#475569',
                    borderColor: '#e2e8f0',
                    boxShadow: '0 1px 2px 0 rgb(0 0 0 / 0.05)'
                }),
                ...(variant === 'outline' && {
                    backgroundColor: 'transparent',
                    color: '#6366f1',
                    borderColor: '#6366f1'
                }),
                ...(variant === 'success' && {
                    background: 'linear-gradient(135deg, #10b981, #059669)',
                    color: 'white',
                    borderColor: '#10b981',
                    boxShadow: '0 1px 2px 0 rgb(0 0 0 / 0.05)'
                }),
                ...(variant === 'danger' && {
                    background: 'linear-gradient(135deg, #ef4444, #dc2626)',
                    color: 'white',
                    borderColor: '#ef4444',
                    boxShadow: '0 1px 2px 0 rgb(0 0 0 / 0.05)'
                }),
                ...(variant === 'nav' && {
                    background: 'none',
                    color: '#374151',
                    border: 'none',
                    padding: '0.5rem',
                    borderRadius: '0.5rem',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    fontFamily: 'system-ui, -apple-system, sans-serif',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    transition: 'all 0.2s ease'
                }),
                ...(variant === 'dropdown' && {
                    background: 'none',
                    color: '#374151',
                    border: 'none',
                    padding: '0.75rem 1rem',
                    borderRadius: '0',
                    fontSize: '0.875rem',
                    fontWeight: '400',
                    fontFamily: 'system-ui, -apple-system, sans-serif',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'flex-start',
                    gap: '0.75rem',
                    width: '100%',
                    textAlign: 'left',
                    transition: 'background-color 0.2s ease'
                }),
                ...(variant === 'icon' && {
                    width: '40px',
                    height: '40px',
                    borderRadius: '8px',
                    border: 'none',
                    backgroundColor: '#e5e7eb',
                    color: '#374151',
                    padding: '0',
                    fontSize: '12px',
                    fontWeight: 'bold',
                    fontFamily: 'system-ui, -apple-system, sans-serif',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.2s ease',
                    position: 'relative'
                }),
                ...(variant === 'like' && {
                    background: 'transparent',
                    color: '#666',
                    border: 'none',
                    padding: '4px 8px',
                    borderRadius: '4px',
                    fontSize: '14px',
                    fontWeight: '500',
                    fontFamily: 'system-ui, -apple-system, sans-serif',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    transition: 'background-color 0.2s ease',
                    cursor: 'pointer'
                }),
                ...(variant === 'comment' && {
                    background: 'transparent',
                    color: '#666',
                    border: 'none',
                    padding: '4px 8px',
                    borderRadius: '4px',
                    fontSize: '14px',
                    fontWeight: '500',
                    fontFamily: 'system-ui, -apple-system, sans-serif',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    transition: 'background-color 0.2s ease',
                    cursor: 'pointer'
                }),
                ...(variant === 'close' && {
                    position: 'absolute',
                    top: '20px',
                    right: '20px',
                    background: 'transparent',
                    border: 'none',
                    borderRadius: '0',
                    width: '40px',
                    height: '40px',
                    color: 'white',
                    fontSize: '24px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 10000,
                    fontFamily: 'system-ui, -apple-system, sans-serif',
                    transition: 'all 0.2s ease'
                }),
                ...(variant === 'navPrev' && {
                    position: 'absolute',
                    left: '20px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'rgba(255, 255, 255, 0.2)',
                    border: 'none',
                    borderRadius: '50%',
                    width: '50px',
                    height: '50px',
                    color: 'white',
                    fontSize: '24px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 10000,
                    fontFamily: 'system-ui, -apple-system, sans-serif',
                    transition: 'all 0.2s ease'
                }),
                ...(variant === 'navNext' && {
                    position: 'absolute',
                    right: '20px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'rgba(255, 255, 255, 0.2)',
                    border: 'none',
                    borderRadius: '50%',
                    width: '50px',
                    height: '50px',
                    color: 'white',
                    fontSize: '24px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 10000,
                    fontFamily: 'system-ui, -apple-system, sans-serif',
                    transition: 'all 0.2s ease'
                }),
                ...(variant === 'notification' && {
                    position: 'relative',
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    backgroundColor: 'transparent',
                    border: 'none',
                    borderColor: 'transparent',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    transition: 'background-color 0.2s ease',
                    fontSize: '20px',
                    color: '#374151',
                    padding: '0',
                    fontFamily: 'system-ui, -apple-system, sans-serif',
                    boxShadow: 'none',
                    lineHeight: '1'
                }),
                ...(variant === 'youtube' && {
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: '4px',
                    borderRadius: '4px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#ff0000',
                    fontSize: '18px',
                    transition: 'background-color 0.2s ease',
                    fontFamily: 'system-ui, -apple-system, sans-serif'
                })
            }}
            onMouseEnter={(e) => {
                if (!disabled) {
                    if (variant === 'nav' || variant === 'dropdown' || variant === 'notification') {
                        //nav, dropdown, and notification variants hover just change background
                        e.target.style.backgroundColor = '#f3f4f6';
                    } else if (variant === 'youtube') {
                        //youtube variant hover effect
                        e.target.style.backgroundColor = '#ffebee';
                    } else if (variant === 'icon') {
                        //icon variant hover changes background color
                        e.target.style.backgroundColor = '#d1d5db';
                    } else if (variant === 'comment') {
                        //comment variant hover changes background color and adds blue shadow
                        e.target.style.backgroundColor = '#f5f5f5';
                        e.target.style.transform = 'translateY(-1px)';
                        e.target.style.boxShadow = '0 6px 12px -2px rgb(59 130 246 / 0.3), 0 4px 8px -4px rgb(59 130 246 / 0.3)';
                    } else if (variant === 'close') {
                        //close button hover effect
                        e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
                        e.target.style.transform = 'scale(1.1)';
                    } else if (variant === 'navPrev' || variant === 'navNext') {
                        //modal button variants hover effect
                        e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.3)';
                        e.target.style.transform = 'translateY(-50%) scale(1.1)';
                    } else {
                        //other variants lift and shadow effect
                        e.target.style.transform = 'translateY(-1px)';
                        const shadowColor = shadowColors[variant] || 'rgb(0 0 0 / 0.3)';
                        e.target.style.boxShadow = `0 6px 12px -2px ${shadowColor}, 0 4px 8px -4px ${shadowColor}`;
                    }
                }
            }}
            onMouseLeave={(e) => {
                if (!disabled) {
                    if (variant === 'nav' || variant === 'dropdown' || variant === 'notification') {
                        e.target.style.backgroundColor = 'transparent';
                    } else if (variant === 'youtube') {
                        e.target.style.backgroundColor = 'transparent';
                    } else if (variant === 'icon') {
                        e.target.style.backgroundColor = '#e5e7eb';
                    } else if (variant === 'comment') {
                        e.target.style.backgroundColor = 'transparent';
                        e.target.style.transform = 'translateY(0)';
                        e.target.style.boxShadow = 'none';
                    } else if (variant === 'close') {
                        //close button reset hover effect
                        e.target.style.backgroundColor = 'transparent';
                        e.target.style.transform = 'scale(1)';
                    } else if (variant === 'navPrev' || variant === 'navNext') {
                        // button variants reset hover effect
                        e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
                        e.target.style.transform = 'translateY(-50%) scale(1)';
                    } else {
                        e.target.style.transform = 'translateY(0)';
                        e.target.style.boxShadow = variant === 'primary' || variant === 'success' || variant === 'danger'
                            ? '0 1px 2px 0 rgb(0 0 0 / 0.05)'
                            : 'none';
                    }
                }
            }}
            {...props}
        >
            {children}
        </button>
    );
}

export default MyButton;
