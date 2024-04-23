import React from 'react';
import { useHistory } from 'react-router-dom'; // Import useHistory from react-router-dom

import './HomePage.css'; // Import CSS file for styling
import InterviewPage from './Interview';

// Define the FeatureCard component
const FeatureCard = ({ title, description }) => {
    return (
        <div className="feature-card">
            <h3>{title}</h3>
            <p>{description}</p>
        </div>
    );
};

const HomePage = () => {
    // Use the useHistory hook to get the history object
    const history = useHistory();

    // Function to handle button click
    const handleStartJobSearch = () => {
        // Redirect to the registration page
        history.push('/register');
    };

    return (
        <div className="home-page">
            {/* Hero section */}
            <section className="hero-section">
                <div className="hero-content">
                    <h1>Find Your Dream Job</h1>
                    <p>Explore thousands of job opportunities across various industries.</p>
                    {/* Attach the event handler to the button */}
                    <button class="cta-button" onClick={handleStartJobSearch}>Start Your Job Search</button>
                </div>
            </section>

            {/* Features section */}
            <section className="features-section">
                <h2>Why Choose Us?</h2>
                <div className="features">
                    {/* Use the FeatureCard component to render each feature */}
                    <FeatureCard title="Vast Opportunities" description="Discover job openings in a wide range of industries." />
                    <FeatureCard title="Personalized Job Matches" description="Get tailored job recommendations based on your preferences and skills." />
                    <FeatureCard title="Expert Career Advice" description="Receive guidance and tips to advance your career." />
                </div>
            </section>

            {/* About Us section */}
            <section className="about-us-section">
                <h2>About Us</h2>
                <div className="about-card">
                    <p>Welcome to our platform! We are a dedicated team of professionals passionate about connecting job seekers with their dream opportunities. Our mission is to revolutionize the job search experience by providing a user-friendly, efficient, and personalized platform that caters to your unique career aspirations.

We believe in the power of diversity and inclusion, striving to create an environment where talent from all walks of life can thrive. Our platform fosters meaningful connections between job seekers and employers, ensuring that your skills and potential are recognized and valued.

Our commitment to excellence drives us to continuously improve our platform, offering expert career advice and innovative features to enhance your job search journey. We understand the importance of finding the perfect fit, which is why we go above and beyond to provide tailored job matches and career resources.

Join us on this journey as we work towards building a better future for job seekers and employers alike. Together, let's create a world where everyone can achieve their professional dreams and contribute to a brighter tomorrow!</p>
                </div>
            </section>

            {/* Additional Information section */}
            < InterviewPage />
        </div>
    );
};

export default HomePage;
