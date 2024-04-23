import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ProfilePage.css';

const ProfilePage = () => {
    const [userData, setUserData] = useState({});
    const [formData, setFormData] = useState({});
    const [isEditing, setIsEditing] = useState(false);

    // Fetch user data from the backend
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const authToken = localStorage.getItem('authToken');
                if (!authToken) {
                    // Handle case where authentication token is missing
                    return;
                }

                const response = await axios.get('/api/user/profile', {
                    headers: {
                        Authorization: `Bearer ${authToken}`
                    }
                });
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
    if (name === 'relevant_skills') {
        // If relevant_skills is an object, convert it to a string
        if (typeof value === 'object') {
            const relevantSkillsString = JSON.stringify(value);
            setFormData({ ...formData, [name]: relevantSkillsString });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    } else {
        setFormData({ ...formData, [name]: value });
    }
};

    // Handle form submission
    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const authToken = localStorage.getItem('authToken');
            await axios.put('/api/user/profile', formData, {
                headers: {
                    Authorization: `Bearer ${authToken}`
                }
            });
            alert('Profile updated successfully');
            setIsEditing(false);
            // Refresh user data
            const response = await axios.get('/api/user/profile', {
                headers: {
                    Authorization: `Bearer ${authToken}`
                }
            });
            setUserData(response.data);
        } catch (error) {
            console.error('Error updating profile:', error);
            alert('Error updating profile');
        }
    };

    // Handle logout
    const handleLogout = () => {
        localStorage.removeItem('authToken');
        window.location.reload(); // Reload the page to clear the user data
    };

    return (
        <div className="profile-container">
            <h2>User Profile</h2>
            {isEditing ? (
                // Render the edit form
                <form onSubmit={handleSubmit} className="profile-form">
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
                            value={formData.email || ''}
                            onChange={handleChange}
                            disabled // Email is disabled for editing
                        />
                    </div>
                    <div>
                        <label>Phone Number:</label>
                        <input
                            type="text"
                            name="phone_number"
                            value={formData.phone_number || ''}
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <label>Education:</label>
                        <input
                            type="text"
                            name="education"
                            value={formData.education || ''}
                            onChange={handleChange}
                        />
                    </div>
                    <div>
        <label>Relevant Skills:</label>
        <input
            type="text"
            name="relevant_skills"
            value={typeof formData.relevant_skills === 'object' ? JSON.stringify(formData.relevant_skills) : formData.relevant_skills}
            onChange={handleChange}
        />
    </div>
                    <div>
                        <label>Profession:</label>
                        <input
                            type="text"
                            name="profession"
                            value={formData.profession || ''}
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <label>Desired Job Role:</label>
                        <input
                            type="text"
                            name="desired_job_role"
                            value={formData.desired_job_role || ''}
                            onChange={handleChange}
                        />
                    </div>
                    <button type="submit">Save Changes</button>
                    <button type="button" onClick={() => setIsEditing(false)}>Cancel</button>
                </form>
            ) : (
                // Render the profile information
                <div className="profile-info">
                    <p><strong>Name:</strong> {userData.name}</p>
                    <p><strong>Email:</strong> {userData.email}</p>
                    <p><strong>Phone Number:</strong> {userData.phone_number}</p>
                    <p><strong>Education:</strong> {userData.education}</p>
                    <p><strong>Relevant Skills:</strong> {userData.relevant_skills}</p>
                    <p><strong>Profession:</strong> {userData.profession}</p>
                    <p><strong>Desired Job Role:</strong> {userData.desired_job_role}</p>
                    {/* Add other profile information as needed */}
                    <div className="button-group">
                        <button onClick={() => setIsEditing(true)}>Edit Profile</button>
                        <button onClick={handleLogout}>Logout</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProfilePage;
