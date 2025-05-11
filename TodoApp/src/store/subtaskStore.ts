import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Subtask {
  id: string;
  parentId: string;
  title: string;
  completed: boolean;
  createdAt: Date;
  lastModified: Date;
}

interface SubtaskState {
  subtasks: Subtask[];
  
  // Subtask operations
  addSubtask: (parentId: string, title: string) => void;
  updateSubtask: (id: string, title: string) => void;
  deleteSubtask: (id: string) => void;
  toggleSubtaskCompletion: (id: string) => void;
  
  // Batch operations
  deleteSubtasksForTask: (parentId: string) => void;
  getSubtasksForTask: (parentId: string) => Subtask[];
  getCompletedSubtaskCount: (parentId: string) => number;
  getTotalSubtaskCount: (parentId: string) => number;
}

export const useSubtaskStore = create<SubtaskState>()(
  persist(
    (set, get) => ({
      subtasks: [],
      
      addSubtask: (parentId, title) => 
        set((state) => ({
          subtasks: [
            ...state.subtasks,
            {
              id: Date.now().toString(),
              parentId,
              title,
              completed: false,
              createdAt: new Date(),
              lastModified: new Date(),
            },
          ],
        })),
      
      updateSubtask: (id, title) =>
        set((state) => ({
          subtasks: state.subtasks.map((subtask) =>
            subtask.id === id 
              ? { 
                  ...subtask, 
                  title,
                  lastModified: new Date() 
                } 
              : subtask
          ),
        })),
      
      deleteSubtask: (id) =>
        set((state) => ({
          subtasks: state.subtasks.filter((subtask) => subtask.id !== id),
        })),
      
      toggleSubtaskCompletion: (id) =>
        set((state) => ({
          subtasks: state.subtasks.map((subtask) =>
            subtask.id === id 
              ? { 
                  ...subtask, 
                  completed: !subtask.completed,
                  lastModified: new Date()
                } 
              : subtask
          ),
        })),
      
      deleteSubtasksForTask: (parentId) =>
        set((state) => ({
          subtasks: state.subtasks.filter((subtask) => subtask.parentId !== parentId),
        })),
      
      getSubtasksForTask: (parentId) => {
        return get().subtasks.filter((subtask) => subtask.parentId === parentId);
      },
      
      getCompletedSubtaskCount: (parentId) => {
        return get().subtasks.filter(
          (subtask) => subtask.parentId === parentId && subtask.completed
        ).length;
      },
      
      getTotalSubtaskCount: (parentId) => {
        return get().subtasks.filter(
          (subtask) => subtask.parentId === parentId
        ).length;
      },
    }),
    {
      name: 'subtask-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);