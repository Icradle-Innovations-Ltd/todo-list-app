import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Image, KeyboardAvoidingView, Platform, TouchableOpacity } from 'react-native';
import { TextInput, Button, Text, useTheme, HelperText } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import { useAuthStore } from '../store/authStore';
import * as LocalAuthentication from 'expo-local-authentication';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';

type LoginScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Login'>;

const LoginScreen = () => {
  const theme = useTheme();
  const navigation = useNavigation<LoginScreenNavigationProp>();
  const { login, isBiometricEnabled, authenticateWithBiometric } = useAuthStore();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isBiometricAvailable, setIsBiometricAvailable] = useState(false);
  
  // Check if biometric authentication is available
  useEffect(() => {
    const checkBiometricAvailability = async () => {
      const compatible = await LocalAuthentication.hasHardwareAsync();
      const enrolled = await LocalAuthentication.isEnrolledAsync();
      setIsBiometricAvailable(compatible && enrolled);
    };
    
    checkBiometricAvailability();
  }, []);
  
  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      setError('Email and password are required');
      return;
    }
    
    setIsLoading(true);
    setError('');
    
    try {
      const success = await login(email, password);
      
      if (!success) {
        setError('Invalid email or password');
      }
    } catch (err) {
      setError('An error occurred during login');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleBiometricLogin = async () => {
    if (isBiometricEnabled && isBiometricAvailable) {
      const success = await authenticateWithBiometric();
      
      if (success) {
        // In a real app, you would need to fetch the user's credentials
        // from secure storage and then log them in
        setEmail('demo@example.com');
        setPassword('password123');
        handleLogin();
      }
    }
  };
  
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={styles.content}>
        <Animated.View 
          style={styles.logoContainer}
          entering={FadeInDown.duration(1000).springify()}
        >
          <Image
            source={require('../../assets/icon.png')}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text variant="headlineMedium" style={styles.title}>
            Todo List App
          </Text>
        </Animated.View>
        
        <Animated.View 
          style={styles.formContainer}
          entering={FadeInUp.duration(1000).delay(300).springify()}
        >
          {error ? (
            <HelperText type="error" visible={!!error}>
              {error}
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
          />
          
          <TextInput
            label="Password"
            value={password}
            onChangeText={setPassword}
            mode="outlined"
            style={styles.input}
            secureTextEntry
          />
          
          <Button
            mode="contained"
            onPress={handleLogin}
            loading={isLoading}
            disabled={isLoading}
            style={[styles.button, { backgroundColor: theme.colors.primary }]}
          >
            Login
          </Button>
          
          {isBiometricEnabled && isBiometricAvailable && (
            <TouchableOpacity 
              style={styles.biometricButton}
              onPress={handleBiometricLogin}
            >
              <Text style={{ color: theme.colors.primary }}>
                Login with Biometrics
              </Text>
            </TouchableOpacity>
          )}
          
          <View style={styles.registerContainer}>
            <Text variant="bodyMedium">Don't have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Register')}>
              <Text 
                variant="bodyMedium" 
                style={{ color: theme.colors.primary, fontWeight: 'bold' }}
              >
                Register
              </Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 16,
  },
  title: {
    fontWeight: 'bold',
  },
  formContainer: {
    width: '100%',
  },
  input: {
    marginBottom: 16,
  },
  button: {
    marginTop: 8,
    paddingVertical: 8,
  },
  biometricButton: {
    alignItems: 'center',
    marginTop: 16,
    padding: 8,
  },
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
  },
});

export default LoginScreen;