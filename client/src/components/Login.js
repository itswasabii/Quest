import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';

const LoginForm = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const history = useHistory();

    useEffect(() => {
        // Check if the user is already logged in
        const authToken = localStorage.getItem('authToken');
        if (authToken) {
            // Redirect to the home page if the user is already logged in
            history.push('/home');
        }
    }, [history]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Basic form validation
        if (!email || !password) {
            setError('Please enter both email and password.');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const response = await axios.post('/api/login', {
                email,
                password,
            });

            // Store the authentication token in local storage
            localStorage.setItem('authToken', response.data.token);

            // Redirect to the homepage after a successful login
            history.push('/home');
        } catch (error) {
            console.error('Login failed:', error);
            setError('Login failed. Please check your email and password and try again.');
        }

        setLoading(false);
    };

    return (
        <div>
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>
                {error && <p style={{ color: 'red' }}>{error}</p>}
                
                <div>
                    <label htmlFor="email">Email:</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                
                <div>
                    <label htmlFor="password">Password:</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                
                <button type="submit" disabled={loading}>
                    {loading ? 'Logging in...' : 'Login'}
                </button>
            </form>
        </div>
    );
};

export default LoginForm;
