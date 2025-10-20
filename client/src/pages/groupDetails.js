import axios from 'axios';
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

function GroupDetails() {

    const groupID = useParams().groupID;
    const navigate = useNavigate();

    return (
        <div>

        </div>
    )

}

export default GroupDetails;
