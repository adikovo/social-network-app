import { useState } from 'react';

const useMyAlert = () => {

    const [alert, setAlert] = useState({
        show: false,
        message: '',
        type: 'success',
        duration: 3000
    });

    const showAlert = (message, type = 'success', duration = 3000) => {
        setAlert({
            show: true,
            message,
            type,
            duration
        });
    };

    const hideAlert = () => {
        setAlert(prev => ({
            ...prev,
            show: false
        }));
    };

    const showSuccess = (message, duration = 3000) => {
        showAlert(message, 'success', duration);
    };

    const showError = (message, duration = 4000) => {
        showAlert(message, 'error', duration);
    };

    const showWarning = (message, duration = 4000) => {
        showAlert(message, 'warning', duration);
    };

    const showInfo = (message, duration = 3000) => {
        showAlert(message, 'info', duration);
    };

    return {
        alert,
        showAlert,
        hideAlert,
        showSuccess,
        showError,
        showWarning,
        showInfo
    };
};

export default useMyAlert;
