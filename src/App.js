// src/App.js
import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { auth, db } from './firebase'; 
import { onAuthStateChanged } from 'firebase/auth';
import { 
  collection, 
  query, 
  where, 
  orderBy, 
  getDocs,       
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  serverTimestamp 
} from 'firebase/firestore'; 

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
  const [user, setUser] = useState(null); 
  const [loadingAuth, setLoadingAuth] = useState(true); // 👈 1. ADDED: Specifically tracks Firebase Login Token Verification
  const [loadingJobs, setLoadingJobs] = useState(false); // Tracks database fetch states

  // 🔐 Tracks authentication state & extracts cloud data rows securely
  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);

      // Handle user logout state clearing immediately
      if (!currentUser) {
        setJobs([]);
        setLoadingAuth(false); // 👈 Release auth gate on logout
        setLoadingJobs(false);
        return;
      }

      // 2. FIXED: Pull database entries only AFTER verifying a valid account exists
      const fetchCloudData = async () => {
        setLoadingJobs(true);
        try {
          const q = query(
            collection(db, 'jobs'),
            where('userId', '==', currentUser.uid),
            orderBy('createdAt', 'desc')
          );
          
          const snapshot = await getDocs(q);
          const liveJobsList = [];
          
          snapshot.forEach((doc) => {
            liveJobsList.push({ id: doc.id, ...doc.data() });
          });

          // Only seed mock cards if the user has genuinely never saved an item to the database
          if (liveJobsList.length === 0) {
            console.log('New database environment detected. Seeding developer template records...');
            await setupCloudDemoData(currentUser.uid);
          } else {
            setJobs(liveJobsList);
          }
        } catch (error) {
          console.error("Firestore loading framework error:", error);
        } finally {
          setLoadingJobs(false);
          setLoadingAuth(false); // 👈 3. FIXED: Release auth gate after checking account items
        }
      };

      fetchCloudData();
    });

    return () => unsubscribeAuth();
  }, []);

  // Helper routine to seed mock items into Firestore for recruiters automatically
  const setupCloudDemoData = async (uid) => {
    const mockJobs = [
      { company: 'Google', position: 'Frontend Developer', status: 'Interview', notes: 'Technical interview scheduled next Tuesday.' },
      { company: 'Amazon', position: 'Software Engineer (UI)', status: 'Applied', notes: 'Applied via referral.' },
      { company: 'Netflix', position: 'React UI Specialist', status: 'Offer', notes: 'Reviewing offer letter parameters!' }
    ];

    try {
      for (const item of mockJobs) {
        await addDoc(collection(db, 'jobs'), {
          ...item,
          userId: uid,
          createdAt: serverTimestamp()
        });
      }
      
      // Pull newly generated mock data cards to render onto layout columns
      const q = query(collection(db, 'jobs'), where('userId', '==', uid), orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      const freshList = [];
      snapshot.forEach((doc) => freshList.push({ id: doc.id, ...doc.data() }));
      setJobs(freshList);
    } catch (e) {
      console.error("Demo seeding error:", e);
    }
  };

  // ➕ CREATE: Saves item directly to Firestore database collection
  const addJob = async (job) => {
    if (!user) return alert("Session expired.");
    try {
      const docRef = await addDoc(collection(db, 'jobs'), {
        company: job.company,
        position: job.position,
        status: job.status || 'Applied',
        notes: job.notes || '',
        userId: user.uid, 
        createdAt: serverTimestamp() 
      });

      const optimisticNewJob = {
        id: docRef.id,
        company: job.company,
        position: job.position,
        status: job.status || 'Applied',
        notes: job.notes || ''
      };
      
      setJobs((prevJobs) => [optimisticNewJob, ...prevJobs]);
    } catch (error) {
      console.error("Error creating entry:", error);
    }
  };

  // ❌ DELETE: Deletes document from the cloud via its document ID
  const deleteJob = async (id) => {
    try {
      const jobRef = doc(db, 'jobs', id);
      await deleteDoc(jobRef);
      setJobs((prevJobs) => prevJobs.filter(job => job.id !== id));
    } catch (error) {
      console.error("Error erasing entry:", error);
    }
  };

  // 🔄 UPDATE: Updates modified card properties or columns inside your Firestore pipeline
  const updateJob = async (id, updatedJob) => {
    try {
      const jobRef = doc(db, 'jobs', id);
      const updatedFields = {
        company: updatedJob.company,
        position: updatedJob.position,
        status: updatedJob.status,
        notes: updatedJob.notes || ''
      };
      await updateDoc(jobRef, updatedFields);
      setJobs((prevJobs) =>
        prevJobs.map((job) => (job.id === id ? { ...job, ...updatedFields } : job))
      );
    } catch (error) {
      console.error("Error patching fields:", error);
    }
  };

  // 4. FIXED: Blocks rendering logic loops entirely until authorization check settles
  if (loadingAuth) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh", background: "#f8fafc", color: "#1e293b", fontFamily: "sans-serif", fontSize: "16px", fontWeight: "500" }}>
        Verifying secure database credentials session...
      </div>
    );
  }

  return (
    <Router>
      <div className="App">
        {user && <Header />}
        <div className="main-content">
          {loadingJobs && (
            <div style={{ position: "fixed", top: "20px", right: "20px", background: "#2563eb", color: "#fff", padding: "10px 20px", borderRadius: "20px", fontSize: "13px", zIndex: 9999, boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}>
              Updating pipeline...
            </div>
          )}
          <Routes>
            <Route path="/" element={!user ? <Login /> : <Navigate to="/dashboard" />} />
            <Route path="/signup" element={<Signup />} />

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

            <Route path="/job-search" element={<JobSearch />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
        {user && <Footer />}
      </div>
    </Router>
  );
}

export default App;
