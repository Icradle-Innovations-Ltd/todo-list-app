import { useMemo } from 'react';

const ProgressTracker = ({ tasks }) => {
  // Calculate progress statistics
  const stats = useMemo(() => {
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(task => task.status === 'Completed').length;
    const completionPercentage = totalTasks > 0 
      ? Math.round((completedTasks / totalTasks) * 100) 
      : 0;
    
    return {
      totalTasks,
      completedTasks,
      completionPercentage
    };
  }, [tasks]);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 mb-6">
      <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
        Progress Tracker
      </h2>
      
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm text-gray-600 dark:text-gray-300">
          Completed: {stats.completedTasks}/{stats.totalTasks} tasks
        </span>
        <span className="text-sm font-medium text-primary-600 dark:text-primary-400">
          {stats.completionPercentage}%
        </span>
      </div>
      
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
        <div 
          className="bg-primary-600 dark:bg-primary-500 h-2.5 rounded-full transition-all duration-500 ease-in-out"
          style={{ width: `${stats.completionPercentage}%` }}
        ></div>
      </div>
      
      {stats.totalTasks === 0 && (
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 italic">
          No tasks yet. Add your first task to start tracking progress!
        </p>
      )}
    </div>
  );
};

export default ProgressTracker;