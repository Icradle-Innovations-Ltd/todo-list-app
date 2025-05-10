import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Provider as PaperProvider, MD3LightTheme, Appbar } from 'react-native-paper';
import HomeScreen from './src/screens/HomeScreen';
import CategoriesScreen from './src/screens/CategoriesScreen';

// Define the navigation stack parameter list
export type RootStackParamList = {
  Home: undefined;
  Categories: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

// Custom theme
const theme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: '#6200ee',
    secondary: '#03dac6',
  },
};

export default function App() {
  return (
    <PaperProvider theme={theme}>
      <NavigationContainer>
        <StatusBar style="auto" />
        <Stack.Navigator
          screenOptions={{
            header: ({ navigation, route, options }) => {
              const title = 
                route.name === 'Home' 
                  ? 'Todo List' 
                  : route.name === 'Categories' 
                    ? 'Categories' 
                    : options.title;
              
              return (
                <Appbar.Header>
                  {route.name !== 'Home' && (
                    <Appbar.BackAction onPress={() => navigation.goBack()} />
                  )}
                  <Appbar.Content title={title} />
                  {route.name === 'Home' && (
                    <Appbar.Action 
                      icon="format-list-bulleted" 
                      onPress={() => navigation.navigate('Categories')} 
                    />
                  )}
                </Appbar.Header>
              );
            },
          }}
        >
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Categories" component={CategoriesScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
}
