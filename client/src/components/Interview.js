import React, { useState, useEffect, useMemo } from 'react';
import './InterviewPage.css'; // Import CSS file for styling

const InterviewPage = () => {
    // State to manage current question index, user answers, and timer
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [userAnswers, setUserAnswers] = useState([]);
    const [timer, setTimer] = useState(30); // Initial timer value in seconds
    const [progress, setProgress] = useState(0); // Progress percentage

    // Sample interview questions and answer options
    const questions = useMemo(() => [
        {
            question: 'Tell me about yourself and your professional background.',
            options: ['Teamwork', 'Problem-solving', 'Communication', 'Leadership'],
        },
        {
            question: 'Why are you interested in this position and our company?',
            options: ['Company Culture', 'Growth Opportunities', 'Skills Fit', 'Industry Reputation'],
        },
        {
            question: 'Describe a challenging project you worked on and how you handled it.',
            options: ['Adaptability', 'Persistence', 'Resourcefulness', 'Creativity'],
        },
        {
            question: 'How do you stay updated with industry trends and developments?',
            options: ['Read News', 'Attend Conferences', 'Networking', 'Online Courses'],
        },
        {
            question: 'Tell me about a time when you had to resolve a conflict in your team.',
            options: ['Listening', 'Mediation', 'Problem Solving', 'Compromise'],
        },
        {
            question: 'What do you consider your greatest professional achievement so far?',
            options: ['Project Success', 'Innovation', 'Leadership', 'Problem Solving'],
        },
        {
            question: 'How do you handle feedback and criticism from colleagues or supervisors?',
            options: ['Listening', 'Reflection', 'Improvement', 'Acknowledgment'],
        },
        {
            question: 'Where do you see yourself professionally in the next 5 years?',
            options: ['Career Advancement', 'Leadership', 'New Skills', 'Entrepreneurship'],
        },
    ], []);

    // Function to handle user selection of an answer
    const handleAnswerSelection = (selectedOption) => {
        // Add the selected option to the user's answers
        setUserAnswers([...userAnswers, selectedOption]);

        // Check if the interview has reached the last question
        if (currentQuestionIndex < questions.length - 1) {
            // Move to the next question
            setCurrentQuestionIndex(currentQuestionIndex + 1);
            // Reset timer for the next question
            setTimer(30);
        }
        // If the last question is answered, set the progress to 100%
        else {
            setProgress(100);
        }
    };

    // Function to handle timer countdown
    useEffect(() => {
        // Create a countdown interval
        const countdown = setInterval(() => {
            if (timer > 0) {
                setTimer(timer - 1);
            } else {
                // Move to the next question when time runs out
                if (currentQuestionIndex < questions.length - 1) {
                    setCurrentQuestionIndex(currentQuestionIndex + 1);
                    setTimer(30); // Reset timer for the next question
                }
                // If the last question is answered, set the progress to 100%
                else {
                    setProgress(100);
                }
            }
        }, 1000);

        // Clear the interval when the component unmounts or when the interview is complete
        return () => clearInterval(countdown);
    }, [timer, currentQuestionIndex, questions]);

    // Calculate progress percentage
    useEffect(() => {
        // Calculate the progress percentage based on the current question index
        const calculatedProgress = Math.round(((currentQuestionIndex + 1) / questions.length) * 100);
        setProgress(calculatedProgress);
    }, [currentQuestionIndex, questions]);

    return (
        <div className="interview-page">
            <h1>Help Us Help You</h1>
            <div className="progress-indicator">
                <div className="progress-text">
                    Progress: {progress}%
                </div>
                <div className="progress-bar" style={{ width: `${progress}%` }}></div>
            </div>
            {/* Render questions or completion message */}
            {currentQuestionIndex < questions.length ? (
                <div className="question-container">
                    <h2>Question {currentQuestionIndex + 1}:</h2>
                    <p>{questions[currentQuestionIndex].question}</p>
                    <p>Time Remaining: {timer} seconds</p>
                    <div className="options">
                        {/* Render options */}
                        {questions[currentQuestionIndex].options.map((option, index) => (
                            <button key={index} onClick={() => handleAnswerSelection(option)}>
                                {option}
                            </button>
                        ))}
                    </div>
                </div>
            ) : (
                // Interview complete section
                <div className="interview-complete">
                    <h2>Interview Complete</h2>
                    <p>Thank you for participating!</p>
                    <p>Your answers:</p>
                    <ul>
                        {/* List user answers */}
                        {userAnswers.map((answer, index) => (
                            <li key={index}>{index + 1}. {answer}</li>
                        ))}
                    </ul>
                    {/* Thank you message */}
                    <p>We appreciate your time and effort.</p>
                </div>
            )}
        </div>
    );
};

export default InterviewPage;
