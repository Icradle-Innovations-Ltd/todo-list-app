import { useState } from 'react';
import { FiCheck, FiTrash2, FiEdit, FiCalendar, FiRepeat } from 'react-icons/fi';
import { PRIORITY_COLORS, CATEGORY_COLORS } from '../constants';

const TaskItem = ({ task, onToggleStatus, onDelete, onEdit }) => {
  const [expanded, setExpanded] = useState(false);

  // Format the due date
  const formatDueDate = (dateString) => {
    if (!dateString) return 'No due date';
    
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  // Get the appropriate color class for priority
  const getPriorityColorClass = (priority) => {
    return PRIORITY_COLORS[priority] || 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
  };

  // Get the appropriate color class for category
  const getCategoryColorClass = (category) => {
    return CATEGORY_COLORS[category] || CATEGORY_COLORS.Other;
  };

  // Toggle the expanded state
  const toggleExpanded = () => {
    setExpanded(!expanded);
  };

  // Parse checklist items
  const checklistItems = task.checklist && Array.isArray(task.checklist) 
    ? task.checklist 
    : [];

  return (
    <div 
      className={`task-item mb-4 ${task.status === 'Completed' ? 'task-item-completed' : ''}`}
    >
      {/* Task Header */}
      <div 
        className="p-4 cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between"
        onClick={toggleExpanded}
      >
        <div className="flex-1">
          <div className="flex items-start">
            <h3 
              className={`text-lg font-medium ${
                task.status === 'Completed' 
                  ? 'text-gray-500 dark:text-gray-400 line-through' 
                  : 'text-gray-800 dark:text-white'
              }`}
            >
              {task.title}
            </h3>
          </div>
          
          <div className="flex flex-wrap gap-2 mt-2">
            {/* Priority Badge */}
            {task.priority && (
              <span className={`badge ${getPriorityColorClass(task.priority)}`}>
                {task.priority}
              </span>
            )}
            
            {/* Category Badge */}
            {task.category && (
              <span className={`badge ${getCategoryColorClass(task.category)}`}>
                {task.category}
              </span>
            )}
            
            {/* Due Date */}
            {task.dueDate && (
              <span className="badge bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300 flex items-center">
                <FiCalendar className="mr-1" size={12} />
                {formatDueDate(task.dueDate)}
              </span>
            )}
            
            {/* Recurring Badge */}
            {task.recurring && task.recurring !== 'None' && (
              <span className="badge bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200 flex items-center">
                <FiRepeat className="mr-1" size={12} />
                {task.recurring}
              </span>
            )}
          </div>
        </div>
        
        <div className="flex items-center mt-3 sm:mt-0">
          {/* Action Buttons */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleStatus(task.id);
            }}
            className="p-2 text-gray-500 hover:text-green-600 dark:text-gray-400 dark:hover:text-green-400 focus:outline-none"
            aria-label={task.status === 'Completed' ? 'Mark as pending' : 'Mark as completed'}
          >
            <FiCheck 
              className={`w-5 h-5 ${task.status === 'Completed' ? 'text-green-600 dark:text-green-400' : ''}`} 
            />
          </button>
          
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit(task);
            }}
            className="p-2 text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 focus:outline-none"
            aria-label="Edit task"
          >
            <FiEdit className="w-5 h-5" />
          </button>
          
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(task.id);
            }}
            className="p-2 text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400 focus:outline-none"
            aria-label="Delete task"
          >
            <FiTrash2 className="w-5 h-5" />
          </button>
        </div>
      </div>
      
      {/* Expanded Content */}
      {expanded && (
        <div className="px-4 pb-4 pt-0 border-t border-gray-200 dark:border-gray-700">
          {/* Description */}
          {task.description && (
            <div className="mb-3">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Description
              </h4>
              <p className="text-gray-600 dark:text-gray-400 whitespace-pre-line">
                {task.description}
              </p>
            </div>
          )}
          
          {/* Checklist */}
          {checklistItems.length > 0 && (
            <div className="mb-3">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Checklist
              </h4>
              <ul className="space-y-1">
                {checklistItems.map((item, index) => (
                  <li 
                    key={index}
                    className="flex items-start"
                  >
                    <span className="inline-flex items-center justify-center w-5 h-5 mr-2 mt-0.5">
                      {item.completed ? (
                        <FiCheck className="w-4 h-4 text-green-600 dark:text-green-400" />
                      ) : (
                        <div className="w-4 h-4 border border-gray-400 dark:border-gray-500 rounded-sm"></div>
                      )}
                    </span>
                    <span className={`${item.completed ? 'line-through text-gray-500 dark:text-gray-400' : 'text-gray-700 dark:text-gray-300'}`}>
                      {item.text}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          {/* Notes */}
          {task.notes && (
            <div className="mb-3">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Notes
              </h4>
              <p className="text-gray-600 dark:text-gray-400 whitespace-pre-line">
                {task.notes}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TaskItem;