import React, { useState } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform, TouchableOpacity, ScrollView } from 'react-native';
import { TextInput, Button, Text, useTheme, HelperText, Checkbox } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import { useAuthStore } from '../store/authStore';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { loadSampleData } from '../utils/loadSampleData';

type RegisterScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Register'>;

const RegisterScreen = () => {
  const theme = useTheme();
  const navigation = useNavigation<RegisterScreenNavigationProp>();
  const { register } = useAuthStore();
  
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loadSampleTasks, setLoadSampleTasks] = useState(true);
  
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!username.trim()) {
      newErrors.username = 'Username is required';
    }
    
    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!password.trim()) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleRegister = async () => {
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    
    try {
      const success = await register(username, email, password);
      
      if (success) {
        // If registration was successful and the user wants sample data
        if (loadSampleTasks) {
          await loadSampleData();
        }
      } else {
        setErrors({
          ...errors,
          email: 'Email already in use'
        });
      }
    } catch (err) {
      setErrors({
        ...errors,
        general: 'An error occurred during registration'
      });
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Animated.View 
          style={styles.content}
          entering={FadeInDown.duration(1000).springify()}
        >
          <Text variant="headlineMedium" style={styles.title}>
            Create Account
          </Text>
          
          {errors.general ? (
            <HelperText type="error" visible={!!errors.general}>
              {errors.general}
            </HelperText>
          ) : null}
          
          <TextInput
            label="Username"
            value={username}
            onChangeText={setUsername}
            mode="outlined"
            style={styles.input}
            error={!!errors.username}
          />
          {errors.username ? (
            <HelperText type="error" visible={!!errors.username}>
              {errors.username}
            </HelperText>
          ) : null}
          
          <TextInput
            label="Email"
            value={email}
            onChangeText={setEmail}
            mode="outlined"
            style={styles.input}
            keyboardType="email-address"
            autoCapitalize="none"
            error={!!errors.email}
          />
          {errors.email ? (
            <HelperText type="error" visible={!!errors.email}>
              {errors.email}
            </HelperText>
          ) : null}
          
          <TextInput
            label="Password"
            value={password}
            onChangeText={setPassword}
            mode="outlined"
            style={styles.input}
            secureTextEntry
            error={!!errors.password}
          />
          {errors.password ? (
            <HelperText type="error" visible={!!errors.password}>
              {errors.password}
            </HelperText>
          ) : null}
          
          <TextInput
            label="Confirm Password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            mode="outlined"
            style={styles.input}
            secureTextEntry
            error={!!errors.confirmPassword}
          />
          {errors.confirmPassword ? (
            <HelperText type="error" visible={!!errors.confirmPassword}>
              {errors.confirmPassword}
            </HelperText>
          ) : null}
          
          <View style={styles.checkboxContainer}>
            <Checkbox
              status={loadSampleTasks ? 'checked' : 'unchecked'}
              onPress={() => setLoadSampleTasks(!loadSampleTasks)}
              color={theme.colors.primary}
            />
            <View style={styles.checkboxTextContainer}>
              <Text 
                style={styles.checkboxLabel}
                onPress={() => setLoadSampleTasks(!loadSampleTasks)}
              >
                Add sample tasks to get started
              </Text>
              <Text 
                style={styles.checkboxDescription}
                onPress={() => setLoadSampleTasks(!loadSampleTasks)}
              >
                Includes tasks for work, study, fitness, coding, home, and daily habits
              </Text>
            </View>
          </View>
          
          <Button
            mode="contained"
            onPress={handleRegister}
            loading={isLoading}
            disabled={isLoading}
            style={[styles.button, { backgroundColor: theme.colors.primary }]}
          >
            Register
          </Button>
          
          <View style={styles.loginContainer}>
            <Text variant="bodyMedium">Already have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text 
                variant="bodyMedium" 
                style={{ color: theme.colors.primary, fontWeight: 'bold' }}
              >
                Login
              </Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
  },
  title: {
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
  },
  input: {
    marginBottom: 8,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 12,
    marginBottom: 8,
  },
  checkboxTextContainer: {
    flex: 1,
    marginLeft: 8,
  },
  checkboxLabel: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  checkboxDescription: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  button: {
    marginTop: 16,
    paddingVertical: 8,
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
  },
});

export default RegisterScreen;