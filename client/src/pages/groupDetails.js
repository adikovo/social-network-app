import axios from 'axios';
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

function GroupDetails() {

    const groupId = useParams().groupID;
    const navigate = useNavigate();

    return (
        <div>
            <h1>Group Details</h1>

        </div>
    )

}

export default GroupDetails;
