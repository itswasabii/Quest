// UpdateInterview.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const UpdateInterview = ({ interviewId }) => {
  const [question, setQuestion] = useState('');
  const [answerOptions, setAnswerOptions] = useState([]);
  const [selectedAnswer, setSelectedAnswer] = useState('');

  useEffect(() => {
    const fetchInterview = async () => {
      try {
        const response = await axios.get(`/api/interviews/${interviewId}`);
        const { question, answerOptions, selectedAnswer } = response.data;
        setQuestion(question);
        setAnswerOptions(answerOptions);
        setSelectedAnswer(selectedAnswer);
      } catch (error) {
        console.error('Error fetching interview:', error);
      }
    };

    fetchInterview();
  }, [interviewId]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await axios.put(`/api/interviews/${interviewId}`, { question, selectedAnswer });
    } catch (error) {
      console.error('Error updating interview:', error);
    }
  };

  return (
    <div>
      <h2>Update Interview</h2>
      <form onSubmit={handleSubmit}>
        <p>{question}</p>
        <div>
          {answerOptions.map((option, index) => (
            <label key={index}>
              <input
                type="radio"
                value={option}
                checked={selectedAnswer === option}
                onChange={(e) => setSelectedAnswer(e.target.value)}
              />
              {option}
            </label>
          ))}
        </div>
        <button type="submit">Update Interview</button>
      </form>
    </div>
  );
};

export default UpdateInterview;
