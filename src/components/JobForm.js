
import React, { useState } from 'react';
import './JobForm.css';

const JobForm = ({ addJob }) => {
  const [company, setCompany] = useState('');
  const [position, setPosition] = useState('');
  const [status, setStatus] = useState('Applied');

  // Add job application
  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate required fields
    if (!company.trim() || !position.trim()) {
      alert('Please fill all fields.');
      return;
    }

    // Create new job object
    const newJob = {
      company: company.trim(),
      position: position.trim(),
      status,
    };

    // Send job to App.js
    addJob(newJob);

    // Reset form
    setCompany('');
    setPosition('');
    setStatus('Applied');
  };

  return (
    <form className="job-form" onSubmit={handleSubmit}>
      <h2>Add Job Application</h2>

      <input
        type="text"
        placeholder="Company"
        value={company}
        onChange={(e) => setCompany(e.target.value)}
      />

      <input
        type="text"
        placeholder="Position"
        value={position}
        onChange={(e) => setPosition(e.target.value)}
      />

      <select
        value={status}
        onChange={(e) => setStatus(e.target.value)}
      >
        <option value="Applied">Applied</option>
        <option value="Interview">Interview</option>
        <option value="Offer">Offer</option>
        <option value="Rejected">Rejected</option>
      </select>

      <button type="submit">Add Job</button>
    </form>
  );
};

export default JobForm;

