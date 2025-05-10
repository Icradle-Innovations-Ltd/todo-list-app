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
import { useColorScheme, View, StyleSheet } from 'react-native';
import { 
  DarkTheme as NavigationDarkTheme, 
  DefaultTheme as NavigationDefaultTheme 
} from '@react-navigation/native';
import HomeScreen from './src/screens/HomeScreen';
import CategoriesScreen from './src/screens/CategoriesScreen';
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import { useAuthStore } from './src/store/authStore';

// Define the navigation stack parameter list
export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  Home: undefined;
  Categories: undefined;
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
  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? CustomDarkTheme : CustomLightTheme;
  
  const { isAuthenticated, user } = useAuthStore();
  const [isLoading, setIsLoading] = useState(true);
  
  // Simulate loading state to check authentication
  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, []);
  
  if (isLoading) {
    return (
      <PaperProvider theme={theme}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      </PaperProvider>
    );
  }
  
  return (
    <PaperProvider theme={theme}>
      <NavigationContainer theme={theme}>
        <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
        <Stack.Navigator
          screenOptions={{
            header: ({ navigation, route, options }) => {
              // Don't show header on auth screens
              if (route.name === 'Login' || route.name === 'Register') {
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
                  {route.name === 'Home' && (
                    <>
                      <Appbar.Action 
                        icon="format-list-bulleted" 
                        onPress={() => navigation.navigate('Categories')} 
                      />
                      <Appbar.Action 
                        icon="logout" 
                        onPress={() => useAuthStore.getState().logout()} 
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
            </>
          ) : (
            // Auth screens
            <>
              <Stack.Screen name="Login" component={LoginScreen} />
              <Stack.Screen name="Register" component={RegisterScreen} />
            </>
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
