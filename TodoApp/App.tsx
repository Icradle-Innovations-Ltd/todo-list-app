import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { 
  Provider as PaperProvider, 
  MD3LightTheme, 
  MD3DarkTheme, 
  Appbar,
  ActivityIndicator,
  adaptNavigationTheme
} from 'react-native-paper';
import { useColorScheme, View, StyleSheet, LogBox, AppState } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { 
  DarkTheme as NavigationDarkTheme, 
  DefaultTheme as NavigationDefaultTheme 
} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import HomeScreen from './src/screens/HomeScreen';
import CategoriesScreen from './src/screens/CategoriesScreen';
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import DashboardScreen from './src/screens/DashboardScreen';
import OnboardingScreen from './src/screens/OnboardingScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import NavigationHeader from './src/components/NavigationHeader';
import { useAuthStore } from './src/store/authStore';
import { useThemeStore } from './src/store/themeStore';
import { setupImageCache, clearExpiredCache } from './src/utils/cacheUtils';

// Ignore specific warnings
LogBox.ignoreLogs([
  'Require cycle:', // Ignore require cycle warnings
  'AsyncStorage has been extracted from react-native', // Ignore AsyncStorage migration warning
]);

// Define the navigation stack parameter list
export type RootStackParamList = {
  Onboarding: undefined;
  Login: undefined;
  Register: undefined;
  Home: undefined;
  Categories: undefined;
  Profile: undefined;
  Dashboard: undefined;
  Settings: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

// Adapt navigation themes
const { LightTheme, DarkTheme } = adaptNavigationTheme({
  reactNavigationLight: NavigationDefaultTheme,
  reactNavigationDark: NavigationDarkTheme,
});

// Custom light theme
const CustomLightTheme = {
  ...MD3LightTheme,
  ...LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    ...LightTheme.colors,
    primary: '#6200ee',
    secondary: '#03dac6',
  },
  fonts: {
    ...MD3LightTheme.fonts,
    headlineMedium: {
      fontFamily: 'System',
      fontWeight: 'bold',
      fontSize: 28,
      letterSpacing: 0,
      lineHeight: 36,
    },
  },
};

// Custom dark theme
const CustomDarkTheme = {
  ...MD3DarkTheme,
  ...DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    ...DarkTheme.colors,
    primary: '#bb86fc',
    secondary: '#03dac6',
  },
  fonts: {
    ...MD3DarkTheme.fonts,
    headlineMedium: {
      fontFamily: 'System',
      fontWeight: 'bold',
      fontSize: 28,
      letterSpacing: 0,
      lineHeight: 36,
    },
  },
};

export default function App() {
  const deviceColorScheme = useColorScheme();
  const { isDarkMode } = useThemeStore();
  const theme = isDarkMode() ? CustomDarkTheme : CustomLightTheme;
  
  const { isAuthenticated, user } = useAuthStore();
  const [isLoading, setIsLoading] = useState(true);
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);
  
  // Function to check onboarding status
  const checkOnboardingStatus = async () => {
    try {
      const value = await AsyncStorage.getItem('hasCompletedOnboarding');
      setHasCompletedOnboarding(value === 'true');
    } catch (error) {
      console.error('Error checking onboarding status:', error);
    }
  };

  // Initialize app - check onboarding status and setup caching
  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Setup image cache
        const cacheSetupSuccess = await setupImageCache();
        
        if (cacheSetupSuccess) {
          // Only try to clear expired cache if setup was successful
          try {
            await clearExpiredCache();
          } catch (cacheError) {
            console.log('Error clearing expired cache:', cacheError);
            // Non-critical error, continue app initialization
          }
        }
        
        // Check onboarding status
        await checkOnboardingStatus();
        
        // Simulate loading state to check authentication (reduced for better UX)
        setTimeout(() => {
          setIsLoading(false);
        }, 500);
      } catch (error) {
        console.error('Error during app initialization:', error);
        // Even if there's an error, we should still show the app
        setIsLoading(false);
      }
    };
    
    initializeApp();
  }, []);
  
  // Listen for app state changes to check onboarding status when app comes to foreground
  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextAppState => {
      if (nextAppState === 'active') {
        // App has come to the foreground
        checkOnboardingStatus();
      }
    });

    return () => {
      subscription.remove();
    };
  }, []);
  
  if (isLoading) {
    return (
      <GestureHandlerRootView style={{ flex: 1 }}>
        <PaperProvider theme={theme}>
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={theme.colors.primary} />
          </View>
        </PaperProvider>
      </GestureHandlerRootView>
    );
  }
  
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <PaperProvider theme={theme}>
        <NavigationContainer theme={theme}>
          <StatusBar style={isDarkMode() ? 'light' : 'dark'} />
          <Stack.Navigator
          screenOptions={{
            header: ({ navigation, route, options }) => {
              // Don't show header on auth screens
              if (route.name === 'Login' || route.name === 'Register' || route.name === 'Onboarding') {
                return null;
              }
              
              const title = 
                route.name === 'Home' 
                  ? 'Todo List' 
                  : route.name === 'Categories' 
                    ? 'Categories' 
                    : route.name === 'Settings'
                      ? 'Settings'
                      : options.title;
              
              return (
                <Appbar.Header>
                  {route.name !== 'Home' && (
                    <Appbar.BackAction onPress={() => navigation.goBack()} />
                  )}
                  <Appbar.Content title={title} />
                  {route.name !== 'Home' && (
                    <Appbar.Action 
                      icon="home" 
                      onPress={() => navigation.navigate('Home')} 
                    />
                  )}
                  {route.name === 'Home' && (
                    <>
                      <Appbar.Action 
                        icon="format-list-bulleted" 
                        onPress={() => navigation.navigate('Categories')} 
                      />
                      <Appbar.Action 
                        icon="chart-bar" 
                        onPress={() => navigation.navigate('Dashboard')} 
                      />
                      <Appbar.Action 
                        icon="account" 
                        onPress={() => navigation.navigate('Profile')} 
                      />
                      <Appbar.Action 
                        icon="cog" 
                        onPress={() => navigation.navigate('Settings')} 
                      />
                      <Appbar.Action 
                        icon="logout" 
                        onPress={() => {
                          const { logout } = useAuthStore.getState();
                          if (logout) logout();
                        }} 
                      />
                    </>
                  )}
                </Appbar.Header>
              );
            },
          }}
        >
          {isAuthenticated ? (
            // App screens
            <>
              <Stack.Screen name="Home" component={HomeScreen} />
              <Stack.Screen name="Categories" component={CategoriesScreen} />
              <Stack.Screen name="Profile" component={ProfileScreen} />
              <Stack.Screen name="Dashboard" component={DashboardScreen} />
              <Stack.Screen name="Settings" component={SettingsScreen} />
            </>
          ) : (
            // Auth screens
            <>
              {!hasCompletedOnboarding ? (
                <>
                  <Stack.Screen name="Onboarding" component={OnboardingScreen} />
                  <Stack.Screen name="Register" component={RegisterScreen} />
                  <Stack.Screen name="Login" component={LoginScreen} />
                </>
              ) : (
                <>
                  <Stack.Screen name="Login" component={LoginScreen} />
                  <Stack.Screen name="Register" component={RegisterScreen} />
                </>
              )}
            </>
          )}
        </Stack.Navigator>
      </NavigationContainer>
      </PaperProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
