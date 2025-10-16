import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Login from './pages/login';
import Register from './pages/register';
import Feed from './pages/feed';

//router handler for the apps
function AppRouter() {
    return (
        //routes for the app
        <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/feed" element={<Feed />} />
        </Routes>
    );
}

export default AppRouter;
