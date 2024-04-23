import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css'; // Import the external CSS file




const Navbar = () => {
    return (
        <nav className="navbar">
            <div className="navbar-brand">
                <Link to="/">QUEST</Link>
            </div>
            <ul className="navbar-links">
                <li>
                    <Link to="/home-page">Home</Link>
                </li>
                <li>
                    <Link to="/register">Register</Link>
                </li>
                <li>
                    <Link to="/profile">Profile</Link>
                </li>

                <li>
                    <Link to="/login">Login</Link>
                </li>

                <li>
                    <Link to="/Dashboard">Dashboard</Link>
                </li>

                <li>
                    <Link to="/Admin">Admin</Link>
                </li>
                {/* Add other links as needed */}
            </ul>
        </nav>
    );
};

export default Navbar;
