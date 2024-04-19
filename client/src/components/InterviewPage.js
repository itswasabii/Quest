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
      options: ['Take breaks', 'Prioritize tasks', 'Practice mindfulness', 'Talk to a mentor'],
    },
    {
      question: 'Describe a challenging project you worked on and how you handled it.',
      options: ['Adaptability', 'Persistence', 'Resourcefulness', 'Creativity'],
    },
    {
      question: 'How do you stay updated with industry trends and developments?',
      options: ['Adaptability', 'Persistence', 'Resourcefulness', 'Creativity'],
    },
    {
      question: 'Tell me about a time when you had to resolve a conflict in your team.',
      options: ['Adaptability', 'Persistence', 'Resourcefulness', 'Creativity'],
    },
    {
      question: 'What do you consider your greatest professional achievement so far?',
      options: ['Adaptability', 'Persistence', 'Resourcefulness', 'Creativity'],
    },
    {
      question: 'How do you handle feedback and criticism from colleagues or supervisors?',
      options: ['Adaptability', 'Persistence', 'Resourcefulness', 'Creativity'],
    },
    {
      question: 'Where do you see yourself professionally in the next 5 years?',
      options: ['Adaptability', 'Persistence', 'Resourcefulness', 'Creativity'],
    },
  ], []);

  // Function to handle user selection of an answer
  const handleAnswerSelection = (selectedOption) => {
    setUserAnswers([...userAnswers, selectedOption]);
    // Move to the next question if available
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setTimer(30); // Reset timer for the next question
    }
  };

  // Function to handle timer countdown
  useEffect(() => {
    const countdown = setInterval(() => {
      if (timer > 0) {
        setTimer(timer - 1);
      } else {
        // Move to the next question when time runs out
        if (currentQuestionIndex < questions.length - 1) {
          setCurrentQuestionIndex(currentQuestionIndex + 1);
          setTimer(30); // Reset timer for the next question
        }
      }
    }, 1000);

    // Clear the interval when component unmounts or when all questions are answered
    return () => clearInterval(countdown);
  }, [timer, currentQuestionIndex, questions]);

  // Calculate progress percentage
  useEffect(() => {
    const calculatedProgress = (currentQuestionIndex / questions.length) * 100;
    setProgress(calculatedProgress);
  }, [currentQuestionIndex, questions]);

  return (
    <div className="interview-page">
      <h1>Interview Questions</h1>
      <div className="progress-indicator">
        Progress: {progress.toFixed(2)}%
        <div className="progress-bar" style={{ width: `${progress}%` }}></div>
      </div>
      {currentQuestionIndex < questions.length ? (
        <div className="question-container">
          <h2>Question {currentQuestionIndex + 1}:</h2>
          <p>{questions[currentQuestionIndex].question}</p>
          <p>Time Remaining: {timer} seconds</p>
          <div className="options">
            {questions[currentQuestionIndex].options.map((option, index) => (
              <button key={index} onClick={() => handleAnswerSelection(option)}>
                {option}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="interview-complete">
          <h2>Interview Complete</h2>
          <p>Thank you for participating!</p>
          <p>Your answers:</p>
          <ul>
            {userAnswers.map((answer, index) => (
              <li key={index}>{`${index + 1}. ${answer}`}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default InterviewPage;
