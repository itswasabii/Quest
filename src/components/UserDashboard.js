import React, { useState, useEffect } from 'react';
import axios from 'axios';

function UserDashboard({ userId }) {
    const [dashboardData, setDashboardData] = useState([]);

useEffect(() => {
    axios.get(`/user/dashboard?user_id=${userId}`)
        .then(response => {
            setDashboardData(response.data);
        })
        .catch(error => {
            console.error('Error fetching dashboard data:', error);
        });
}, [userId]);

return (
    <div>
        <h2>User Dashboard</h2>
        <h3>Applications:</h3>
        <ul>
            {dashboardData.map(application => (
                <li key={application.id}>
                    <h4>{application.title}</h4>
                    <p>{application.description}</p>
                    <p>Status: {application.status}</p>
                </li>
            ))}
        </ul>
    </div>
);
}

export default UserDashboard;