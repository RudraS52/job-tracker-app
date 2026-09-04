import React from 'react';
import JobCard from './JobCard';
import './JobColumn.css';

const JobColumn = ({ status, jobs }) => {
  return (
    <div className="job-column">
      <h2>{status}</h2>
      {jobs.length === 0 ? (
        <p className="empty-column">No jobs in this stage.</p>
      ) : (
        jobs.map((job) => <JobCard key={job.id} job={job} />)
      )}
    </div>
  );
};

export default JobColumn;
