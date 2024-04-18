import React, { useState, useEffect } from 'react';
import axios from 'axios';

function AdminPanel() {
    const [listings, setListings] = useState([]);
    const [applications, setApplications] = useState([]);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');

    useEffect(() => {
        // Fetch job listings from Flask API
        axios.get('/admin/joblistings')
            .then(response => {
                setListings(response.data);
            })
            .catch(error => {
                console.error('Error fetching job listings:', error);
            });

        // Fetch user applications from Flask API
        axios.get('/admin/applications')
            .then(response => {
                setApplications(response.data);
            })
            .catch(error => {
                console.error('Error fetching user applications:', error);
            });
    }, []);

    const addListing = () => {
        axios.post('/admin/joblistings', { title, description })
            .then(response => {
                alert(response.data.message);
                setTitle('');
                setDescription('');
                // Refresh listings
                axios.get('/admin/joblistings')
                    .then(response => {
                        setListings(response.data);
                    });
            })
            .catch(error => {
                console.error('Error adding job listing:', error);
            });
    };

    const updateApplicationStatus = (id, status) => {
        axios.put('/admin/applications', { id, status })
            .then(response => {
                alert(response.data.message);
                // Refresh applications
                axios.get('/admin/applications')
                    .then(response => {
                        setApplications(response.data);
                    });
            })
            .catch(error => {
                console.error('Error updating application status:', error);
            });
    };

    return (
        <div>
            <h2>Admin Panel - Job Listings</h2>
            <div>
                <label>Title:</label>
                <input type="text" value={title} onChange={e => setTitle(e.target.value)} />
            </div>
            <div>
                <label>Description:</label>
                <textarea value={description} onChange={e => setDescription(e.target.value)}></textarea>
            </div>
            <button onClick={addListing}>Add Listing</button>

            <h3>Job Listings:</h3>
            <ul>
                {listings.map(listing => (
                    <div className='container'>
                        <li key={listing.id}>
                            <h4>{listing.title}</h4>
                            <p>{listing.description}</p>
                            <p>Status: {listing.status}</p>
                        </li>
                    </div>

                ))}
            </ul>

            <h3>User Applications:</h3>
            <ul>
                {applications.map(application => (
                    <li key={application.id}>
                        <p>User ID: {application.user_id}</p>
                        <p>Job Listing ID: {application.job_listing_id}</p>
                        <p>Status: {application.status}</p>
                        <button onClick={() => updateApplicationStatus(application.id, 'Accepted')}>Accept</button>
                        <button onClick={() => updateApplicationStatus(application.id, 'Declined')}>Decline</button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default AdminPanel;
