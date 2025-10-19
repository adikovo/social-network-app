import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Login from './pages/login';
import Register from './pages/register';
import Feed from './pages/feed';
import Groups from './pages/groups';

//router handler for the apps
function AppRouter() {
    return (
        //routes for the app
        <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/feed/:userId" element={<Feed />} />
            <Route path="/groups/:userId" element={<Groups />} />

        </Routes>
    );
}

export default AppRouter;
