import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SignupForm from '../components/auth/SignupForm';
import useAuthStore from '../store/authStore';

const Signup = ({ darkMode }) => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  
  // Redirect to dashboard if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);
  
  return (
    <div className={`min-h-screen flex items-center justify-center p-6 ${darkMode ? 'bg-gray-900' : 'bg-gray-100'}`}>
      <SignupForm darkMode={darkMode} />
    </div>
  );
};

export default Signup;