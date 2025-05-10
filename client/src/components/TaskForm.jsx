import { useState, useEffect } from 'react';
import { FiPlus, FiX, FiSave, FiTrash2 } from 'react-icons/fi';
import { PRIORITIES, RECURRING_OPTIONS } from '../constants';

const TaskForm = ({ onSubmit, initialTask = null, onCancel }) => {
  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    dueDate: '',
    priority: 'Medium',
    category: '',
    recurring: 'None',
    checklist: [],
    notes: '',
  });

  // New checklist item state
  const [newChecklistItem, setNewChecklistItem] = useState('');

  // Set initial form data if editing a task
  useEffect(() => {
    if (initialTask) {
      setFormData({
        title: initialTask.title || '',
        description: initialTask.description || '',
        dueDate: initialTask.dueDate ? new Date(initialTask.dueDate).toISOString().split('T')[0] : '',
        priority: initialTask.priority || 'Medium',
        category: initialTask.category || '',
        recurring: initialTask.recurring || 'None',
        checklist: Array.isArray(initialTask.checklist) ? initialTask.checklist : [],
        notes: initialTask.notes || '',
      });
    }
  }, [initialTask]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    
    // Reset form if not editing
    if (!initialTask) {
      setFormData({
        title: '',
        description: '',
        dueDate: '',
        priority: 'Medium',
        category: '',
        recurring: 'None',
        checklist: [],
        notes: '',
      });
    }
  };

  // Add a new checklist item
  const addChecklistItem = () => {
    if (newChecklistItem.trim() !== '') {
      setFormData(prev => ({
        ...prev,
        checklist: [...prev.checklist, { text: newChecklistItem, completed: false }]
      }));
      setNewChecklistItem('');
    }
  };

  // Remove a checklist item
  const removeChecklistItem = (index) => {
    setFormData(prev => ({
      ...prev,
      checklist: prev.checklist.filter((_, i) => i !== index)
    }));
  };

  // Toggle checklist item completion
  const toggleChecklistItem = (index) => {
    setFormData(prev => ({
      ...prev,
      checklist: prev.checklist.map((item, i) => 
        i === index ? { ...item, completed: !item.completed } : item
      )
    }));
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
      <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
        {initialTask ? 'Edit Task' : 'Add New Task'}
      </h2>
      
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          {/* Title */}
          <div className="md:col-span-2">
            <label htmlFor="title" className="label">
              Title *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="input"
              placeholder="Enter task title"
              required
            />
          </div>
          
          {/* Description */}
          <div className="md:col-span-2">
            <label htmlFor="description" className="label">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="input min-h-[80px]"
              placeholder="Enter task description"
            ></textarea>
          </div>
          
          {/* Due Date */}
          <div>
            <label htmlFor="dueDate" className="label">
              Due Date
            </label>
            <input
              type="date"
              id="dueDate"
              name="dueDate"
              value={formData.dueDate}
              onChange={handleChange}
              className="input"
            />
          </div>
          
          {/* Priority */}
          <div>
            <label htmlFor="priority" className="label">
              Priority
            </label>
            <select
              id="priority"
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              className="input"
            >
              {PRIORITIES.map(priority => (
                <option key={priority} value={priority}>{priority}</option>
              ))}
            </select>
          </div>
          
          {/* Category */}
          <div>
            <label htmlFor="category" className="label">
              Category
            </label>
            <input
              type="text"
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="input"
              placeholder="e.g., Work, Personal, Shopping"
            />
          </div>
          
          {/* Recurring */}
          <div>
            <label htmlFor="recurring" className="label">
              Recurring
            </label>
            <select
              id="recurring"
              name="recurring"
              value={formData.recurring}
              onChange={handleChange}
              className="input"
            >
              {RECURRING_OPTIONS.map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>
          
          {/* Checklist */}
          <div className="md:col-span-2">
            <label className="label">
              Checklist
            </label>
            <div className="mb-2 flex">
              <input
                type="text"
                value={newChecklistItem}
                onChange={(e) => setNewChecklistItem(e.target.value)}
                className="input mr-2"
                placeholder="Add checklist item"
              />
              <button
                type="button"
                onClick={addChecklistItem}
                className="btn btn-primary"
              >
                <FiPlus className="w-5 h-5" />
              </button>
            </div>
            
            {/* Checklist Items */}
            <ul className="space-y-2 mt-2">
              {formData.checklist.map((item, index) => (
                <li key={index} className="flex items-center bg-gray-50 dark:bg-gray-700 p-2 rounded">
                  <input
                    type="checkbox"
                    checked={item.completed}
                    onChange={() => toggleChecklistItem(index)}
                    className="mr-2 h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <span className={`flex-1 ${item.completed ? 'line-through text-gray-500 dark:text-gray-400' : ''}`}>
                    {item.text}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeChecklistItem(index)}
                    className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                  >
                    <FiTrash2 className="w-4 h-4" />
                  </button>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Notes */}
          <div className="md:col-span-2">
            <label htmlFor="notes" className="label">
              Notes
            </label>
            <textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              className="input min-h-[80px]"
              placeholder="Additional notes"
            ></textarea>
          </div>
        </div>
        
        {/* Form Actions */}
        <div className="flex justify-end space-x-2">
          {initialTask && (
            <button
              type="button"
              onClick={onCancel}
              className="btn btn-secondary"
            >
              Cancel
            </button>
          )}
          
          <button
            type="submit"
            className="btn btn-primary flex items-center"
          >
            <FiSave className="mr-1" />
            {initialTask ? 'Update Task' : 'Add Task'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default TaskForm;