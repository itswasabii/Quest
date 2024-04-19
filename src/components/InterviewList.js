import React, { useState, useEffect } from 'react';
import axios from 'axios';

const InterviewList = () => {
  const [interviews, setInterviews] = useState([]);

  useEffect(() => {
    fetchInterviews();
  }, []);

  const fetchInterviews = async () => {
    try {
      const response = await axios.get('/api/interviews');
      setInterviews(response.data);
    } catch (error) {
      console.error('Error fetching interviews:', error);
    }
  };

  return (
    <div>
      <h2>Interviews</h2>
      <ul>
        {interviews.map((interview) => (
          <li key={interview.id}>
            <div>Question: {interview.question}</div>
            <div>Answer: {interview.answer}</div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default InterviewList;
