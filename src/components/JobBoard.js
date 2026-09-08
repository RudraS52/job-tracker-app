import React from 'react';
import JobColumn from './JobColumn';
import './JobBoard.css';

const STATUSES = [
  'Applied',
  'Interview',
  'Offer',
  'Rejected',
];

const JobBoard = ({
  jobs,
  updateJob,
  deleteJob,
}) => {
  return (
    <div className="job-board">

      {STATUSES.map((status) => (
        <JobColumn
          key={status}
          status={status}
          jobs={jobs.filter(
            (job) => job.status === status
          )}
          updateJob={updateJob}
          deleteJob={deleteJob}
        />
      ))}

    </div>
  );
};

export default JobBoard;