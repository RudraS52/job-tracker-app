import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="app-footer">
      <p>&copy; {new Date().getFullYear()} Job Tracker App. Built by RP Singh.</p>
    </footer>
  );
};

export default Footer;
