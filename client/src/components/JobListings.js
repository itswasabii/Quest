// JobListings.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';

const JobListings = () => {
    const [listings, setListings] = useState([]);

    useEffect(() => {
        const fetchListings = async () => {
            try {
                const response = await axios.get('/api/joblistings');
                setListings(response.data);
            } catch (error) {
                console.error('Error fetching job listings:', error);
            }
        };

        fetchListings();
    }, []);

    return (
        <div>
            <h2>Job Listings</h2>
            <ul>
                {listings.map((listing) => (
                    <li key={listing.id}>
                        <h3>{listing.title}</h3>
                        <p>{listing.description}</p>
                        <p>Status: {listing.status}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default JobListings;
