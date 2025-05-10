import axios from 'axios';

// Create an axios instance with the base URL from environment variables
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api'
});

// API functions for tasks
export const taskApi = {
  // Get all tasks
  getAllTasks: async () => {
    try {
      const response = await api.get('/tasks');
      return response.data;
    } catch (error) {
      console.error('Error fetching tasks:', error);
      throw error;
    }
  },

  // Get a single task by ID
  getTaskById: async (id) => {
    try {
      const response = await api.get(`/tasks/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching task ${id}:`, error);
      throw error;
    }
  },

  // Create a new task
  createTask: async (taskData) => {
    try {
      const response = await api.post('/tasks', taskData);
      return response.data;
    } catch (error) {
      console.error('Error creating task:', error);
      throw error;
    }
  },

  // Update a task
  updateTask: async (id, taskData) => {
    try {
      const response = await api.put(`/tasks/${id}`, taskData);
      return response.data;
    } catch (error) {
      console.error(`Error updating task ${id}:`, error);
      throw error;
    }
  },

  // Delete a task
  deleteTask: async (id) => {
    try {
      const response = await api.delete(`/tasks/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting task ${id}:`, error);
      throw error;
    }
  },

  // Toggle task status
  toggleTaskStatus: async (id) => {
    try {
      const response = await api.patch(`/tasks/${id}/toggle`);
      return response.data;
    } catch (error) {
      console.error(`Error toggling task ${id} status:`, error);
      throw error;
    }
  },

  // Export tasks to iCal format (for calendar integration)
  exportToIcal: (tasks) => {
    // Create iCal content
    let icalContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Todo List App//EN',
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH'
    ];

    // Add each task with a due date as an event
    tasks.forEach(task => {
      if (task.dueDate) {
        const dueDate = new Date(task.dueDate);
        const formattedDate = dueDate.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
        
        icalContent = [
          ...icalContent,
          'BEGIN:VEVENT',
          `UID:${task.id}@todolistapp`,
          `DTSTAMP:${formattedDate}`,
          `DTSTART:${formattedDate}`,
          `SUMMARY:${task.title}`,
          `DESCRIPTION:${task.description || ''}`,
          'END:VEVENT'
        ];
      }
    });

    icalContent.push('END:VCALENDAR');
    
    // Create a Blob with the iCal content
    const blob = new Blob([icalContent.join('\r\n')], { type: 'text/calendar' });
    
    // Create a download link and trigger the download
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'todo-tasks.ics';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
};

export default api;