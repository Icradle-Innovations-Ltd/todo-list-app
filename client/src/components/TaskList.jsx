import { useState, useMemo } from 'react';
import { FiSearch, FiCalendar, FiDownload } from 'react-icons/fi';
import TaskItem from './TaskItem';

const TaskList = ({ tasks, onToggleStatus, onDeleteTask, onEditTask, onExportTasks }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterPriority, setFilterPriority] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  // Get unique categories from tasks
  const categories = useMemo(() => {
    const uniqueCategories = [...new Set(tasks.map(task => task.category).filter(Boolean))];
    return uniqueCategories.sort();
  }, [tasks]);

  // Filter tasks based on search term and filters
  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      // Search term filter (title or description)
      const matchesSearch = searchTerm === '' || 
        task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (task.description && task.description.toLowerCase().includes(searchTerm.toLowerCase()));
      
      // Category filter
      const matchesCategory = filterCategory === '' || task.category === filterCategory;
      
      // Priority filter
      const matchesPriority = filterPriority === '' || task.priority === filterPriority;
      
      // Status filter
      const matchesStatus = filterStatus === '' || task.status === filterStatus;
      
      return matchesSearch && matchesCategory && matchesPriority && matchesStatus;
    });
  }, [tasks, searchTerm, filterCategory, filterPriority, filterStatus]);

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Reset all filters
  const resetFilters = () => {
    setSearchTerm('');
    setFilterCategory('');
    setFilterPriority('');
    setFilterStatus('');
  };

  return (
    <div className="mb-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-2 sm:mb-0">
          Tasks
        </h2>
        
        <div className="flex space-x-2">
          <button
            onClick={onExportTasks}
            className="btn btn-secondary flex items-center text-sm"
            aria-label="Export to calendar"
          >
            <FiCalendar className="mr-1" />
            <span className="hidden sm:inline">Export</span>
          </button>
          
          <button
            onClick={resetFilters}
            className="btn btn-secondary text-sm"
            disabled={!searchTerm && !filterCategory && !filterPriority && !filterStatus}
          >
            Reset Filters
          </button>
        </div>
      </div>
      
      {/* Search and Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 mb-4">
        <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-2">
          {/* Search Input */}
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearchChange}
              placeholder="Search tasks..."
              className="input pl-10"
            />
          </div>
          
          {/* Category Filter */}
          <div className="sm:w-40">
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="input"
            >
              <option value="">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
          
          {/* Priority Filter */}
          <div className="sm:w-32">
            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="input"
            >
              <option value="">All Priorities</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>
          
          {/* Status Filter */}
          <div className="sm:w-32">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="input"
            >
              <option value="">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="Completed">Completed</option>
            </select>
          </div>
        </div>
      </div>
      
      {/* Task List */}
      <div className="space-y-4">
        {filteredTasks.length > 0 ? (
          filteredTasks.map(task => (
            <TaskItem
              key={task.id}
              task={task}
              onToggleStatus={onToggleStatus}
              onDelete={onDeleteTask}
              onEdit={onEditTask}
            />
          ))
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 text-center">
            <p className="text-gray-500 dark:text-gray-400">
              {tasks.length > 0 
                ? 'No tasks match your filters. Try adjusting your search or filters.'
                : 'No tasks yet. Add your first task using the form above!'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskList;