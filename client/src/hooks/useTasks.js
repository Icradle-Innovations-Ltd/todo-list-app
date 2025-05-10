import { useState, useEffect, useCallback } from 'react';
import { taskApi } from '../utils/api';

// Custom hook for task-related API calls
const useTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch all tasks
  const fetchTasks = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await taskApi.getAllTasks();
      setTasks(data);
    } catch (err) {
      setError('Failed to fetch tasks. Please try again later.');
      console.error('Error fetching tasks:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Create a new task
  const createTask = useCallback(async (taskData) => {
    try {
      setLoading(true);
      setError(null);
      const newTask = await taskApi.createTask(taskData);
      setTasks(prevTasks => [newTask, ...prevTasks]);
      return newTask;
    } catch (err) {
      setError('Failed to create task. Please try again.');
      console.error('Error creating task:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Update a task
  const updateTask = useCallback(async (id, taskData) => {
    try {
      setLoading(true);
      setError(null);
      const updatedTask = await taskApi.updateTask(id, taskData);
      setTasks(prevTasks => 
        prevTasks.map(task => task.id === id ? updatedTask : task)
      );
      return updatedTask;
    } catch (err) {
      setError('Failed to update task. Please try again.');
      console.error('Error updating task:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Delete a task
  const deleteTask = useCallback(async (id) => {
    try {
      setLoading(true);
      setError(null);
      await taskApi.deleteTask(id);
      setTasks(prevTasks => prevTasks.filter(task => task.id !== id));
    } catch (err) {
      setError('Failed to delete task. Please try again.');
      console.error('Error deleting task:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Toggle task status
  const toggleTaskStatus = useCallback(async (id) => {
    try {
      setLoading(true);
      setError(null);
      const updatedTask = await taskApi.toggleTaskStatus(id);
      setTasks(prevTasks => 
        prevTasks.map(task => task.id === id ? updatedTask : task)
      );
      return updatedTask;
    } catch (err) {
      setError('Failed to update task status. Please try again.');
      console.error('Error toggling task status:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Export tasks to iCal format
  const exportTasksToIcal = useCallback(() => {
    try {
      taskApi.exportToIcal(tasks);
    } catch (err) {
      setError('Failed to export tasks to calendar. Please try again.');
      console.error('Error exporting tasks to iCal:', err);
    }
  }, [tasks]);

  // Set up reminders for tasks with due dates
  const setupReminders = useCallback(() => {
    // Check if browser notifications are supported
    if (!('Notification' in window)) {
      console.log('This browser does not support notifications');
      return;
    }

    // Request permission for notifications
    if (Notification.permission !== 'granted' && Notification.permission !== 'denied') {
      Notification.requestPermission();
    }

    // Clear any existing reminders
    if (window.taskReminders) {
      window.taskReminders.forEach(reminder => clearTimeout(reminder));
    }
    window.taskReminders = [];

    // Set up reminders for tasks with due dates
    tasks.forEach(task => {
      if (task.dueDate && task.status !== 'Completed') {
        const dueDate = new Date(task.dueDate);
        const now = new Date();
        
        // Set reminder for 1 hour before due date
        const reminderTime = new Date(dueDate.getTime() - 60 * 60 * 1000);
        
        if (reminderTime > now) {
          const timeUntilReminder = reminderTime.getTime() - now.getTime();
          
          const reminderId = setTimeout(() => {
            if (Notification.permission === 'granted') {
              new Notification('Task Reminder', {
                body: `"${task.title}" is due in 1 hour`,
                icon: '/favicon.ico'
              });
            }
          }, timeUntilReminder);
          
          window.taskReminders.push(reminderId);
        }
      }
    });
  }, [tasks]);

  // Fetch tasks on component mount
  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  // Set up reminders whenever tasks change
  useEffect(() => {
    setupReminders();
  }, [setupReminders]);

  return {
    tasks,
    loading,
    error,
    fetchTasks,
    createTask,
    updateTask,
    deleteTask,
    toggleTaskStatus,
    exportTasksToIcal
  };
};

export default useTasks;