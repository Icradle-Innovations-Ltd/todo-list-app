import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Alert, Linking, useColorScheme as RNUseColorScheme } from 'react-native';
import { 
  Text, 
  Avatar, 
  Button, 
  Card, 
  Switch, 
  TextInput, 
  Divider,
  useTheme,
  IconButton,
  Snackbar,
  SegmentedButtons,
  Portal,
  Dialog
} from 'react-native-paper';
import { useAuthStore } from '../store/authStore';
import * as ImagePicker from 'expo-image-picker';
import { useColorScheme } from 'react-native';
import SimpleAvatar from '../components/SimpleAvatar';
import AboutSection from '../components/AboutSection';
import PasswordChangeDialog from '../components/PasswordChangeDialog';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ProfileScreen = ({ navigation }: any) => {
  const theme = useTheme();
  const colorScheme = RNUseColorScheme();
  const { user, logout, updateUser } = useAuthStore();
  
  // State variables
  const [editing, setEditing] = useState(false);
  const [username, setUsername] = useState(user?.username || '');
  const [email, setEmail] = useState(user?.email || '');
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [darkMode, setDarkMode] = useState(colorScheme === 'dark');
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [taskRemindersEnabled, setTaskRemindersEnabled] = useState(true);
  const [dueDateAlertsEnabled, setDueDateAlertsEnabled] = useState(true);
  const [biometricEnabled, setBiometricEnabled] = useState(useAuthStore.getState().isBiometricEnabled);
  const [autoLockEnabled, setAutoLockEnabled] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [passwordDialogVisible, setPasswordDialogVisible] = useState(false);
  const [deleteAccountDialogVisible, setDeleteAccountDialogVisible] = useState(false);

  // Load saved preferences
  useEffect(() => {
    const loadPreferences = async () => {
      try {
        // Load notification settings
        const notifEnabled = await AsyncStorage.getItem('notificationsEnabled');
        if (notifEnabled !== null) {
          setNotificationsEnabled(notifEnabled === 'true');
        }
        
        const taskReminders = await AsyncStorage.getItem('taskRemindersEnabled');
        if (taskReminders !== null) {
          setTaskRemindersEnabled(taskReminders === 'true');
        }
        
        const dueDateAlerts = await AsyncStorage.getItem('dueDateAlertsEnabled');
        if (dueDateAlerts !== null) {
          setDueDateAlertsEnabled(dueDateAlerts === 'true');
        }
        
        // Load security settings
        const autoLock = await AsyncStorage.getItem('autoLockEnabled');
        if (autoLock !== null) {
          setAutoLockEnabled(autoLock === 'true');
        }
        
        // Load appearance settings
        const darkModePreference = await AsyncStorage.getItem('darkMode');
        if (darkModePreference !== null) {
          setDarkMode(darkModePreference === 'true');
        }
        
        // Load profile image if saved
        const savedProfileImage = await AsyncStorage.getItem('profileImage');
        if (savedProfileImage) {
          setProfileImage(savedProfileImage);
        }
      } catch (error) {
        console.error('Error loading preferences:', error);
      }
    };
    
    loadPreferences();
  }, []);

  // Save notification preferences when they change
  useEffect(() => {
    const saveNotificationPreferences = async () => {
      try {
        await AsyncStorage.setItem('notificationsEnabled', String(notificationsEnabled));
        await AsyncStorage.setItem('taskRemindersEnabled', String(taskRemindersEnabled));
        await AsyncStorage.setItem('dueDateAlertsEnabled', String(dueDateAlertsEnabled));
      } catch (error) {
        console.error('Error saving notification preferences:', error);
      }
    };
    
    saveNotificationPreferences();
  }, [notificationsEnabled, taskRemindersEnabled, dueDateAlertsEnabled]);
  
  // Save security preferences when they change
  useEffect(() => {
    const saveSecurityPreferences = async () => {
      try {
        await AsyncStorage.setItem('autoLockEnabled', String(autoLockEnabled));
      } catch (error) {
        console.error('Error saving security preferences:', error);
      }
    };
    
    saveSecurityPreferences();
  }, [autoLockEnabled]);
  
  // Save appearance preferences when they change
  useEffect(() => {
    const saveAppearancePreferences = async () => {
      try {
        await AsyncStorage.setItem('darkMode', String(darkMode));
      } catch (error) {
        console.error('Error saving appearance preferences:', error);
      }
    };
    
    saveAppearancePreferences();
  }, [darkMode]);

  // Save profile image when it changes
  useEffect(() => {
    const saveProfileImage = async () => {
      if (profileImage) {
        try {
          await AsyncStorage.setItem('profileImage', profileImage);
        } catch (error) {
          console.error('Error saving profile image:', error);
        }
      }
    };
    
    saveProfileImage();
  }, [profileImage]);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert('Permission Required', 'Please grant camera roll permissions to change your profile picture.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaType.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });

    if (!result.canceled) {
      setProfileImage(result.assets[0].uri);
      showSnackbar('Profile picture updated');
    }
  };

  const handleSaveProfile = () => {
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showSnackbar('Please enter a valid email address');
      return;
    }

    // Validate username
    if (username.trim().length < 3) {
      showSnackbar('Username must be at least 3 characters');
      return;
    }

    // In a real app, this would update the user profile on the server
    updateUser({
      ...user,
      username,
      email
    });
    
    showSnackbar('Profile updated successfully');
    setEditing(false);
  };

  const handleChangePassword = (currentPassword: string, newPassword: string) => {
    // In a real app, this would verify the current password and update with the new one
    setPasswordDialogVisible(false);
    showSnackbar('Password changed successfully');
  };

  const toggleBiometric = () => {
    const newValue = !biometricEnabled;
    setBiometricEnabled(newValue);
    if (newValue) {
      useAuthStore.getState().enableBiometric();
      showSnackbar('Biometric authentication enabled');
    } else {
      useAuthStore.getState().disableBiometric();
      showSnackbar('Biometric authentication disabled');
    }
  };

  const toggleDarkMode = () => {
    const newValue = !darkMode;
    setDarkMode(newValue);
    // In a real app, this would update the app's theme
    showSnackbar(`${newValue ? 'Dark' : 'Light'} mode enabled`);
  };

  const toggleNotifications = () => {
    const newValue = !notificationsEnabled;
    setNotificationsEnabled(newValue);
    
    // If notifications are disabled, also disable sub-settings
    if (!newValue) {
      setTaskRemindersEnabled(false);
      setDueDateAlertsEnabled(false);
    }
    
    showSnackbar(`Notifications ${newValue ? 'enabled' : 'disabled'}`);
  };
  
  const toggleTaskReminders = () => {
    const newValue = !taskRemindersEnabled;
    setTaskRemindersEnabled(newValue);
    showSnackbar(`Task reminders ${newValue ? 'enabled' : 'disabled'}`);
  };
  
  const toggleDueDateAlerts = () => {
    const newValue = !dueDateAlertsEnabled;
    setDueDateAlertsEnabled(newValue);
    showSnackbar(`Due date alerts ${newValue ? 'enabled' : 'disabled'}`);
  };
  
  const toggleAutoLock = () => {
    const newValue = !autoLockEnabled;
    setAutoLockEnabled(newValue);
    showSnackbar(`Auto-lock ${newValue ? 'enabled' : 'disabled'}`);
  };

  const showSnackbar = (message: string) => {
    setSnackbarMessage(message);
    setSnackbarVisible(true);
  };

  const handleDeleteAccount = () => {
    setDeleteAccountDialogVisible(false);
    // In a real app, this would delete the user's account
    logout();
    showSnackbar('Account deleted successfully');
  };

  return (
    <View style={styles.mainContainer}>
      <SegmentedButtons
        value={activeTab}
        onValueChange={setActiveTab}
        buttons={[
          { value: 'profile', label: 'Profile' },
          { value: 'settings', label: 'Settings' },
          { value: 'about', label: 'About' },
        ]}
        style={styles.segmentedButtons}
      />
      
      {activeTab === 'profile' && (
        <ScrollView 
          style={styles.container}
          contentContainerStyle={styles.profileContentContainer}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <View style={styles.avatarWrapper}>
              <View style={styles.avatarContainer}>
                {profileImage ? (
                  <Avatar.Image 
                    size={100} 
                    source={{ uri: profileImage }} 
                  />
                ) : (
                  <SimpleAvatar 
                    size={100} 
                    color={theme.colors.primary} 
                    initials={user?.username?.charAt(0).toUpperCase() || 'U'} 
                  />
                )}
              </View>
              <View style={styles.cameraButtonContainer}>
                <IconButton
                  icon="camera"
                  size={20}
                  style={styles.cameraButton}
                  onPress={pickImage}
                  iconColor="#ffffff"
                />
              </View>
            </View>
            <Text style={[styles.name, { color: theme.colors.primary }]}>{user?.username}</Text>
            <Text style={styles.email}>{user?.email}</Text>
          </View>

          <Card style={styles.card}>
            <Card.Title title="Personal Information" />
            <Card.Content>
              {editing ? (
                <>
                  <TextInput
                    label="Username"
                    value={username}
                    onChangeText={setUsername}
                    style={styles.input}
                    mode="outlined"
                    autoCapitalize="none"
                  />
                  <TextInput
                    label="Email"
                    value={email}
                    onChangeText={setEmail}
                    style={styles.input}
                    keyboardType="email-address"
                    mode="outlined"
                    autoCapitalize="none"
                  />
                  <View style={styles.buttonRow}>
                    <Button 
                      mode="outlined" 
                      onPress={() => setEditing(false)}
                      style={styles.button}
                    >
                      Cancel
                    </Button>
                    <Button 
                      mode="contained" 
                      onPress={handleSaveProfile}
                      style={styles.button}
                    >
                      Save
                    </Button>
                  </View>
                </>
              ) : (
                <>
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Username:</Text>
                    <Text style={styles.infoValue}>{user?.username}</Text>
                  </View>
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Email:</Text>
                    <Text style={styles.infoValue}>{user?.email}</Text>
                  </View>
                  <Button 
                    mode="contained" 
                    onPress={() => setEditing(true)}
                    style={styles.editButton}
                    icon="account-edit"
                  >
                    Edit Profile
                  </Button>
                </>
              )}
            </Card.Content>
          </Card>

          <Card style={styles.card}>
            <Card.Title title="Account Security" />
            <Card.Content>
              <Button 
                mode="outlined" 
                icon="lock-reset" 
                onPress={() => setPasswordDialogVisible(true)}
                style={styles.accountButton}
                contentStyle={styles.accountButtonContent}
              >
                Change Password
              </Button>
              <Button 
                mode="outlined" 
                icon="logout" 
                onPress={() => {
                  Alert.alert(
                    'Confirm Logout',
                    'Are you sure you want to log out?',
                    [
                      { text: 'Cancel', style: 'cancel' },
                      { text: 'Logout', onPress: logout }
                    ]
                  );
                }}
                style={styles.accountButton}
                contentStyle={styles.accountButtonContent}
              >
                Logout
              </Button>
              <Button 
                mode="outlined" 
                icon="account-remove" 
                onPress={() => setDeleteAccountDialogVisible(true)}
                style={styles.accountButton}
                textColor={theme.colors.error}
                contentStyle={styles.accountButtonContent}
              >
                Delete Account
              </Button>
            </Card.Content>
          </Card>
          
          {/* Extra space at the bottom to ensure content isn't covered by navigation */}
          <View style={styles.bottomSpacer} />
        </ScrollView>
      )}

      {activeTab === 'settings' && (
        <ScrollView 
          style={styles.container}
          contentContainerStyle={styles.settingsContentContainer}
          showsVerticalScrollIndicator={false}
        >
          <Card style={styles.card}>
            <Card.Title title="Appearance" />
            <Card.Content>
              <View style={styles.settingRow}>
                <Text style={styles.settingLabel}>Dark Mode</Text>
                <Switch 
                  value={darkMode} 
                  onValueChange={toggleDarkMode} 
                />
              </View>
            </Card.Content>
          </Card>

          <Card style={styles.card}>
            <Card.Title title="Notifications" />
            <Card.Content>
              <View style={styles.settingRow}>
                <Text style={styles.settingLabel}>Enable Notifications</Text>
                <Switch 
                  value={notificationsEnabled} 
                  onValueChange={toggleNotifications} 
                />
              </View>
              {notificationsEnabled && (
                <>
                  <Divider style={styles.divider} />
                  <View style={styles.settingRow}>
                    <Text style={styles.settingLabel}>Task Reminders</Text>
                    <Switch 
                      value={taskRemindersEnabled} 
                      onValueChange={toggleTaskReminders}
                      disabled={!notificationsEnabled}
                    />
                  </View>
                  <Divider style={styles.divider} />
                  <View style={styles.settingRow}>
                    <Text style={styles.settingLabel}>Due Date Alerts</Text>
                    <Switch 
                      value={dueDateAlertsEnabled} 
                      onValueChange={toggleDueDateAlerts}
                      disabled={!notificationsEnabled}
                    />
                  </View>
                </>
              )}
            </Card.Content>
          </Card>

          <Card style={styles.card}>
            <Card.Title title="Security" />
            <Card.Content>
              <View style={styles.settingRow}>
                <Text style={styles.settingLabel}>Biometric Authentication</Text>
                <Switch 
                  value={biometricEnabled} 
                  onValueChange={toggleBiometric} 
                />
              </View>
              <Divider style={styles.divider} />
              <View style={styles.settingRow}>
                <Text style={styles.settingLabel}>Auto-lock App</Text>
                <Switch 
                  value={autoLockEnabled} 
                  onValueChange={toggleAutoLock}
                />
              </View>
            </Card.Content>
          </Card>

          <Card style={styles.card}>
            <Card.Title title="Data & Storage" />
            <Card.Content>
              <Button 
                mode="outlined" 
                icon="database-export" 
                onPress={() => showSnackbar('Data export feature would be implemented in a real app')}
                style={styles.accountButton}
              >
                Export Data
              </Button>
              <Button 
                mode="outlined" 
                icon="delete-sweep" 
                onPress={() => {
                  Alert.alert(
                    'Clear App Data',
                    'This will remove all your tasks and settings. This action cannot be undone.',
                    [
                      { text: 'Cancel', style: 'cancel' },
                      { 
                        text: 'Clear Data', 
                        onPress: () => showSnackbar('Data cleared successfully'),
                        style: 'destructive'
                      }
                    ]
                  );
                }}
                style={styles.accountButton}
                textColor={theme.colors.error}
              >
                Clear App Data
              </Button>
            </Card.Content>
          </Card>
        </ScrollView>
      )}

      <AboutSection visible={activeTab === 'about'} />

      {/* Password Change Dialog */}
      <PasswordChangeDialog
        visible={passwordDialogVisible}
        onDismiss={() => setPasswordDialogVisible(false)}
        onChangePassword={handleChangePassword}
      />

      {/* Delete Account Confirmation Dialog */}
      <Portal>
        <Dialog
          visible={deleteAccountDialogVisible}
          onDismiss={() => setDeleteAccountDialogVisible(false)}
        >
          <Dialog.Title>Delete Account</Dialog.Title>
          <Dialog.Content>
            <Text>
              Are you sure you want to delete your account? This action cannot be undone and all your data will be permanently lost.
            </Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setDeleteAccountDialogVisible(false)}>Cancel</Button>
            <Button onPress={handleDeleteAccount} textColor={theme.colors.error}>Delete</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>

      {/* Snackbar for notifications */}
      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={3000}
        action={{
          label: 'Dismiss',
          onPress: () => setSnackbarVisible(false),
        }}
      >
        {snackbarMessage}
      </Snackbar>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: 16,
  },
  profileContentContainer: {
    paddingBottom: 100, // Add extra padding at the bottom for profile
  },
  settingsContentContainer: {
    paddingBottom: 100, // Add extra padding at the bottom for settings
  },
  segmentedButtons: {
    margin: 16,
  },
  header: {
    alignItems: 'center',
    marginVertical: 20,
  },
  avatarWrapper: {
    position: 'relative',
    marginBottom: 20,
    width: 120,
    height: 120,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  cameraButtonContainer: {
    position: 'absolute',
    bottom: 5,
    right: 5,
  },
  cameraButton: {
    backgroundColor: 'rgba(0,0,0,0.7)',
    margin: 0,
    padding: 0,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  email: {
    fontSize: 16,
    opacity: 0.7,
    marginBottom: 10,
  },
  bottomSpacer: {
    height: 50, // Additional space at the bottom
  },
  card: {
    marginBottom: 16,
    borderRadius: 8,
    elevation: 2,
  },
  input: {
    marginBottom: 16,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  button: {
    flex: 1,
    marginHorizontal: 5,
    borderRadius: 8,
  },
  editButton: {
    marginTop: 16,
    borderRadius: 8,
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 12,
    alignItems: 'center',
  },
  infoLabel: {
    fontWeight: 'bold',
    width: 100,
    fontSize: 16,
  },
  infoValue: {
    flex: 1,
    fontSize: 16,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  settingLabel: {
    fontSize: 16,
  },
  divider: {
    marginVertical: 8,
  },
  accountButton: {
    marginVertical: 8,
    borderRadius: 8,
  },
  accountButtonContent: {
    height: 48,
    alignItems: 'center',
  },
  socialButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  socialButton: {
    marginBottom: 8,
    flex: 1,
    marginHorizontal: 4,
    borderRadius: 8,
  },
});

export default ProfileScreen;