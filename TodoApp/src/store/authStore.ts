import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createJSONStorage, persist } from 'zustand/middleware';
import * as LocalAuthentication from 'expo-local-authentication';

export interface User {
  id: string;
  username: string;
  email: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isBiometricEnabled: boolean;
  
  // Authentication methods
  login: (email: string, password: string) => Promise<boolean>;
  register: (username: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateUser: (updatedUser: User) => void;
  
  // Biometric authentication
  enableBiometric: () => void;
  disableBiometric: () => void;
  authenticateWithBiometric: () => Promise<boolean>;
}

// Mock user database for demo purposes
const MOCK_USERS = [
  {
    id: '1',
    username: 'demo',
    email: 'demo@example.com',
    password: 'password123'
  }
];

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isBiometricEnabled: false,
      
      login: async (email: string, password: string) => {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Find user (in a real app, this would be an API call)
        const user = MOCK_USERS.find(
          u => u.email === email && u.password === password
        );
        
        if (user) {
          const { password, ...userWithoutPassword } = user;
          set({ 
            user: userWithoutPassword, 
            isAuthenticated: true 
          });
          return true;
        }
        
        return false;
      },
      
      register: async (username: string, email: string, password: string) => {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Check if user already exists
        const userExists = MOCK_USERS.some(u => u.email === email);
        
        if (!userExists) {
          // In a real app, this would be an API call to create a user
          const newUser = {
            id: Date.now().toString(),
            username,
            email,
            password
          };
          
          // Add to mock database
          MOCK_USERS.push(newUser);
          
          // Log user in
          const { password: _, ...userWithoutPassword } = newUser;
          set({ 
            user: userWithoutPassword, 
            isAuthenticated: true 
          });
          
          return true;
        }
        
        return false;
      },
      
      logout: () => {
        set({ 
          user: null, 
          isAuthenticated: false 
        });
      },
      
      updateUser: (updatedUser: User) => {
        // Update the user in the store
        set({ user: updatedUser });
        
        // In a real app, this would also update the user in the backend
        // Update the mock user database for demo purposes
        const userIndex = MOCK_USERS.findIndex(u => u.id === updatedUser.id);
        if (userIndex !== -1) {
          MOCK_USERS[userIndex] = {
            ...MOCK_USERS[userIndex],
            username: updatedUser.username,
            email: updatedUser.email
          };
        }
      },
      
      enableBiometric: () => {
        set({ isBiometricEnabled: true });
      },
      
      disableBiometric: () => {
        set({ isBiometricEnabled: false });
      },
      
      authenticateWithBiometric: async () => {
        try {
          const { success } = await LocalAuthentication.authenticateAsync({
            promptMessage: 'Authenticate to access your tasks',
            fallbackLabel: 'Use password'
          });
          
          return success;
        } catch (error) {
          console.error('Biometric authentication error:', error);
          return false;
        }
      }
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ 
        user: state.user, 
        isAuthenticated: state.isAuthenticated,
        isBiometricEnabled: state.isBiometricEnabled
      }),
    }
  )
);