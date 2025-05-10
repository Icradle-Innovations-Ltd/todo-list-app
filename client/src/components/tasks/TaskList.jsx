import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaCheck, FaHourglass, FaTrash, FaFilter, FaSort, FaSearch } from 'react-icons/fa';
import useTaskStore from '../../store/taskStore';

const TaskList = ({ tasks, isLoading, error, darkMode, onTaskUpdated }) => {
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');
  const [searchTerm, setSearchTerm] = useState('');
  const { toggleTaskStatus, deleteTask } = useTaskStore();
  
  // Handle task status toggle
  const handleToggleStatus = async (e, id) => {
    e.preventDefault(); // Prevent navigation to task detail
    e.stopPropagation(); // Prevent event bubbling
    
    await toggleTaskStatus(id);
    if (onTaskUpdated) {
      onTaskUpdated();
    }
  };
  
  // Handle task deletion
  const handleDelete = async (e, id) => {
    e.preventDefault(); // Prevent navigation to task detail
    e.stopPropagation(); // Prevent event bubbling
    
    if (window.confirm('Are you sure you want to delete this task?')) {
      await deleteTask(id);
      if (onTaskUpdated) {
        onTaskUpdated();
      }
    }
  };
  
  // Filter tasks
  const filteredTasks = tasks.filter(task => {
    // Apply status filter
    if (filter === 'completed' && task.status !== 'Completed') return false;
    if (filter === 'pending' && task.status !== 'Pending') return false;
    
    // Apply search filter
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      return (
        task.title.toLowerCase().includes(search) ||
        (task.description && task.description.toLowerCase().includes(search)) ||
        (task.category && task.category.toLowerCase().includes(search))
      );
    }
    
    return true;
  });
  
  // Sort tasks
  const sortedTasks = [...filteredTasks].sort((a, b) => {
    let valueA, valueB;
    
    // Determine values to compare based on sortBy
    if (sortBy === 'dueDate') {
      valueA = a.dueDate ? new Date(a.dueDate).getTime() : Number.MAX_SAFE_INTEGER;
      valueB = b.dueDate ? new Date(b.dueDate).getTime() : Number.MAX_SAFE_INTEGER;
    } else if (sortBy === 'priority') {
      const priorityValues = { 'High': 3, 'Medium': 2, 'Low': 1 };
      valueA = priorityValues[a.priority] || 0;
      valueB = priorityValues[b.priority] || 0;
    } else if (sortBy === 'title') {
      valueA = a.title.toLowerCase();
      valueB = b.title.toLowerCase();
    } else { // Default to createdAt
      valueA = new Date(a.createdAt).getTime();
      valueB = new Date(b.createdAt).getTime();
    }
    
    // Apply sort order
    return sortOrder === 'asc' ? valueA - valueB : valueB - valueA;
  });
  
  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
        {error}
      </div>
    );
  }
  
  return (
    <div>
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        {/* Search */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <FaSearch className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search tasks..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`pl-10 pr-4 py-2 w-full md:w-64 rounded-lg border ${
              darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'
            } focus:outline-none focus:ring-2 focus:ring-blue-500`}
          />
        </div>
        
        <div className="flex flex-wrap gap-2">
          {/* Filter */}
          <div className="relative">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className={`pl-8 pr-4 py-2 rounded-lg border appearance-none ${
                darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'
              } focus:outline-none focus:ring-2 focus:ring-blue-500`}
            >
              <option value="all">All Tasks</option>
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
            </select>
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <FaFilter className="text-gray-400" />
            </div>
          </div>
          
          {/* Sort By */}
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className={`pl-8 pr-4 py-2 rounded-lg border appearance-none ${
                darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'
              } focus:outline-none focus:ring-2 focus:ring-blue-500`}
            >
              <option value="createdAt">Date Created</option>
              <option value="dueDate">Due Date</option>
              <option value="priority">Priority</option>
              <option value="title">Title</option>
            </select>
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <FaSort className="text-gray-400" />
            </div>
          </div>
          
          {/* Sort Order */}
          <button
            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
            className={`px-4 py-2 rounded-lg border ${
              darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'
            } focus:outline-none focus:ring-2 focus:ring-blue-500`}
          >
            {sortOrder === 'asc' ? '↑ Ascending' : '↓ Descending'}
          </button>
        </div>
      </div>
      
      {sortedTasks.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400 mb-4">No tasks found</p>
          {searchTerm || filter !== 'all' ? (
            <button
              onClick={() => {
                setSearchTerm('');
                setFilter('all');
              }}
              className="text-blue-500 hover:text-blue-700"
            >
              Clear filters
            </button>
          ) : null}
        </div>
      ) : (
        <div className="space-y-4">
          {sortedTasks.map(task => (
            <Link
              key={task.id}
              to={`/tasks/${task.id}`}
              className={`block rounded-lg border ${
                darkMode ? 'bg-gray-700 border-gray-600 hover:bg-gray-600' : 'bg-white border-gray-200 hover:bg-gray-50'
              } transition duration-150 ease-in-out`}
            >
              <div className="p-4">
                <div className="flex justify-between items-start">
                  <div className="flex items-start space-x-3">
                    <button
                      onClick={(e) => handleToggleStatus(e, task.id)}
                      className={`mt-1 flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center ${
                        task.status === 'Completed'
                          ? 'bg-green-500 text-white'
                          : `border ${darkMode ? 'border-gray-400' : 'border-gray-300'}`
                      }`}
                    >
                      {task.status === 'Completed' && <FaCheck className="text-xs" />}
                    </button>
                    <div>
                      <h3 className={`font-medium ${task.status === 'Completed' ? 'line-through text-gray-500' : ''}`}>
                        {task.title}
                      </h3>
                      {task.description && (
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
                          {task.description}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {task.priority && (
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        task.priority === 'High' 
                          ? 'bg-red-100 text-red-800' 
                          : task.priority === 'Medium'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-green-100 text-green-800'
                      }`}>
                        {task.priority}
                      </span>
                    )}
                    <button
                      onClick={(e) => handleDelete(e, task.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
                <div className="mt-2 flex flex-wrap items-center text-xs text-gray-500 dark:text-gray-400 space-x-4">
                  {task.category && (
                    <span className="flex items-center">
                      Category: {task.category}
                    </span>
                  )}
                  {task.dueDate && (
                    <span className="flex items-center">
                      <FaHourglass className="mr-1" />
                      Due: {formatDate(task.dueDate)}
                    </span>
                  )}
                  {task.status === 'Pending' && task.dueDate && new Date(task.dueDate) < new Date() && (
                    <span className="text-red-500">Overdue</span>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default TaskList;