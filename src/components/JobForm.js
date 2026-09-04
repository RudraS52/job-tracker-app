import React, { useState } from 'react';
import './JobForm.css';

const JobForm = ({ addJob }) => {
  const [company, setCompany] = useState('');
  const [position, setPosition] = useState('');
  const [status, setStatus] = useState('Applied');
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);

// 🛠️ API call to fetch live job titles
const fetchJobs = async (query) => {
  try {
    const res = await fetch(`https://remotive.io/api/remote-jobs?search=${query}`);
    const data = await res.json();
    setSuggestions(data.jobs.slice(0, 5)); // show top 5 results
  } catch (error) {
    console.error('Error fetching jobs:', error);
  }
};



  // 👀 Live search as user types
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);

    if (value.trim().length > 2) { // only fetch if 3+ characters
      fetchJobs(value);
    } else {
      setSuggestions([]);
    }
  };

  // 🖱️ When a suggestion is clicked
  const handleSuggestionClick = (job) => {
    setCompany(job.company_name);
    setPosition(job.title);
    setSearchQuery(job.title);
    setSuggestions([]);
  };

  // ✅ Add job to tracker
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!company || !position) {
      alert('Please fill all fields.');
      return;
    }

    const newJob = {
      id: Date.now(),
      company,
      position,
      status,
    };

    addJob(newJob);

    // Reset form
    setCompany('');
    setPosition('');
    setStatus('Applied');
    setSearchQuery('');
    setSuggestions([]);
  };

  return (
    <form className="job-form" onSubmit={handleSubmit}>
      <h2>Add Job Application</h2>

      <input
        type="text"
        placeholder="Search jobs by title..."
        value={searchQuery}
        onChange={handleSearchChange}
      />

      {/* Suggestions dropdown */}
      {suggestions.length > 0 && (
        <ul className="suggestions-list">
          {suggestions.map((job, index) => (
            <li key={index} onClick={() => handleSuggestionClick(job)}>
              {job.title} @ {job.company_name}
            </li>
          ))}
        </ul>
      )}

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

      <select value={status} onChange={(e) => setStatus(e.target.value)}>
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
