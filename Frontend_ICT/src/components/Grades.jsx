import React, { useState } from 'react';
import './Grades.css';

const Grades = () => {
  const [status, setStatus] = useState([false, false, false, false]);

  const submissions = [
    { week: 1, marks: 85, comments: 'Good work!' },
    { week: 2, marks: 90, comments: 'Excellent progress!' },
    { week: 3, marks: 78, comments: 'Needs improvement in some areas.' },
    { week: 4, marks: 92, comments: 'Outstanding performance!' }
  ];

  const toggleStatus = (index) => {
    const newStatus = [...status];
    newStatus[index] = !newStatus[index];
    setStatus(newStatus);
  };

  return (
    <div className="App">
      <h1>Weekly Submission Status</h1>
      <ul className="submission-list">
        {submissions.map((submission, index) => (
          <li key={index} className="submission-item">
            <div className="week">Week {submission.week}</div>
            <button className="status-button" onClick={() => toggleStatus(index)}>
              {status[index] ? 'Hide Status' : 'View Status'}
            </button>
            {status[index] && (
              <div className="details">
                <p>Marks: {submission.marks}</p>
                <p>Comments: {submission.comments}</p>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Grades;