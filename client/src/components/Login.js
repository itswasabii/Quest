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

        // Store the authentication token in local storage or session storage
        localStorage.setItem('authToken', response.data.token);

        // Redirect to the homepage after a successful login
        history.push('/home');
    } catch (error) {
        console.error('Login failed:', error);
        alert('Login failed. Please try again.');
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