import React, { useState, useEffect } from 'react';
import axios from 'axios';

const InterviewSession = () => {
  const [interview, setInterview] = useState(null);
  const [selectedAnswer, setSelectedAnswer] = useState('');

  useEffect(() => {
    fetchInterview();
  }, []);

  const fetchInterview = async () => {
    try {
      const response = await axios.get('/api/interviews/random'); // Assuming there's an endpoint to fetch a random interview
      setInterview(response.data);
    } catch (error) {
      console.error('Error fetching interview:', error);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      // Assuming there's an endpoint to submit the interview with selected answer
      await axios.post('/api/interviews/submit', { interviewId: interview.id, selectedAnswer });
      // Handle success or redirect to next interview
    } catch (error) {
      console.error('Error submitting interview:', error);
    }
  };

  if (!interview) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>Interview Session</h2>
      <h3>{interview.question}</h3>
      <form onSubmit={handleSubmit}>
        {interview.answers.map((answer) => (
          <div key={answer}>
            <input
              type="radio"
              id={answer}
              name="answer"
              value={answer}
              checked={selectedAnswer === answer}
              onChange={() => setSelectedAnswer(answer)}
            />
            <label htmlFor={answer}>{answer}</label>
          </div>
        ))}
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default InterviewSession;
