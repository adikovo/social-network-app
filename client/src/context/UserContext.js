import { createContext, useContext } from 'react';

const UserContext = createContext();

export const useUserContext = () => {

    const context = useContext(UserContext);
    if (!context) {
        throw new Error('useUserContext must be used within UserProvider');
    }
    return context;
};

export { UserContext };
