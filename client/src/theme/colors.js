export const colors = {
    // Primary Purple Theme
    primary: {
        main: '#8B5CF6',
        dark: '#7C3AED',
        light: '#A78BFA',
        gradient: 'linear-gradient(135deg, #8B5CF6, #7C3AED)',
        shadow: 'rgba(139, 92, 246, 0.3)',
        border: '#8B5CF6'
    },

    // Secondary Teal Theme
    secondary: {
        main: '#06B6D4',
        dark: '#0891B2',
        light: '#22D3EE',
        gradient: 'linear-gradient(135deg, #06B6D4, #0891B2)',
        shadow: 'rgba(6, 182, 212, 0.3)',
        border: '#06B6D4'
    },

    // Status Colors
    success: {
        main: '#10B981',
        dark: '#059669',
        gradient: 'linear-gradient(135deg, #10b981, #059669)',
        shadow: 'rgba(16, 185, 129, 0.3)',
        border: '#10b981'
    },

    danger: {
        main: '#EF4444',
        dark: '#DC2626',
        gradient: 'linear-gradient(135deg, #ef4444, #dc2626)',
        shadow: 'rgba(239, 68, 68, 0.3)',
        border: '#ef4444'
    },

    warning: {
        main: '#F59E0B',
        dark: '#D97706',
        gradient: 'linear-gradient(135deg, #f59e0b, #d97706)',
        shadow: 'rgba(245, 158, 11, 0.3)',
        border: '#f59e0b'
    },

    info: {
        main: '#06B6D4',
        dark: '#0891B2',
        gradient: 'linear-gradient(135deg, #06b6d4, #0891b2)',
        shadow: 'rgba(6, 182, 212, 0.3)',
        border: '#06b6d4'
    },

    // Neutral Colors
    neutral: {
        background: '#F8FAFC',
        text: '#475569',
        border: '#E2E8F0',
        shadow: 'rgba(0, 0, 0, 0.05)',
        light: '#F1F5F9',
        dark: '#1E293B'
    }
};

// Easy access to commonly used colors
export const theme = {
    primary: colors.primary.main,
    primaryGradient: colors.primary.gradient,
    primaryShadow: colors.primary.shadow,
    primaryBorder: colors.primary.border,

    secondary: colors.secondary.main,
    secondaryGradient: colors.secondary.gradient,
    secondaryShadow: colors.secondary.shadow,
    secondaryBorder: colors.secondary.border,

    success: colors.success.main,
    successGradient: colors.success.gradient,
    successShadow: colors.success.shadow,
    successBorder: colors.success.border,

    danger: colors.danger.main,
    dangerGradient: colors.danger.gradient,
    dangerShadow: colors.danger.shadow,
    dangerBorder: colors.danger.border,

    warning: colors.warning.main,
    warningGradient: colors.warning.gradient,
    warningShadow: colors.warning.shadow,
    warningBorder: colors.warning.border,

    info: colors.info.main,
    infoGradient: colors.info.gradient,
    infoShadow: colors.info.shadow,
    infoBorder: colors.info.border,

    background: colors.neutral.background,
    text: colors.neutral.text,
    border: colors.neutral.border,
    shadow: colors.neutral.shadow,
    light: colors.neutral.light,
    dark: colors.neutral.dark
};
