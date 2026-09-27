// src/components/Login.js
import './Login.css';
import React, { useState } from 'react';
import { auth } from '../firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(''); // Added to handle clean UI errors
  const [loading, setLoading] = useState(false); // Added to prevent double submissions
  
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/dashboard'); 
    } catch (err) {
      // Map cryptic Firebase errors to friendly messages
      switch (err.code) {
        case 'auth/invalid-credential':
        case 'auth/user-not-found':
        case 'auth/wrong-password':
          setError('Invalid email or password.');
          break;
        case 'auth/too-many-requests':
          setError('Too many failed attempts. Try again later.');
          break;
        default:
          setError('Failed to login. Please try again.');
      }
    } finally {
      setLoading(false); // Re-enable form controls
    }
  };

  return (
  <div className="auth-container">
    <div className="login-form"> {/* Updated class from auth-form to login-form */}
      <h1 className="app-title">Job Application Tracker</h1>
      <h2 className="auth-subtitle">Login to your account</h2>
      
      {error && <div className="error-banner">{error}</div>}
      
      <form onSubmit={handleLogin}>
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
          placeholder="Password" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          required 
          disabled={loading}
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
      <p>Don't have an account? <Link to="/signup">Signup</Link></p>
    </div>
  </div>
);

};

export default Login;
