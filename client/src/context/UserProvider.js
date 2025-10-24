import { useState, useEffect } from 'react';
import { UserContext } from './UserContext';
import axios from 'axios';

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    // Check for stored user ID on app startup
    useEffect(() => {
        const storedUserId = localStorage.getItem('userId');
        if (storedUserId) {
            // Fetch user data from server using stored ID
            axios.post('http://localhost:3001/api/users', {
                command: 'getUser',
                data: { userId: storedUserId }
            })
                .then(res => {
                    if (res.data.user) {
                        setUser(res.data.user);
                    } else {
                        // User not found, clear localStorage
                        localStorage.removeItem('userId');
                    }
                })
                .catch(err => {
                    console.error('Failed to restore user session:', err);
                    // Clear invalid stored data
                    localStorage.removeItem('userId');
                })
                .finally(() => {
                    setIsLoading(false);
                });
        } else {
            // No stored user ID, immediately stop loading
            setIsLoading(false);
        }
    }, []);

    //set the user in the context and store ID in localStorage
    const login = (userData) => {
        setUser(userData);
        localStorage.setItem('userId', userData.id);
    };

    //logout the user and clear localStorage
    const logout = () => {
        setUser(null);
        localStorage.removeItem('userId');
    };

    //update the user in the context
    const updateUser = (updates) => {
        const updatedUser = { ...user, ...updates };
        setUser(updatedUser);
    };
    //return the value of the context
    const value = {
        user,
        login,
        logout,
        updateUser,
        isLoading
    };

    return (
        <UserContext.Provider value={value}>
            {children}
        </UserContext.Provider>
    );
};
