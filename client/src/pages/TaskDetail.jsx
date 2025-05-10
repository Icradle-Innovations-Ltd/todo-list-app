import { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { FaTasks, FaUser, FaSignOutAlt, FaEdit, FaTrash, FaArrowLeft } from 'react-icons/fa';
import TaskForm from '../components/tasks/TaskForm';
import useAuthStore from '../store/authStore';
import useTaskStore from '../store/taskStore';

const TaskDetail = ({ darkMode }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState(null);
  const [showEditForm, setShowEditForm] = useState(false);
  const { user, logout } = useAuthStore();
  const { fetchTaskById, deleteTask, isLoading, error } = useTaskStore();
  
  // Fetch task on component mount
  useEffect(() => {
    const loadTask = async () => {
      const taskData = await fetchTaskById(id);
      if (taskData) {
        setTask(taskData);
      }
    };
    
    loadTask();
  }, [fetchTaskById, id]);
  
  const handleLogout = () => {
    logout();
    // Redirect will happen automatically due to the ProtectedRoute component
  };
  
  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      const result = await deleteTask(id);
      if (result.success) {
        navigate('/dashboard');
      }
    }
  };
  
  const handleTaskUpdated = (updatedTask) => {
    setTask(updatedTask);
    setShowEditForm(false);
  };
  
  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'Not set';
    return new Date(dateString).toLocaleDateString();
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
        <div className="mb-6">
          <Link 
            to="/dashboard" 
            className="flex items-center space-x-2 text-blue-500 hover:text-blue-700"
          >
            <FaArrowLeft />
            <span>Back to Dashboard</span>
          </Link>
        </div>
        
        {isLoading ? (
          <div className={`rounded-lg shadow-md ${darkMode ? 'bg-gray-800' : 'bg-white'} p-6 flex justify-center items-center`}>
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : error ? (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        ) : !task ? (
          <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-4">
            Task not found
          </div>
        ) : (
          <div className={`rounded-lg shadow-md ${darkMode ? 'bg-gray-800' : 'bg-white'} p-6`}>
            <div className="flex justify-between items-start mb-6">
              <h1 className="text-2xl font-bold">{task.title}</h1>
              <div className="flex space-x-2">
                <button
                  onClick={() => setShowEditForm(true)}
                  className="flex items-center space-x-1 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  <FaEdit />
                  <span>Edit</span>
                </button>
                <button
                  onClick={handleDelete}
                  className="flex items-center space-x-1 px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  <FaTrash />
                  <span>Delete</span>
                </button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <div className="mb-4">
                  <h2 className="text-lg font-semibold mb-2">Description</h2>
                  <p className={`p-3 rounded ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                    {task.description || 'No description provided'}
                  </p>
                </div>
                
                <div className="mb-4">
                  <h2 className="text-lg font-semibold mb-2">Notes</h2>
                  <p className={`p-3 rounded ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                    {task.notes || 'No notes provided'}
                  </p>
                </div>
                
                {task.checklist && task.checklist.length > 0 && (
                  <div className="mb-4">
                    <h2 className="text-lg font-semibold mb-2">Checklist</h2>
                    <ul className={`p-3 rounded ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                      {task.checklist.map((item, index) => (
                        <li key={index} className="flex items-center space-x-2 mb-2">
                          <input
                            type="checkbox"
                            checked={item.completed}
                            readOnly
                            className="h-4 w-4"
                          />
                          <span className={item.completed ? 'line-through text-gray-500' : ''}>
                            {item.text}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
              
              <div>
                <div className={`p-4 rounded ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                  <h2 className="text-lg font-semibold mb-4">Task Details</h2>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Status</p>
                      <p className="font-medium">
                        <span className={`inline-block px-2 py-1 rounded text-xs ${
                          task.status === 'Completed' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          {task.status}
                        </span>
                      </p>
                    </div>
                    
                    <div>
                      <p className="text-sm text-gray-500">Priority</p>
                      <p className="font-medium">
                        <span className={`inline-block px-2 py-1 rounded text-xs ${
                          task.priority === 'High' 
                            ? 'bg-red-100 text-red-800' 
                            : task.priority === 'Medium'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-green-100 text-green-800'
                        }`}>
                          {task.priority}
                        </span>
                      </p>
                    </div>
                    
                    <div>
                      <p className="text-sm text-gray-500">Category</p>
                      <p className="font-medium">{task.category || 'Uncategorized'}</p>
                    </div>
                    
                    <div>
                      <p className="text-sm text-gray-500">Due Date</p>
                      <p className="font-medium">{formatDate(task.dueDate)}</p>
                    </div>
                    
                    <div>
                      <p className="text-sm text-gray-500">Created</p>
                      <p className="font-medium">{formatDate(task.createdAt)}</p>
                    </div>
                    
                    <div>
                      <p className="text-sm text-gray-500">Recurring</p>
                      <p className="font-medium">{task.recurring || 'None'}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
      
      {/* Footer */}
      <footer className={`py-4 px-6 ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-inner`}>
        <div className="container mx-auto text-center text-sm text-gray-500">
          <p>&copy; {new Date().getFullYear()} TaskMaster. All rights reserved.</p>
        </div>
      </footer>
      
      {/* Edit Task Form Modal */}
      {showEditForm && task && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className={`w-full max-w-md ${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-lg`}>
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Edit Task</h2>
                <button 
                  onClick={() => setShowEditForm(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  &times;
                </button>
              </div>
              <TaskForm 
                task={task}
                onTaskUpdated={handleTaskUpdated}
                onCancel={() => setShowEditForm(false)}
                darkMode={darkMode}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskDetail;