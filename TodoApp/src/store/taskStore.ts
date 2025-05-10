import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createJSONStorage, persist } from 'zustand/middleware';

export type Priority = 'low' | 'medium' | 'high';
export type RecurrencePattern = 'daily' | 'weekly' | 'monthly' | 'none';

export interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  category?: string;
  dueDate?: Date;
  createdAt: Date;
  priority: Priority;
  recurrence: RecurrencePattern;
  attachments?: string[]; // URLs to images or files
  reminderSet?: boolean;
  reminderTime?: Date;
  lastModified: Date;
}

export interface Category {
  id: string;
  name: string;
  color: string;
}

interface TaskState {
  tasks: Task[];
  categories: Category[];
  isLoading: boolean;
  error: string | null;
  lastSynced: Date | null;
  
  // Task operations
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'lastModified'>) => void;
  updateTask: (id: string, updatedTask: Partial<Omit<Task, 'id' | 'lastModified'>>) => void;
  deleteTask: (id: string) => void;
  toggleTaskCompletion: (id: string) => void;
  
  // Category operations
  addCategory: (name: string, color: string) => void;
  updateCategory: (id: string, name: string, color: string) => void;
  deleteCategory: (id: string) => void;
  
  // Batch operations
  deleteCompletedTasks: () => void;
  
  // Attachment operations
  addAttachment: (taskId: string, attachmentUrl: string) => void;
  removeAttachment: (taskId: string, attachmentUrl: string) => void;
  
  // Reminder operations
  setReminder: (taskId: string, reminderTime: Date) => void;
  removeReminder: (taskId: string) => void;
  
  // Sync operations (mock)
  syncTasks: () => Promise<void>;
}

// Helper to generate a random color
const getRandomColor = () => {
  const colors = [
    '#F44336', '#E91E63', '#9C27B0', '#673AB7', '#3F51B5',
    '#2196F3', '#03A9F4', '#00BCD4', '#009688', '#4CAF50',
    '#8BC34A', '#CDDC39', '#FFEB3B', '#FFC107', '#FF9800',
    '#FF5722', '#795548', '#9E9E9E', '#607D8B'
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};

export const useTaskStore = create<TaskState>()(
  persist(
    (set, get) => ({
      tasks: [],
      categories: [],
      isLoading: false,
      error: null,
      lastSynced: null,
      
      addTask: (task) => 
        set((state) => ({
          tasks: [
            ...state.tasks,
            {
              ...task,
              id: Date.now().toString(),
              createdAt: new Date(),
              lastModified: new Date(),
            },
          ],
        })),
      
      updateTask: (id, updatedTask) =>
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === id 
              ? { 
                  ...task, 
                  ...updatedTask, 
                  lastModified: new Date() 
                } 
              : task
          ),
        })),
      
      deleteTask: (id) =>
        set((state) => ({
          tasks: state.tasks.filter((task) => task.id !== id),
        })),
      
      toggleTaskCompletion: (id) =>
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === id 
              ? { 
                  ...task, 
                  completed: !task.completed,
                  lastModified: new Date()
                } 
              : task
          ),
        })),
      
      addCategory: (name, color) =>
        set((state) => ({
          categories: [
            ...state.categories, 
            { 
              id: Date.now().toString(), 
              name, 
              color: color || getRandomColor() 
            }
          ],
        })),
      
      updateCategory: (id, name, color) =>
        set((state) => ({
          categories: state.categories.map((category) =>
            category.id === id 
              ? { ...category, name, color } 
              : category
          ),
        })),
      
      deleteCategory: (id) =>
        set((state) => {
          const categoryToDelete = state.categories.find(c => c.id === id);
          if (!categoryToDelete) return state;
          
          return {
            categories: state.categories.filter((c) => c.id !== id),
            tasks: state.tasks.map((task) =>
              task.category === categoryToDelete.name 
                ? { ...task, category: undefined, lastModified: new Date() } 
                : task
            ),
          };
        }),
      
      deleteCompletedTasks: () =>
        set((state) => ({
          tasks: state.tasks.filter((task) => !task.completed),
        })),
      
      addAttachment: (taskId, attachmentUrl) =>
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === taskId
              ? {
                  ...task,
                  attachments: [...(task.attachments || []), attachmentUrl],
                  lastModified: new Date()
                }
              : task
          ),
        })),
      
      removeAttachment: (taskId, attachmentUrl) =>
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === taskId && task.attachments
              ? {
                  ...task,
                  attachments: task.attachments.filter(url => url !== attachmentUrl),
                  lastModified: new Date()
                }
              : task
          ),
        })),
      
      setReminder: (taskId, reminderTime) =>
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === taskId
              ? {
                  ...task,
                  reminderSet: true,
                  reminderTime,
                  lastModified: new Date()
                }
              : task
          ),
        })),
      
      removeReminder: (taskId) =>
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === taskId
              ? {
                  ...task,
                  reminderSet: false,
                  reminderTime: undefined,
                  lastModified: new Date()
                }
              : task
          ),
        })),
      
      syncTasks: async () => {
        set({ isLoading: true, error: null });
        
        try {
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 1500));
          
          // In a real app, this would sync with a backend
          set({ 
            lastSynced: new Date(),
            isLoading: false
          });
        } catch (error) {
          set({ 
            error: 'Failed to sync tasks',
            isLoading: false
          });
        }
      },
    }),
    {
      name: 'task-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ 
        tasks: state.tasks, 
        categories: state.categories,
        lastSynced: state.lastSynced
      }),
    }
  )
);