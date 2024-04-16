import React from 'react';
import AddInterview from './AddInterview';
import InterviewList from './InterviewList';
import InterviewSession from './InterviewSession';

const InterviewManager = () => {
  return (
    <div>
      <h1>Interview Manager</h1>
      <AddInterview />
      <InterviewList />
      <InterviewSession />
    </div>
  );
};

export default InterviewManager;
