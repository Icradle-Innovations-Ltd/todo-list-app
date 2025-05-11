import React from 'react';
import { View, StyleSheet, Text } from 'react-native';

interface OnboardingImageProps {
  size?: number;
  primaryColor?: string;
  secondaryColor?: string;
}

export const OnboardingImage1: React.FC<OnboardingImageProps> = ({ 
  size = 300, 
  primaryColor = '#6200ee',
  secondaryColor = '#03dac6'
}) => {
  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <View style={[styles.circle, { width: size * 0.8, height: size * 0.8, backgroundColor: primaryColor, opacity: 0.2 }]}>
        <Text style={styles.emoji}>📝</Text>
      </View>
    </View>
  );
};

export const OnboardingImage2: React.FC<OnboardingImageProps> = ({ 
  size = 300, 
  primaryColor = '#6200ee',
  secondaryColor = '#03dac6'
}) => {
  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <View style={[styles.circle, { width: size * 0.8, height: size * 0.8, backgroundColor: primaryColor, opacity: 0.2 }]}>
        <Text style={styles.emoji}>📋</Text>
      </View>
    </View>
  );
};

export const OnboardingImage3: React.FC<OnboardingImageProps> = ({ 
  size = 300, 
  primaryColor = '#6200ee',
  secondaryColor = '#03dac6'
}) => {
  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <View style={[styles.circle, { width: size * 0.8, height: size * 0.8, backgroundColor: primaryColor, opacity: 0.2 }]}>
        <Text style={styles.emoji}>⏰</Text>
      </View>
    </View>
  );
};

export const OnboardingImage4: React.FC<OnboardingImageProps> = ({ 
  size = 300, 
  primaryColor = '#6200ee',
  secondaryColor = '#03dac6'
}) => {
  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <View style={[styles.circle, { width: size * 0.8, height: size * 0.8, backgroundColor: primaryColor, opacity: 0.2 }]}>
        <Text style={styles.emoji}>📊</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  circle: {
    borderRadius: 999,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emoji: {
    fontSize: 80,
  }
});

export default {
  OnboardingImage1,
  OnboardingImage2,
  OnboardingImage3,
  OnboardingImage4
};