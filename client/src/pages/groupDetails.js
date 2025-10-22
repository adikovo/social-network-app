import axios from 'axios';
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import NavBar from '../components/navBar';
import SearchSideBar from '../components/searchSideBar';
import MyButton from '../components/myButton';

function GroupDetails() {

    const groupId = useParams().groupId;
    const navigate = useNavigate();

    const [group, setGroup] = useState(null);

    useEffect(() => {
        const fetchGroup = async () => {
            try {
                console.log('Fetching group with ID:', groupId);
                const res = await axios.post('http://localhost:3001/api/groups', {
                    command: 'list',
                    data: {}
                });
                console.log('API Response:', res.data);
                console.log('Groups array:', res.data.groups);
                const foundGroup = res.data.groups?.find(group => group._id === groupId);
                console.log('Found group:', foundGroup);
                setGroup(foundGroup);
            } catch (error) {
                console.error('Error fetching group:', error);
                setGroup(null);
            }
        };
        fetchGroup();
    }, [groupId]);




    return (
        <div>
            <NavBar />
            <SearchSideBar />
            <div style={{ marginLeft: '320px', padding: '20px' }}>
                <h1>{group?.name || 'Loading...'}</h1>
                {group && (
                    <>
                        <p><strong>Description:</strong> {group.description}</p>
                        <p><strong>Privacy:</strong> {group.privacy}</p>
                        <p><strong>Members:</strong> {group.members ? group.members.length : 0}</p>
                        <p><strong>Created by:</strong> {group.createdByName || 'Unknown'}</p>
                        <MyButton onClick={() => navigate(-1)}>Go Back</MyButton>
                    </>
                )}
            </div>
        </div>
    )

}

export default GroupDetails;
