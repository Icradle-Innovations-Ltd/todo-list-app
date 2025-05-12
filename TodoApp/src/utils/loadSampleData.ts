import { useTaskStore } from '../store/taskStore';
import { useSubtaskStore } from '../store/subtaskStore';
import { getSampleTasks, getSampleCategories, getSampleSubtasks } from './sampleData';
import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Loads sample data into the app for a new user
 * This includes sample tasks, categories, and subtasks
 */
export const loadSampleData = async (): Promise<void> => {
  try {
    // Check if sample data has already been loaded
    const hasLoadedSampleData = await AsyncStorage.getItem('hasLoadedSampleData');
    
    if (hasLoadedSampleData === 'true') {
      console.log('Sample data already loaded, skipping...');
      return;
    }
    
    console.log('Loading sample data for new user...');
    
    // Get the stores
    const taskStore = useTaskStore.getState();
    const subtaskStore = useSubtaskStore.getState();
    
    // Get sample data
    const sampleCategories = getSampleCategories();
    const sampleTasks = getSampleTasks();
    const sampleSubtasks = getSampleSubtasks();
    
    // Add sample categories
    sampleCategories.forEach(category => {
      taskStore.addCategory(category.name, category.color);
    });
    
    // Add sample tasks
    sampleTasks.forEach(task => {
      const { id, ...taskWithoutId } = task;
      taskStore.addTask(taskWithoutId);
    });
    
    // Add sample subtasks
    sampleSubtasks.forEach(subtask => {
      subtaskStore.addSubtask(subtask.parentId, subtask.title);
      
      // If the subtask is completed, toggle its completion
      if (subtask.completed) {
        // We need to find the actual ID of the subtask that was just added
        const allSubtasks = subtaskStore.getSubtasksForTask(subtask.parentId);
        const newSubtask = allSubtasks.find(s => s.title === subtask.title);
        
        if (newSubtask) {
          subtaskStore.toggleSubtaskCompletion(newSubtask.id);
        }
      }
    });
    
    // Mark sample data as loaded
    await AsyncStorage.setItem('hasLoadedSampleData', 'true');
    
    console.log('Sample data loaded successfully!');
  } catch (error) {
    console.error('Error loading sample data:', error);
  }
};