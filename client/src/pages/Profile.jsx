import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaTasks, FaUser, FaKey, FaSignOutAlt } from 'react-icons/fa';
import UserProfile from '../components/profile/UserProfile';
import ChangePassword from '../components/profile/ChangePassword';
import useAuthStore from '../store/authStore';

const Profile = ({ darkMode, setDarkMode }) => {
  const [activeTab, setActiveTab] = useState('profile');
  const { user, logout } = useAuthStore();
  
  const handleLogout = () => {
    logout();
    // Redirect will happen automatically due to the ProtectedRoute component
  };
  
  return (
    <div className={`min-h-screen flex flex-col ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'}`}>
      {/* Header */}
      <header className={`py-4 px-6 ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow`}>
        <div className="container mx-auto flex justify-between items-center">
          <Link to="/dashboard" className="flex items-center space-x-2">
            <FaTasks className="text-blue-500 text-2xl" />
            <span className="text-xl font-bold">TaskMaster</span>
          </Link>
          
          <div className="flex items-center space-x-4">
            <span className="text-sm">
              Welcome, {user?.firstName || user?.username}
            </span>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-1 text-sm text-red-500 hover:text-red-700"
            >
              <FaSignOutAlt />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="flex-grow container mx-auto p-6">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar */}
          <div className="w-full md:w-64 shrink-0">
            <div className={`rounded-lg shadow-md ${darkMode ? 'bg-gray-800' : 'bg-white'} p-4`}>
              <h2 className="text-xl font-bold mb-4">Account Settings</h2>
              <nav className="space-y-2">
                <button
                  onClick={() => setActiveTab('profile')}
                  className={`w-full flex items-center space-x-2 p-2 rounded-lg ${
                    activeTab === 'profile' 
                      ? 'bg-blue-500 text-white' 
                      : `${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`
                  }`}
                >
                  <FaUser />
                  <span>Profile Information</span>
                </button>
                <button
                  onClick={() => setActiveTab('password')}
                  className={`w-full flex items-center space-x-2 p-2 rounded-lg ${
                    activeTab === 'password' 
                      ? 'bg-blue-500 text-white' 
                      : `${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`
                  }`}
                >
                  <FaKey />
                  <span>Change Password</span>
                </button>
              </nav>
              
              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                <Link
                  to="/dashboard"
                  className={`w-full flex items-center space-x-2 p-2 rounded-lg ${
                    darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                  }`}
                >
                  <FaTasks />
                  <span>Back to Dashboard</span>
                </Link>
              </div>
            </div>
          </div>
          
          {/* Main Content */}
          <div className="flex-grow">
            {activeTab === 'profile' && <UserProfile />}
            {activeTab === 'password' && <ChangePassword />}
          </div>
        </div>
      </main>
      
      {/* Footer */}
      <footer className={`py-4 px-6 ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-inner`}>
        <div className="container mx-auto text-center text-sm text-gray-500">
          <p>&copy; {new Date().getFullYear()} TaskMaster. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Profile;