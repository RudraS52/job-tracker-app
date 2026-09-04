import React from 'react';
import JobColumn from './JobColumn';
import './JobBoard.css';

const JobBoard = ({ jobs }) => {
  const statuses = ['Applied', 'Interview', 'Offer', 'Rejected'];

  return (
    <div className="job-board">
      {statuses.map((status) => (
        <JobColumn
          key={status}
          status={status}
          jobs={jobs.filter((job) => job.status === status)}
        />
      ))}
    </div>
  );
};

export default JobBoard;
