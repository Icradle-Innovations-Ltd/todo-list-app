import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { FaPlus, FaTrash, FaSpinner } from 'react-icons/fa';
import useTaskStore from '../../store/taskStore';

const TaskForm = ({ task, onTaskCreated, onTaskUpdated, onCancel, darkMode }) => {
  const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm();
  const [checklist, setChecklist] = useState([]);
  const { createTask, updateTask, isLoading, error, clearError } = useTaskStore();
  
  // Initialize form with task data if editing
  useEffect(() => {
    if (task) {
      // Set form values
      setValue('title', task.title);
      setValue('description', task.description || '');
      setValue('dueDate', task.dueDate || '');
      setValue('priority', task.priority || 'Medium');
      setValue('category', task.category || '');
      setValue('recurring', task.recurring || 'None');
      setValue('notes', task.notes || '');
      setValue('status', task.status || 'Pending');
      
      // Set checklist
      if (task.checklist && Array.isArray(task.checklist)) {
        setChecklist(task.checklist);
      } else {
        setChecklist([]);
      }
    }
  }, [task, setValue]);
  
  // Handle form submission
  const onSubmit = async (data) => {
    // Clear any previous errors
    clearError();
    
    // Add checklist to data
    const taskData = {
      ...data,
      checklist
    };
    
    if (task) {
      // Update existing task
      const result = await updateTask(task.id, taskData);
      if (result.success && onTaskUpdated) {
        onTaskUpdated(result.task);
      }
    } else {
      // Create new task
      const result = await createTask(taskData);
      if (result.success && onTaskCreated) {
        onTaskCreated(result.task);
      }
    }
  };
  
  // Add a new checklist item
  const addChecklistItem = () => {
    setChecklist([...checklist, { text: '', completed: false }]);
  };
  
  // Update a checklist item
  const updateChecklistItem = (index, text) => {
    const newChecklist = [...checklist];
    newChecklist[index].text = text;
    setChecklist(newChecklist);
  };
  
  // Toggle a checklist item's completion status
  const toggleChecklistItem = (index) => {
    const newChecklist = [...checklist];
    newChecklist[index].completed = !newChecklist[index].completed;
    setChecklist(newChecklist);
  };
  
  // Remove a checklist item
  const removeChecklistItem = (index) => {
    setChecklist(checklist.filter((_, i) => i !== index));
  };
  
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      {/* Title */}
      <div>
        <label className="block text-sm font-medium mb-1" htmlFor="title">
          Title <span className="text-red-500">*</span>
        </label>
        <input
          id="title"
          type="text"
          className={`w-full px-3 py-2 rounded-lg border ${
            errors.title 
              ? 'border-red-500' 
              : darkMode ? 'bg-gray-700 border-gray-600' : 'border-gray-300'
          } focus:outline-none focus:ring-2 focus:ring-blue-500`}
          placeholder="Task title"
          {...register('title', { required: 'Title is required' })}
        />
        {errors.title && (
          <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>
        )}
      </div>
      
      {/* Description */}
      <div>
        <label className="block text-sm font-medium mb-1" htmlFor="description">
          Description
        </label>
        <textarea
          id="description"
          rows="3"
          className={`w-full px-3 py-2 rounded-lg border ${
            darkMode ? 'bg-gray-700 border-gray-600' : 'border-gray-300'
          } focus:outline-none focus:ring-2 focus:ring-blue-500`}
          placeholder="Task description"
          {...register('description')}
        ></textarea>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Due Date */}
        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="dueDate">
            Due Date
          </label>
          <input
            id="dueDate"
            type="date"
            className={`w-full px-3 py-2 rounded-lg border ${
              darkMode ? 'bg-gray-700 border-gray-600' : 'border-gray-300'
            } focus:outline-none focus:ring-2 focus:ring-blue-500`}
            {...register('dueDate')}
          />
        </div>
        
        {/* Priority */}
        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="priority">
            Priority
          </label>
          <select
            id="priority"
            className={`w-full px-3 py-2 rounded-lg border ${
              darkMode ? 'bg-gray-700 border-gray-600' : 'border-gray-300'
            } focus:outline-none focus:ring-2 focus:ring-blue-500`}
            {...register('priority')}
          >
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
        </div>
        
        {/* Category */}
        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="category">
            Category
          </label>
          <input
            id="category"
            type="text"
            className={`w-full px-3 py-2 rounded-lg border ${
              darkMode ? 'bg-gray-700 border-gray-600' : 'border-gray-300'
            } focus:outline-none focus:ring-2 focus:ring-blue-500`}
            placeholder="e.g. Work, Personal, Health"
            {...register('category')}
          />
        </div>
        
        {/* Recurring */}
        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="recurring">
            Recurring
          </label>
          <select
            id="recurring"
            className={`w-full px-3 py-2 rounded-lg border ${
              darkMode ? 'bg-gray-700 border-gray-600' : 'border-gray-300'
            } focus:outline-none focus:ring-2 focus:ring-blue-500`}
            {...register('recurring')}
          >
            <option value="None">None</option>
            <option value="Daily">Daily</option>
            <option value="Weekly">Weekly</option>
            <option value="Monthly">Monthly</option>
          </select>
        </div>
      </div>
      
      {/* Status (only show when editing) */}
      {task && (
        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="status">
            Status
          </label>
          <select
            id="status"
            className={`w-full px-3 py-2 rounded-lg border ${
              darkMode ? 'bg-gray-700 border-gray-600' : 'border-gray-300'
            } focus:outline-none focus:ring-2 focus:ring-blue-500`}
            {...register('status')}
          >
            <option value="Pending">Pending</option>
            <option value="Completed">Completed</option>
          </select>
        </div>
      )}
      
      {/* Notes */}
      <div>
        <label className="block text-sm font-medium mb-1" htmlFor="notes">
          Notes
        </label>
        <textarea
          id="notes"
          rows="2"
          className={`w-full px-3 py-2 rounded-lg border ${
            darkMode ? 'bg-gray-700 border-gray-600' : 'border-gray-300'
          } focus:outline-none focus:ring-2 focus:ring-blue-500`}
          placeholder="Additional notes"
          {...register('notes')}
        ></textarea>
      </div>
      
      {/* Checklist */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <label className="block text-sm font-medium">Checklist</label>
          <button
            type="button"
            onClick={addChecklistItem}
            className="text-blue-500 hover:text-blue-700 text-sm flex items-center"
          >
            <FaPlus className="mr-1" /> Add Item
          </button>
        </div>
        
        {checklist.length === 0 ? (
          <p className="text-sm text-gray-500 dark:text-gray-400">
            No checklist items. Click "Add Item" to create one.
          </p>
        ) : (
          <ul className="space-y-2">
            {checklist.map((item, index) => (
              <li key={index} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={item.completed}
                  onChange={() => toggleChecklistItem(index)}
                  className="h-4 w-4"
                />
                <input
                  type="text"
                  value={item.text}
                  onChange={(e) => updateChecklistItem(index, e.target.value)}
                  placeholder="Checklist item"
                  className={`flex-grow px-3 py-1 rounded-lg border ${
                    darkMode ? 'bg-gray-700 border-gray-600' : 'border-gray-300'
                  } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                />
                <button
                  type="button"
                  onClick={() => removeChecklistItem(index)}
                  className="text-red-500 hover:text-red-700"
                >
                  <FaTrash />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
      
      {/* Form Actions */}
      <div className="flex justify-end space-x-2 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className={`px-4 py-2 rounded-lg border ${
            darkMode ? 'border-gray-600 hover:bg-gray-700' : 'border-gray-300 hover:bg-gray-100'
          }`}
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center"
        >
          {isLoading ? (
            <>
              <FaSpinner className="animate-spin mr-2" />
              {task ? 'Updating...' : 'Creating...'}
            </>
          ) : (
            <>{task ? 'Update Task' : 'Create Task'}</>
          )}
        </button>
      </div>
    </form>
  );
};

export default TaskForm;