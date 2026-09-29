// src/components/Header.js
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signOut, onAuthStateChanged } from 'firebase/auth'; 
import { auth } from '../firebase';
import './Header.css'; 

const Header = ({ jobs = [] }) => { // 👈 Accepts the live jobs array prop
  const navigate = useNavigate();
  const [userEmail, setUserEmail] = useState(''); 

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserEmail(user.email);
      } else {
        setUserEmail('');
      }
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        navigate('/'); 
      })
      .catch((error) => {
        console.error('Error during logout:', error);
      });
  };

  // ==========================================
  // 📊 LIVE ANALYTICS MATH COMPILATION PIPELINE
  // ==========================================
  const totalApplications = jobs.length;
  const interviewCount = jobs.filter(job => job.status === 'Interview').length;
  const offerCount = jobs.filter(job => job.status === 'Offer').length;
  
  // Calculate a clean percentage integer, avoiding dividing-by-zero crashes
  const interviewConversionRate = totalApplications > 0 
    ? Math.round((interviewCount / totalApplications) * 100) 
    : 0;

  return (
    <header className="header-wrapper">
      {/* Primary Top Navigation Row */}
      <div className="header">
        <h1>Job Application Tracker</h1>
        <nav className="header-nav" style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          {userEmail && (
            <span className="user-email-badge">
              Logged in as: <strong>{userEmail}</strong>
            </span>
          )}

          <Link to="/dashboard">Dashboard</Link>
          <Link to="/job-search">Job Search</Link>
          <button onClick={handleLogout} className="logout-button">Logout</button>
        </nav>
      </div>

      {/* 📊 DYNAMIC ANALYTICS HUD SUB-BAR PANEL */}
      {userEmail && (
        <div className="analytics-subbar">
          <div className="metric-item">
            <span>Total Tracked:</span> <strong>{totalApplications}</strong>
          </div>
          <div className="metric-item">
            <span>Interviews Hooked:</span> <strong className="text-blue">{interviewCount}</strong>
          </div>
          <div className="metric-item">
            <span>Interview Rate:</span> <strong className="text-purple">{interviewConversionRate}%</strong>
          </div>
          <div className="metric-item">
            <span>Offers Secured:</span> <strong className="text-green">🏆 {offerCount}</strong>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
