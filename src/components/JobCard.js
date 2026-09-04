import React from 'react';
import './JobCard.css';

const JobCard = ({ job }) => {
  return (
    <div className="job-card">
      <h3>{job.position}</h3>
      <p><strong>Company:</strong> {job.company}</p>
    </div>
  );
};

export default JobCard;
