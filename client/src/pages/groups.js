import React from 'react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Groups() {

    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [privacy, setPrivacy] = useState('public');
    const [createdBy, setCreatedBy] = useState('');
    const [members, setMembers] = useState([]);
    const [posts, setPosts] = useState([]);


    return (
        <div>

        </div>
    )
}