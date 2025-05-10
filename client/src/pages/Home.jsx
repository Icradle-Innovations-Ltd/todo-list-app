import { useState } from 'react';
import TaskForm from '../components/TaskForm';
import TaskList from '../components/TaskList';
import ProgressTracker from '../components/ProgressTracker';
import ThemeToggle from '../components/ThemeToggle';
import useTasks from '../hooks/useTasks';
import { FiGithub } from 'react-icons/fi';

const Home = ({ darkMode, setDarkMode }) => {
  const { 
    tasks, 
    loading, 
    error, 
    createTask, 
    updateTask, 
    deleteTask, 
    toggleTaskStatus,
    exportTasksToIcal
  } = useTasks();

  const [editingTask, setEditingTask] = useState(null);

  // Handle task creation
  const handleCreateTask = async (taskData) => {
    try {
      await createTask(taskData);
    } catch (err) {
      console.error('Error creating task:', err);
    }
  };

  // Handle task update
  const handleUpdateTask = async (taskData) => {
    try {
      await updateTask(editingTask.id, taskData);
      setEditingTask(null);
    } catch (err) {
      console.error('Error updating task:', err);
    }
  };

  // Handle task deletion
  const handleDeleteTask = async (taskId) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await deleteTask(taskId);
      } catch (err) {
        console.error('Error deleting task:', err);
      }
    }
  };

  // Handle task edit
  const handleEditTask = (task) => {
    setEditingTask(task);
    // Scroll to the form
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Cancel editing
  const handleCancelEdit = () => {
    setEditingTask(null);
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-200">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <header className="flex flex-col sm:flex-row sm:items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Todo List App
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Organize your tasks efficiently
            </p>
          </div>
          
          <div className="mt-4 sm:mt-0 flex items-center space-x-4">
            <ThemeToggle darkMode={darkMode} setDarkMode={setDarkMode} />
          </div>
        </header>
        
        {/* Main Content */}
        <main>
          {/* Error Message */}
          {error && (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded" role="alert">
              <p>{error}</p>
            </div>
          )}
          
          {/* Task Form */}
          {editingTask ? (
            <TaskForm 
              onSubmit={handleUpdateTask} 
              initialTask={editingTask}
              onCancel={handleCancelEdit}
            />
          ) : (
            <TaskForm onSubmit={handleCreateTask} />
          )}
          
          {/* Progress Tracker */}
          <ProgressTracker tasks={tasks} />
          
          {/* Task List */}
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
            </div>
          ) : (
            <TaskList 
              tasks={tasks}
              onToggleStatus={toggleTaskStatus}
              onDeleteTask={handleDeleteTask}
              onEditTask={handleEditTask}
              onExportTasks={exportTasksToIcal}
            />
          )}
        </main>
        
        {/* Footer */}
        <footer className="mt-12 pt-6 border-t border-gray-200 dark:border-gray-700">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between">
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              &copy; {new Date().getFullYear()} Todo List App
            </p>
            <div className="mt-2 sm:mt-0">
              <a 
                href="#" 
                className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 text-sm flex items-center"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FiGithub className="mr-1" />
                View on GitHub
              </a>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Home;