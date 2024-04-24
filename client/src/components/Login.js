import React, { useState } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';

const LoginForm = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const history = useHistory();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post('/api/login', { email, password });

            // Check if the response is successful and contains the 'access_token' property
            if (response && response.data && response.data.access_token) {
                // Store the authentication token in local storage or session storage
                localStorage.setItem('authToken', response.data.access_token);

                // Redirect to the profile page after successful login
                history.push('/profile');
            } else {
                console.error('Unexpected response:', response);
                alert('Login failed. Please try again.');
            }
        } catch (error) {
            // Handle Axios errors
            if (error.response) {
                // The request was made and the server responded with a status code
                console.error('Login failed:', error.response.data);
                alert('Login failed. Please try again.');
            } else if (error.request) {
                // The request was made but no response was received
                console.error('Network error:', error.request);
                alert('Network error. Please check your internet connection.');
            } else {
                // Something else happened while setting up the request
                console.error('Error:', error.message);
                alert('An error occurred. Please try again later.');
            }
        }
    };

    return (
        <div>
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Email:</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
                <div>
                    <label>Password:</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                <button type="submit">Login</button>
            </form>
        </div>
    );
};

export default LoginForm;
