import React, { useState } from 'react';
import './JobCard.css';

const JobCard = ({ job, updateJob, deleteJob }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [position, setPosition] = useState(job.position);
  const [company, setCompany] = useState(job.company);

  const handleSave = () => {
    if (!position.trim() || !company.trim()) {
      alert('Position and Company cannot be empty.');
      return;
    }

    updateJob(job.id, {
      ...job,
      position: position.trim(),
      company: company.trim(),
    });

    setIsEditing(false);
  };

  const handleDelete = () => {
    const confirmed = window.confirm(
      'Are you sure you want to delete this job?'
    );

    if (confirmed) {
      deleteJob(job.id);
    }
  };

  const handleStatusChange = (e) => {
    updateJob(job.id, {
      ...job,
      status: e.target.value,
    });
  };

  return (
    <div className="job-card">

      {isEditing ? (
        <>
          <input
            type="text"
            value={position}
            onChange={(e) => setPosition(e.target.value)}
            placeholder="Position"
          />

          <input
            type="text"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            placeholder="Company"
          />

          <button onClick={handleSave}>
            Save
          </button>

          <button onClick={() => setIsEditing(false)}>
            Cancel
          </button>
        </>
      ) : (
        <>
          <h3>{job.position}</h3>

          <p>
            <strong>Company:</strong> {job.company}
          </p>

          <p>
            <strong>Status:</strong> {job.status}
          </p>

          <div className="job-actions">

            <select
              value={job.status}
              onChange={handleStatusChange}
            >
              <option value="Applied">Applied</option>
              <option value="Interview">Interview</option>
              <option value="Offer">Offer</option>
              <option value="Rejected">Rejected</option>
            </select>

            <button onClick={() => setIsEditing(true)}>
              Edit
            </button>

            <button onClick={handleDelete}>
              Delete
            </button>

          </div>
        </>
      )}

    </div>
  );
};

export default JobCard;