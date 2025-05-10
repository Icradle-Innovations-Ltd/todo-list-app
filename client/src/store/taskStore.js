import { create } from 'zustand';
import axios from 'axios';
import useAuthStore from './authStore';

// Get API URL from environment variables or use default
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const useTaskStore = create((set, get) => ({
  // State
  tasks: [],
  isLoading: false,
  error: null,
  statistics: null,
  
  // Actions
  fetchTasks: async () => {
    set({ isLoading: true, error: null });
    try {
      const token = useAuthStore.getState().token;
      if (!token) {
        throw new Error('Authentication required');
      }
      
      const response = await axios.get(`${API_URL}/tasks`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      set({ tasks: response.data, isLoading: false });
    } catch (error) {
      set({ 
        isLoading: false, 
        error: error.response?.data?.error || error.message || 'Failed to fetch tasks' 
      });
      
      // If unauthorized, logout the user
      if (error.response?.status === 401 || error.response?.status === 403) {
        useAuthStore.getState().logout();
      }
    }
  },
  
  fetchTaskById: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const token = useAuthStore.getState().token;
      if (!token) {
        throw new Error('Authentication required');
      }
      
      const response = await axios.get(`${API_URL}/tasks/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      set({ isLoading: false });
      return response.data;
    } catch (error) {
      set({ 
        isLoading: false, 
        error: error.response?.data?.error || error.message || 'Failed to fetch task' 
      });
      
      // If unauthorized, logout the user
      if (error.response?.status === 401 || error.response?.status === 403) {
        useAuthStore.getState().logout();
      }
      
      return null;
    }
  },
  
  createTask: async (taskData) => {
    set({ isLoading: true, error: null });
    try {
      const token = useAuthStore.getState().token;
      if (!token) {
        throw new Error('Authentication required');
      }
      
      const response = await axios.post(`${API_URL}/tasks`, taskData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      set({ 
        tasks: [response.data, ...get().tasks], 
        isLoading: false 
      });
      
      return { success: true, task: response.data };
    } catch (error) {
      set({ 
        isLoading: false, 
        error: error.response?.data?.error || error.message || 'Failed to create task' 
      });
      
      // If unauthorized, logout the user
      if (error.response?.status === 401 || error.response?.status === 403) {
        useAuthStore.getState().logout();
      }
      
      return { success: false, error: get().error };
    }
  },
  
  updateTask: async (id, taskData) => {
    set({ isLoading: true, error: null });
    try {
      const token = useAuthStore.getState().token;
      if (!token) {
        throw new Error('Authentication required');
      }
      
      const response = await axios.put(`${API_URL}/tasks/${id}`, taskData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      set({ 
        tasks: get().tasks.map(task => 
          task.id === id ? response.data : task
        ), 
        isLoading: false 
      });
      
      return { success: true, task: response.data };
    } catch (error) {
      set({ 
        isLoading: false, 
        error: error.response?.data?.error || error.message || 'Failed to update task' 
      });
      
      // If unauthorized, logout the user
      if (error.response?.status === 401 || error.response?.status === 403) {
        useAuthStore.getState().logout();
      }
      
      return { success: false, error: get().error };
    }
  },
  
  deleteTask: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const token = useAuthStore.getState().token;
      if (!token) {
        throw new Error('Authentication required');
      }
      
      await axios.delete(`${API_URL}/tasks/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      set({ 
        tasks: get().tasks.filter(task => task.id !== id), 
        isLoading: false 
      });
      
      return { success: true };
    } catch (error) {
      set({ 
        isLoading: false, 
        error: error.response?.data?.error || error.message || 'Failed to delete task' 
      });
      
      // If unauthorized, logout the user
      if (error.response?.status === 401 || error.response?.status === 403) {
        useAuthStore.getState().logout();
      }
      
      return { success: false, error: get().error };
    }
  },
  
  toggleTaskStatus: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const token = useAuthStore.getState().token;
      if (!token) {
        throw new Error('Authentication required');
      }
      
      const response = await axios.patch(`${API_URL}/tasks/${id}/toggle`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      set({ 
        tasks: get().tasks.map(task => 
          task.id === id ? response.data : task
        ), 
        isLoading: false 
      });
      
      return { success: true, task: response.data };
    } catch (error) {
      set({ 
        isLoading: false, 
        error: error.response?.data?.error || error.message || 'Failed to toggle task status' 
      });
      
      // If unauthorized, logout the user
      if (error.response?.status === 401 || error.response?.status === 403) {
        useAuthStore.getState().logout();
      }
      
      return { success: false, error: get().error };
    }
  },
  
  fetchTaskStatistics: async () => {
    set({ isLoading: true, error: null });
    try {
      const token = useAuthStore.getState().token;
      if (!token) {
        throw new Error('Authentication required');
      }
      
      const response = await axios.get(`${API_URL}/users/task-statistics`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      set({ 
        statistics: response.data, 
        isLoading: false 
      });
      
      return { success: true, statistics: response.data };
    } catch (error) {
      set({ 
        isLoading: false, 
        error: error.response?.data?.error || error.message || 'Failed to fetch statistics' 
      });
      
      // If unauthorized, logout the user
      if (error.response?.status === 401 || error.response?.status === 403) {
        useAuthStore.getState().logout();
      }
      
      return { success: false, error: get().error };
    }
  },
  
  clearError: () => set({ error: null })
}));

export default useTaskStore;