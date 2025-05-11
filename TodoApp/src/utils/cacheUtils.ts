import * as FileSystem from 'expo-file-system';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Cache configuration
const IMAGE_CACHE_DIRECTORY = `${FileSystem.cacheDirectory}images/`;
const CACHE_EXPIRY = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds

// Create cache directory if it doesn't exist
export const setupImageCache = async () => {
  try {
    const dirInfo = await FileSystem.getInfoAsync(IMAGE_CACHE_DIRECTORY);
    if (!dirInfo.exists) {
      await FileSystem.makeDirectoryAsync(IMAGE_CACHE_DIRECTORY, { intermediates: true });
      console.log('Created image cache directory');
    }
  } catch (error) {
    console.error('Failed to setup image cache directory:', error);
  }
};

// Cache an image from a URL
export const cacheImage = async (url: string): Promise<string> => {
  if (Platform.OS === 'web') {
    return url; // No caching on web
  }
  
  try {
    // Generate a unique filename based on the URL
    const filename = url.split('/').pop() || `image-${Date.now()}`;
    const cacheFilePath = `${IMAGE_CACHE_DIRECTORY}${filename}`;
    
    // Check if the file already exists in cache
    const fileInfo = await FileSystem.getInfoAsync(cacheFilePath);
    
    if (fileInfo.exists) {
      // Check if cache is still valid
      const metadata = await getCacheMetadata(cacheFilePath);
      if (metadata && Date.now() - metadata.timestamp < CACHE_EXPIRY) {
        console.log('Using cached image:', cacheFilePath);
        return `file://${cacheFilePath}`;
      }
    }
    
    // Download and cache the image
    console.log('Downloading and caching image:', url);
    const downloadResult = await FileSystem.downloadAsync(url, cacheFilePath);
    
    if (downloadResult.status === 200) {
      // Save cache metadata
      await saveCacheMetadata(cacheFilePath, { timestamp: Date.now() });
      return `file://${cacheFilePath}`;
    }
    
    return url; // Fallback to original URL if download fails
  } catch (error) {
    console.error('Error caching image:', error);
    return url; // Fallback to original URL
  }
};

// Get all cached images
export const getCachedImages = async (): Promise<string[]> => {
  if (Platform.OS === 'web') {
    return []; // No caching on web
  }
  
  try {
    const files = await FileSystem.readDirectoryAsync(IMAGE_CACHE_DIRECTORY);
    return files.map(file => `${IMAGE_CACHE_DIRECTORY}${file}`);
  } catch (error) {
    console.error('Error getting cached images:', error);
    return [];
  }
};

// Clear expired cache items
export const clearExpiredCache = async (): Promise<void> => {
  if (Platform.OS === 'web') {
    return; // No caching on web
  }
  
  try {
    const files = await FileSystem.readDirectoryAsync(IMAGE_CACHE_DIRECTORY);
    const now = Date.now();
    
    for (const file of files) {
      const filePath = `${IMAGE_CACHE_DIRECTORY}${file}`;
      const metadata = await getCacheMetadata(filePath);
      
      if (metadata && now - metadata.timestamp > CACHE_EXPIRY) {
        console.log('Removing expired cache item:', filePath);
        await FileSystem.deleteAsync(filePath);
      }
    }
  } catch (error) {
    console.error('Error clearing expired cache:', error);
  }
};

// Clear all cached images
export const clearImageCache = async (): Promise<void> => {
  if (Platform.OS === 'web') {
    return; // No caching on web
  }
  
  try {
    await FileSystem.deleteAsync(IMAGE_CACHE_DIRECTORY);
    await setupImageCache(); // Recreate the directory
    console.log('Image cache cleared');
  } catch (error) {
    console.error('Error clearing image cache:', error);
  }
};

// Cache metadata helpers
interface CacheMetadata {
  timestamp: number;
}

const getCacheMetadata = async (filePath: string): Promise<CacheMetadata | null> => {
  try {
    const key = `cache_metadata_${filePath}`;
    const data = await AsyncStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Error getting cache metadata:', error);
    return null;
  }
};

const saveCacheMetadata = async (filePath: string, metadata: CacheMetadata): Promise<void> => {
  try {
    const key = `cache_metadata_${filePath}`;
    await AsyncStorage.setItem(key, JSON.stringify(metadata));
  } catch (error) {
    console.error('Error saving cache metadata:', error);
  }
};