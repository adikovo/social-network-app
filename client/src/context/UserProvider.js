import { useState } from 'react';
import { UserContext } from './UserContext';

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    //set the user in the context
    const login = (userData) => {
        setUser(userData);
    };

    //logout the user
    const logout = () => {
        setUser(null);
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
        updateUser
    };

    return (
        <UserContext.Provider value={value}>
            {children}
        </UserContext.Provider>
    );
};
