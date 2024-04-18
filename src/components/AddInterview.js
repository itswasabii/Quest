import React, { useState } from 'react';
import axios from 'axios';

const AddInterview = () => {
  const [question, setQuestion] = useState('');
  const [correctAnswer, setCorrectAnswer] = useState('');
  const [incorrectAnswers, setIncorrectAnswers] = useState(['', '']);

  const handleAddAnswer = () => {
    setIncorrectAnswers([...incorrectAnswers, '']);
  };

  const handleIncorrectAnswerChange = (index, value) => {
    const updatedAnswers = [...incorrectAnswers];
    updatedAnswers[index] = value;
    setIncorrectAnswers(updatedAnswers);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const answers = [...incorrectAnswers, correctAnswer];
      await axios.post('/api/interviews', { question, answers, correctAnswer });
      setQuestion('');
      setCorrectAnswer('');
      setIncorrectAnswers(['', '']);
    } catch (error) {
      console.error('Error adding interview:', error);
    }
  };

  return (
    <div>
      <h2>Add Interview</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Question:
          <input type="text" value={question} onChange={(e) => setQuestion(e.target.value)} />
        </label>
        <label>
          Correct Answer:
          <input
            type="text"
            value={correctAnswer}
            onChange={(e) => setCorrectAnswer(e.target.value)}
          />
        </label>
        {incorrectAnswers.map((answer, index) => (
          <div key={index}>
            <label>
              Incorrect Answer:
              <input
                type="text"
                value={answer}
                onChange={(e) => handleIncorrectAnswerChange(index, e.target.value)}
              />
            </label>
          </div>
        ))}
        <button type="button" onClick={handleAddAnswer}>Add  Answer</button>
        <button type="submit">Add Interview</button>
      </form>
    </div>
  );
};

export default AddInterview;
