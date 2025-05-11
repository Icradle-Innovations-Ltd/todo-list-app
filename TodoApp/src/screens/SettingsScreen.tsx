import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { 
  Text, 
  List, 
  Switch, 
  Divider, 
  Button, 
  useTheme, 
  RadioButton, 
  Dialog, 
  Portal,
  IconButton,
  Avatar
} from 'react-native-paper';
import { useThemeStore } from '../store/themeStore';
import { useAuthStore } from '../store/authStore';
import { useTaskStore } from '../store/taskStore';
import * as Haptics from 'expo-haptics';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SettingsScreen = () => {
  const theme = useTheme();
  const { mode, setMode, toggleMode, isDarkMode } = useThemeStore();
  const { user, logout } = useAuthStore();
  const { deleteCompletedTasks } = useTaskStore();
  
  // Dialog states
  const [clearCompletedDialogVisible, setClearCompletedDialogVisible] = useState(false);
  const [clearAllDataDialogVisible, setClearAllDataDialogVisible] = useState(false);
  const [themeDialogVisible, setThemeDialogVisible] = useState(false);
  
  // Handle theme change
  const handleThemeChange = (newMode: 'light' | 'dark' | 'system') => {
    setMode(newMode);
    setThemeDialogVisible(false);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };
  
  // Handle clearing completed tasks
  const handleClearCompletedTasks = () => {
    deleteCompletedTasks();
    setClearCompletedDialogVisible(false);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };
  
  // Handle clearing all app data
  const handleClearAllData = async () => {
    try {
      await AsyncStorage.clear();
      setClearAllDataDialogVisible(false);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      // Force reload the app
      logout();
    } catch (error) {
      console.error('Error clearing app data:', error);
    }
  };
  
  return (
    <View style={styles.container}>
      <ScrollView>
        {/* User Section */}
        <View style={styles.userSection}>
          <Avatar.Text 
            size={60} 
            label={user?.username.substring(0, 2).toUpperCase() || 'U'} 
            backgroundColor={theme.colors.primary}
          />
          <View style={styles.userInfo}>
            <Text variant="headlineSmall">{user?.username || 'User'}</Text>
            <Text variant="bodyMedium">{user?.email || 'No email'}</Text>
          </View>
        </View>
        
        <Divider />
        
        {/* Appearance Section */}
        <List.Section>
          <List.Subheader>Appearance</List.Subheader>
          
          <List.Item
            title="Theme"
            description={mode.charAt(0).toUpperCase() + mode.slice(1)}
            left={props => <List.Icon {...props} icon="theme-light-dark" />}
            right={props => <IconButton {...props} icon="chevron-right" onPress={() => setThemeDialogVisible(true)} />}
            onPress={() => setThemeDialogVisible(true)}
          />
          
          <List.Item
            title="Toggle Theme"
            description="Quickly switch between light, dark, and system themes"
            left={props => <List.Icon {...props} icon="brightness-6" />}
            right={props => <IconButton {...props} icon="sync" onPress={toggleMode} />}
            onPress={toggleMode}
          />
        </List.Section>
        
        <Divider />
        
        {/* Data Management Section */}
        <List.Section>
          <List.Subheader>Data Management</List.Subheader>
          
          <List.Item
            title="Clear Completed Tasks"
            description="Remove all completed tasks from the app"
            left={props => <List.Icon {...props} icon="check-circle-outline" />}
            onPress={() => setClearCompletedDialogVisible(true)}
          />
          
          <List.Item
            title="Clear All App Data"
            description="Reset the app to its initial state (Warning: This cannot be undone)"
            left={props => <List.Icon {...props} icon="delete-forever" color={theme.colors.error} />}
            onPress={() => setClearAllDataDialogVisible(true)}
          />
        </List.Section>
        
        <Divider />
        
        {/* About Section */}
        <List.Section>
          <List.Subheader>About</List.Subheader>
          
          <List.Item
            title="Version"
            description="1.0.0"
            left={props => <List.Icon {...props} icon="information-outline" />}
          />
          
          <List.Item
            title="Licenses"
            description="Open source licenses"
            left={props => <List.Icon {...props} icon="license" />}
          />
        </List.Section>
        
        {/* Logout Button */}
        <View style={styles.logoutContainer}>
          <Button 
            mode="outlined" 
            icon="logout" 
            onPress={logout}
            style={styles.logoutButton}
            textColor={theme.colors.error}
          >
            Logout
          </Button>
        </View>
      </ScrollView>
      
      {/* Theme Selection Dialog */}
      <Portal>
        <Dialog visible={themeDialogVisible} onDismiss={() => setThemeDialogVisible(false)}>
          <Dialog.Title>Choose Theme</Dialog.Title>
          <Dialog.Content>
            <RadioButton.Group onValueChange={value => handleThemeChange(value as 'light' | 'dark' | 'system')} value={mode}>
              <RadioButton.Item label="Light" value="light" />
              <RadioButton.Item label="Dark" value="dark" />
              <RadioButton.Item label="System Default" value="system" />
            </RadioButton.Group>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setThemeDialogVisible(false)}>Cancel</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
      
      {/* Clear Completed Tasks Dialog */}
      <Portal>
        <Dialog visible={clearCompletedDialogVisible} onDismiss={() => setClearCompletedDialogVisible(false)}>
          <Dialog.Title>Clear Completed Tasks</Dialog.Title>
          <Dialog.Content>
            <Text>Are you sure you want to remove all completed tasks? This action cannot be undone.</Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setClearCompletedDialogVisible(false)}>Cancel</Button>
            <Button onPress={handleClearCompletedTasks}>Clear</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
      
      {/* Clear All Data Dialog */}
      <Portal>
        <Dialog visible={clearAllDataDialogVisible} onDismiss={() => setClearAllDataDialogVisible(false)}>
          <Dialog.Title>Clear All App Data</Dialog.Title>
          <Dialog.Content>
            <Text>Are you sure you want to clear all app data? This will reset the app to its initial state and log you out. This action cannot be undone.</Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setClearAllDataDialogVisible(false)}>Cancel</Button>
            <Button textColor={theme.colors.error} onPress={handleClearAllData}>Reset App</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  userSection: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  userInfo: {
    marginLeft: 16,
  },
  logoutContainer: {
    padding: 16,
    marginTop: 16,
    marginBottom: 32,
  },
  logoutButton: {
    borderColor: '#F44336',
  },
});

export default SettingsScreen;