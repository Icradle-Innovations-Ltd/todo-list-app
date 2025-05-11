import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Dialog, Portal, TextInput, Button, Text } from 'react-native-paper';

interface PasswordChangeDialogProps {
  visible: boolean;
  onDismiss: () => void;
  onChangePassword: (currentPassword: string, newPassword: string) => void;
}

const PasswordChangeDialog: React.FC<PasswordChangeDialogProps> = ({ 
  visible, 
  onDismiss,
  onChangePassword
}) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = () => {
    // Reset error
    setError('');

    // Validate inputs
    if (!currentPassword) {
      setError('Current password is required');
      return;
    }

    if (!newPassword) {
      setError('New password is required');
      return;
    }

    if (newPassword.length < 6) {
      setError('New password must be at least 6 characters');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    // Call the change password function
    onChangePassword(currentPassword, newPassword);
    
    // Reset form
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  const handleCancel = () => {
    // Reset form
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setError('');
    onDismiss();
  };

  return (
    <Portal>
      <Dialog visible={visible} onDismiss={onDismiss}>
        <Dialog.Title>Change Password</Dialog.Title>
        <Dialog.Content>
          <TextInput
            label="Current Password"
            value={currentPassword}
            onChangeText={setCurrentPassword}
            secureTextEntry={!showCurrentPassword}
            style={styles.input}
            right={
              <TextInput.Icon 
                icon={showCurrentPassword ? "eye-off" : "eye"} 
                onPress={() => setShowCurrentPassword(!showCurrentPassword)} 
              />
            }
          />
          <TextInput
            label="New Password"
            value={newPassword}
            onChangeText={setNewPassword}
            secureTextEntry={!showNewPassword}
            style={styles.input}
            right={
              <TextInput.Icon 
                icon={showNewPassword ? "eye-off" : "eye"} 
                onPress={() => setShowNewPassword(!showNewPassword)} 
              />
            }
          />
          <TextInput
            label="Confirm New Password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry={!showConfirmPassword}
            style={styles.input}
            right={
              <TextInput.Icon 
                icon={showConfirmPassword ? "eye-off" : "eye"} 
                onPress={() => setShowConfirmPassword(!showConfirmPassword)} 
              />
            }
          />
          {error ? <Text style={styles.errorText}>{error}</Text> : null}
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={handleCancel}>Cancel</Button>
          <Button onPress={handleSubmit}>Change Password</Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
};

const styles = StyleSheet.create({
  input: {
    marginBottom: 12,
  },
  errorText: {
    color: 'red',
    marginTop: 8,
  },
});

export default PasswordChangeDialog;