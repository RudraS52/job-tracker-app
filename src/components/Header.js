// src/components/Header.js
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signOut, onAuthStateChanged } from 'firebase/auth'; // 👈 Added onAuthStateChanged for dynamic session mapping
import { auth } from '../firebase';
import './Header.css'; 

const Header = () => {
  const navigate = useNavigate();
  const [userEmail, setUserEmail] = useState(''); // State to hold verified user email safely

  // Dynamic listener to capture email even during hard reloads (Ctrl + F5)
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

  return (
    <header className="header">
      <h1>Job Application Tracker</h1>
      <nav className="header-nav" style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
        
        {/* 📧 Clean, highly visible user email badge component */}
        {userEmail && (
          <span className="user-email-badge" style={{ fontSize: '14px', color: '#64748b', backgroundColor: '#f1f5f9', padding: '6px 12px', borderRadius: '20px', fontWeight: '500', marginRight: '10px' }}>
            Logged in as: <strong>{userEmail}</strong>
          </span>
        )}

        <Link to="/dashboard">Dashboard</Link>
        <Link to="/job-search">Job Search</Link>
        <button onClick={handleLogout} className="logout-button">Logout</button>
      </nav>
    </header>
  );
};

export default Header;
