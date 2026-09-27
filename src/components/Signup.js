// src/components/Signup.js
import './Signup.css';
import React, { useState } from 'react';
import { auth } from '../firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { useNavigate, Link } from 'react-router-dom';

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(''); // Added to handle clean UI errors
  const [loading, setLoading] = useState(false); // Added to prevent double submissions
  
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      navigate('/dashboard'); 
    } catch (err) {
      // Map cryptic Firebase auth creation errors to user-friendly messages
      switch (err.code) {
        case 'auth/email-already-in-use':
          setError('This email address is already registered.');
          break;
        case 'auth/invalid-email':
          setError('Please enter a valid email address.');
          break;
        case 'auth/weak-password':
          setError('Password should be at least 6 characters long.');
          break;
        default:
          setError('Failed to create an account. Please try again.');
      }
    } finally {
      setLoading(false); // Re-enable form controls
    }
  };

  return (
    <div className="auth-container">
      <div className="signup-form">
        <h1 className="app-title">Job Application Tracker</h1>
        <h2 className="auth-subtitle">Create your free account</h2>
        
        {error && <div className="error-banner">{error}</div>}
        
        <form onSubmit={handleSignup}>
          <input 
            type="email" 
            placeholder="Email address" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
            disabled={loading}
          />
          <input 
            type="password" 
            placeholder="Choose password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
            disabled={loading}
          />
          <button type="submit" disabled={loading}>
            {loading ? 'Creating Account...' : 'Get Started'}
          </button>
        </form>
        <p>Already have an account? <Link to="/">Login</Link></p>
      </div>
    </div>
  );
};

export default Signup;
