import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { auth } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';

import Header from './components/Header';
import Footer from './components/Footer';
import JobForm from './components/JobForm';
import JobBoard from './components/JobBoard';
import JobSearch from './components/JobSearch';
import Login from './components/Login';
import Signup from './components/Signup';
import ProtectedRoute from './components/ProtectedRoute';

import './App.css';

function App() {
  const [jobs, setJobs] = useState([]);
  const isInitialLoad = useRef(true); // 🚩 Track first load
  const [user, setUser] = useState(null); // 🚩 Track logged-in user

  // 🔐 Track authentication state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  // Load jobs on initial render
  useEffect(() => {
    const savedJobs = JSON.parse(localStorage.getItem('jobApplications')) || [];
    console.log('Jobs loaded from local storage:', savedJobs);
    setJobs(savedJobs);
  }, []);

  // Save jobs to local storage whenever jobs change
  useEffect(() => {
    if (isInitialLoad.current) {
      isInitialLoad.current = false;
      return;
    }
    localStorage.setItem('jobApplications', JSON.stringify(jobs));
    console.log('Jobs saved to local storage:', jobs);
  }, [jobs]);

  const addJob = (job) => {
    const newJobs = [...jobs, { ...job, id: Date.now() }];
    setJobs(newJobs);
  };

  const deleteJob = (id) => {
    const updatedJobs = jobs.filter(job => job.id !== id);
    setJobs(updatedJobs);
  };

  const updateJob = (id, updatedJob) => {
  const updatedJobs = jobs.map((job) =>
    job.id === id ? updatedJob : job
  );

  setJobs(updatedJobs);
};

  return (
    <Router>
      <div className="App">
        {/* Show Header and Footer only if user is logged in */}
        {user && <Header />}
        <div className="main-content">
          <Routes>
            {/* 🔑 Default route: Show Login or Redirect to Dashboard */}
            <Route path="/" element={!user ? <Login /> : <Navigate to="/dashboard" />} />
            <Route path="/signup" element={<Signup />} />

            {/* 🔐 Protected Dashboard */}
<Route
  path="/dashboard"
  element={
    <ProtectedRoute user={user}>
      <>
        <JobForm addJob={addJob} />

        <JobBoard
          jobs={jobs}
          updateJob={updateJob}
          deleteJob={deleteJob}
        />
      </>
    </ProtectedRoute>
  }
/>

            {/* Optional Job Search Page */}
            <Route path="/job-search" element={<JobSearch />} />

          </Routes>
        </div>
        {user && <Footer />}
      </div>
    </Router>
  );
}

export default App;
