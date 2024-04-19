import React, { useState, useEffect } from 'react';
import axios from 'axios';

function UserDashboard({ userId }) {
    const [listings, setListings] = useState([]);
    const [applications, setApplications] = useState([]);

    useEffect(() => {
        // Fetch job listings from Admin API
        axios.get(`/api/joblistings`)
            .then(response => {
                setListings(response.data);
            })
            .catch(error => {
                console.error('Error fetching job listings:', error);
            });

        // Fetch user applications from Flask API
        axios.get(`/user/applications/${userId}`)
            .then(response => {
                setApplications(response.data);
            })
            .catch(error => {
                console.error('Error fetching user applications:', error);
            });
    }, [userId]);

    const handleApply = (userId, jobListingId) => {
        const data = {
            user_id: userId,
            job_listing_id: jobListingId
        };
    
        axios.post('/api/apply', data)
            .then(response => {
                alert(response.data.message);
            })
            .catch(error => {
                alert(error.response.data.error);
            });
    };
    

    return (
        <div>
            <h2>User Dashboard</h2>

            <h3>Available Job Listings:</h3>
            <ul>
                {listings.map(listing => (
                    <li key={listing.id}>
                        <h4>{listing.title}</h4>
                        <p>{listing.description}</p>
                        <p>Status: {listing.status}</p>
                        <button onClick={() => handleApply(userId, listing.id)}>Apply</button>
                    </li>
                ))}
            </ul>

            <h3>Your Applications:</h3>
            <ul>
                {applications.map(application => (
                    <li key={application.id}>
                        <p>Job Title: {application.job_title}</p>
                        <p>Status: {application.status}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default UserDashboard;
