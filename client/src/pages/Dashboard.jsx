import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaTasks, FaUser, FaPlus, FaSignOutAlt, FaChartBar, FaListUl } from 'react-icons/fa';
import TaskList from '../components/tasks/TaskList';
import TaskStatistics from '../components/dashboard/TaskStatistics';
import TaskForm from '../components/tasks/TaskForm';
import useAuthStore from '../store/authStore';
import useTaskStore from '../store/taskStore';

const Dashboard = ({ darkMode, setDarkMode }) => {
  const [activeTab, setActiveTab] = useState('tasks');
  const [showTaskForm, setShowTaskForm] = useState(false);
  const { user, logout } = useAuthStore();
  const { tasks, fetchTasks, isLoading, error } = useTaskStore();
  
  // Fetch tasks on component mount
  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);
  
  const handleLogout = () => {
    logout();
    // Redirect will happen automatically due to the ProtectedRoute component
  };
  
  const handleTaskCreated = () => {
    setShowTaskForm(false);
    fetchTasks();
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
            <Link to="/profile" className="flex items-center space-x-1 text-sm hover:text-blue-500">
              <FaUser />
              <span>{user?.firstName || user?.username}</span>
            </Link>
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
        {/* Tabs */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex space-x-4">
            <button
              onClick={() => setActiveTab('tasks')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${
                activeTab === 'tasks' 
                  ? 'bg-blue-500 text-white' 
                  : `${darkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white hover:bg-gray-100'}`
              }`}
            >
              <FaListUl />
              <span>My Tasks</span>
            </button>
            <button
              onClick={() => setActiveTab('statistics')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${
                activeTab === 'statistics' 
                  ? 'bg-blue-500 text-white' 
                  : `${darkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white hover:bg-gray-100'}`
              }`}
            >
              <FaChartBar />
              <span>Statistics</span>
            </button>
          </div>
          
          {activeTab === 'tasks' && (
            <button
              onClick={() => setShowTaskForm(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
            >
              <FaPlus />
              <span>New Task</span>
            </button>
          )}
        </div>
        
        {/* Content */}
        <div className={`rounded-lg shadow-md ${darkMode ? 'bg-gray-800' : 'bg-white'} p-6`}>
          {activeTab === 'tasks' && (
            <TaskList 
              tasks={tasks} 
              isLoading={isLoading} 
              error={error} 
              darkMode={darkMode}
              onTaskUpdated={fetchTasks}
            />
          )}
          
          {activeTab === 'statistics' && (
            <TaskStatistics />
          )}
        </div>
      </main>
      
      {/* Footer */}
      <footer className={`py-4 px-6 ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-inner`}>
        <div className="container mx-auto text-center text-sm text-gray-500">
          <p>&copy; {new Date().getFullYear()} TaskMaster. All rights reserved.</p>
        </div>
      </footer>
      
      {/* Task Form Modal */}
      {showTaskForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className={`w-full max-w-md ${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-lg`}>
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Create New Task</h2>
                <button 
                  onClick={() => setShowTaskForm(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  &times;
                </button>
              </div>
              <TaskForm 
                onTaskCreated={handleTaskCreated} 
                onCancel={() => setShowTaskForm(false)}
                darkMode={darkMode}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;