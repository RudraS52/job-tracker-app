import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';
import './Header.css'; // If you have a header style

const Header = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        navigate('/'); // Redirect to login page
      })
      .catch((error) => {
        console.error('Error during logout:', error);
      });
  };

  return (
    <header className="header">
      <h1>Job Application Tracker</h1>
      <nav className="header-nav">
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/job-search">Job Search</Link>
        <button onClick={handleLogout} className="logout-button">Logout</button>
      </nav>
    </header>
  );
};

export default Header;
