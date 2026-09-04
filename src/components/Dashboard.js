// Example in Dashboard.js
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    signOut(auth).then(() => {
      navigate('/');
    });
  };

  return (
    <div>
      <h2>Job Tracker Dashboard</h2>
      <button onClick={handleLogout}>Logout</button>
      {/* Add JobForm and JobBoard here */}
    </div>
  );
};

export default Dashboard;
