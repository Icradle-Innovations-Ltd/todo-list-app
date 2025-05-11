import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Appearance } from 'react-native';

type ThemeMode = 'light' | 'dark' | 'system';

interface ThemeState {
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
  toggleMode: () => void;
  isDarkMode: () => boolean;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      mode: 'system' as ThemeMode,
      
      setMode: (mode: ThemeMode) => set({ mode }),
      
      toggleMode: () => {
        const currentMode = get().mode;
        if (currentMode === 'light') {
          set({ mode: 'dark' });
        } else if (currentMode === 'dark') {
          set({ mode: 'system' });
        } else {
          set({ mode: 'light' });
        }
      },
      
      // Method to determine if dark mode is active
      isDarkMode: () => {
        const mode = get().mode;
        if (mode === 'system') {
          return Appearance.getColorScheme() === 'dark';
        }
        return mode === 'dark';
      },
    }),
    {
      name: 'theme-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);