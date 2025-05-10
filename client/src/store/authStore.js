import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import axios from 'axios';

// Get API URL from environment variables or use default
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// Create auth store with persistence
const useAuthStore = create(
  persist(
    (set, get) => ({
      // State
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      
      // Actions
      register: async (userData) => {
        set({ isLoading: true, error: null });
        try {
          const response = await axios.post(`${API_URL}/auth/register`, userData);
          const { user, token } = response.data;
          
          // Set auth headers for future requests
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          
          set({ 
            user, 
            token, 
            isAuthenticated: true, 
            isLoading: false 
          });
          
          return { success: true };
        } catch (error) {
          set({ 
            isLoading: false, 
            error: error.response?.data?.error || 'Registration failed' 
          });
          return { success: false, error: get().error };
        }
      },
      
      login: async (credentials) => {
        set({ isLoading: true, error: null });
        try {
          const response = await axios.post(`${API_URL}/auth/login`, credentials);
          const { user, token } = response.data;
          
          // Set auth headers for future requests
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          
          set({ 
            user, 
            token, 
            isAuthenticated: true, 
            isLoading: false 
          });
          
          return { success: true };
        } catch (error) {
          set({ 
            isLoading: false, 
            error: error.response?.data?.error || 'Login failed' 
          });
          return { success: false, error: get().error };
        }
      },
      
      logout: () => {
        // Remove auth headers
        delete axios.defaults.headers.common['Authorization'];
        
        set({ 
          user: null, 
          token: null, 
          isAuthenticated: false 
        });
      },
      
      updateProfile: async (profileData) => {
        set({ isLoading: true, error: null });
        try {
          const response = await axios.put(
            `${API_URL}/auth/profile`, 
            profileData,
            { headers: { Authorization: `Bearer ${get().token}` } }
          );
          
          set({ 
            user: response.data.user, 
            isLoading: false 
          });
          
          return { success: true };
        } catch (error) {
          set({ 
            isLoading: false, 
            error: error.response?.data?.error || 'Profile update failed' 
          });
          return { success: false, error: get().error };
        }
      },
      
      changePassword: async (passwordData) => {
        set({ isLoading: true, error: null });
        try {
          await axios.post(
            `${API_URL}/auth/change-password`, 
            passwordData,
            { headers: { Authorization: `Bearer ${get().token}` } }
          );
          
          set({ isLoading: false });
          return { success: true };
        } catch (error) {
          set({ 
            isLoading: false, 
            error: error.response?.data?.error || 'Password change failed' 
          });
          return { success: false, error: get().error };
        }
      },
      
      clearError: () => set({ error: null })
    }),
    {
      name: 'auth-storage', // name of the item in localStorage
      partialize: (state) => ({ 
        user: state.user, 
        token: state.token, 
        isAuthenticated: state.isAuthenticated 
      })
    }
  )
);

// Set default auth header if token exists on app initialization
const { token } = useAuthStore.getState();
if (token) {
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

export default useAuthStore;