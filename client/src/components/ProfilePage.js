import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ProfilePage.css';

const ProfilePage = () => {
    const [userData, setUserData] = useState({});
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({});

    // Fetch user data from the back end
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await axios.get('/api/user/profile');
                setUserData(response.data);
                setFormData(response.data);
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        fetchUserData();
    }, []);

    // Handle form change
    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData({ ...formData, [name]: value });
    };

    // Handle form submission
    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            await axios.put('/api/user/profile', formData);
            alert('Profile updated successfully');
            setIsEditing(false);
            // Refresh user data
            const response = await axios.get('/api/user/profile');
            setUserData(response.data);
        } catch (error) {
            console.error('Error updating profile:', error);
            alert('Error updating profile');
        }
    };

    return (
        <div>
            <h2>User Profile</h2>
            {isEditing ? (
                // Render the edit form
                <form onSubmit={handleSubmit}>
                    <div>
                        <label>Name:</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <label>Email:</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            disabled
                        />
                    </div>
                    <div>
                        <label>Phone Number:</label>
                        <input
                            type="text"
                            name="phone_number"
                            value={formData.phone_number}
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <label>Education:</label>
                        <input
                            type="text"
                            name="education"
                            value={formData.education}
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <label>Relevant Skills:</label>
                        <input
                            type="text"
                            name="relevant_skills"
                            value={formData.relevant_skills}
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <label>Profession:</label>
                        <input
                            type="text"
                            name="profession"
                            value={formData.profession}
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <label>Desired Job Role:</label>
                        <input
                            type="text"
                            name="desired_job_role"
                            value={formData.desired_job_role}
                            onChange={handleChange}
                        />
                    </div>
                    {/* Add other form fields as needed */}
                    <button type="submit">Save Changes</button>
                    <button type="button" onClick={() => setIsEditing(false)}>Cancel</button>
                </form>
            ) : (
                // Render the profile information
                <div>
                    <p><strong>Name:</strong> {userData.name}</p>
                    <p><strong>Email:</strong> {userData.email}</p>
                    <p><strong>Phone Number:</strong> {userData.phone_number}</p>
                    <p><strong>Education:</strong> {userData.education}</p>
                    <p><strong>Relevant Skills:</strong> {userData.relevant_skills}</p>
                    <p><strong>Profession:</strong> {userData.profession}</p>
                    <p><strong>Desired Job Role:</strong> {userData.desired_job_role}</p>
                    {/* Add other profile information as needed */}
                    <button onClick={() => setIsEditing(true)}>Edit Profile</button>
                </div>
            )}
        </div>
    );
};

export default ProfilePage;
