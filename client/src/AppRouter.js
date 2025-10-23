import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Login from './pages/login';
import Register from './pages/register';
import Feed from './pages/feed';
import Groups from './pages/groups';
import GroupDetails from './pages/groupDetails';
import Profile from './pages/profile';

//router handler for the apps
function AppRouter() {
    return (
        //routes for the app
        <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/feed" element={<Feed />} />
            <Route path="/groups" element={<Groups />} />
            <Route path="/group/:groupId" element={<GroupDetails />} />
            <Route path="/profile/:userId" element={<Profile />} />

        </Routes>
    );
}

export default AppRouter;
