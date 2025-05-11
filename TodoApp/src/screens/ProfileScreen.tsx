import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { 
  Text, 
  Avatar, 
  Button, 
  Card, 
  Switch, 
  TextInput, 
  Divider,
  useTheme,
  IconButton
} from 'react-native-paper';
import { useAuthStore } from '../store/authStore';
import * as ImagePicker from 'expo-image-picker';
import { useColorScheme } from 'react-native';
import SimpleAvatar from '../components/SimpleAvatar';

const ProfileScreen = ({ navigation }: any) => {
  const theme = useTheme();
  const { user, logout } = useAuthStore();
  const [editing, setEditing] = useState(false);
  const [username, setUsername] = useState(user?.username || '');
  const [email, setEmail] = useState(user?.email || '');
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [darkMode, setDarkMode] = useState(useColorScheme() === 'dark');
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [biometricEnabled, setBiometricEnabled] = useState(useAuthStore.getState().isBiometricEnabled);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert('Permission Required', 'Please grant camera roll permissions to change your profile picture.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });

    if (!result.canceled) {
      setProfileImage(result.assets[0].uri);
    }
  };

  const handleSaveProfile = () => {
    // In a real app, this would update the user profile on the server
    Alert.alert('Profile Updated', 'Your profile has been updated successfully.');
    setEditing(false);
  };

  const toggleBiometric = () => {
    const newValue = !biometricEnabled;
    setBiometricEnabled(newValue);
    if (newValue) {
      useAuthStore.getState().enableBiometric();
    } else {
      useAuthStore.getState().disableBiometric();
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        {profileImage ? (
          <Avatar.Image 
            size={100} 
            source={{ uri: profileImage }} 
            style={styles.avatar}
          />
        ) : (
          <View style={styles.avatar}>
            <SimpleAvatar 
              size={100} 
              color={theme.colors.primary} 
              initials={user?.username?.charAt(0).toUpperCase() || 'U'} 
            />
          </View>
        )}
        <IconButton
          icon="camera"
          size={20}
          style={styles.cameraButton}
          onPress={pickImage}
        />
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
              />
              <TextInput
                label="Email"
                value={email}
                onChangeText={setEmail}
                style={styles.input}
                keyboardType="email-address"
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
              >
                Edit Profile
              </Button>
            </>
          )}
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Title title="Preferences" />
        <Card.Content>
          <View style={styles.settingRow}>
            <Text>Dark Mode</Text>
            <Switch 
              value={darkMode} 
              onValueChange={() => setDarkMode(!darkMode)} 
            />
          </View>
          <Divider style={styles.divider} />
          <View style={styles.settingRow}>
            <Text>Enable Notifications</Text>
            <Switch 
              value={notificationsEnabled} 
              onValueChange={() => setNotificationsEnabled(!notificationsEnabled)} 
            />
          </View>
          <Divider style={styles.divider} />
          <View style={styles.settingRow}>
            <Text>Biometric Authentication</Text>
            <Switch 
              value={biometricEnabled} 
              onValueChange={toggleBiometric} 
            />
          </View>
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Title title="Account" />
        <Card.Content>
          <Button 
            mode="outlined" 
            icon="lock-reset" 
            onPress={() => Alert.alert('Change Password', 'This feature would allow changing password in a real app.')}
            style={styles.accountButton}
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
            textColor={theme.colors.error}
          >
            Logout
          </Button>
        </Card.Content>
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    alignItems: 'center',
    marginVertical: 20,
  },
  avatar: {
    marginBottom: 10,
  },
  cameraButton: {
    position: 'absolute',
    top: 65,
    right: '40%',
    backgroundColor: 'rgba(0,0,0,0.6)',
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
  card: {
    marginBottom: 16,
  },
  input: {
    marginBottom: 12,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  button: {
    flex: 1,
    marginHorizontal: 5,
  },
  editButton: {
    marginTop: 10,
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  infoLabel: {
    fontWeight: 'bold',
    width: 100,
  },
  infoValue: {
    flex: 1,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  divider: {
    marginVertical: 8,
  },
  accountButton: {
    marginVertical: 8,
  },
});

export default ProfileScreen;