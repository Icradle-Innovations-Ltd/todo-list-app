import React from 'react';
import { View, StyleSheet, Text } from 'react-native';

interface OnboardingImageProps {
  size?: number;
  primaryColor?: string;
  secondaryColor?: string;
}

// Bright, vibrant colors for each icon
const ICON_COLORS = {
  notepad: '#FF9500',  // Bright orange
  checklist: '#34C759', // Bright green
  clock: '#FF2D55',    // Bright pink
  chart: '#007AFF'     // Bright blue
};

export const OnboardingImage1: React.FC<OnboardingImageProps> = ({ 
  size = 300, 
  primaryColor = '#6200ee',
  secondaryColor = '#03dac6'
}) => {
  return (
    <View style={[styles.container, { width: size, height: size }]}>
      {/* Outer decorative circle */}
      <View style={[styles.outerCircle, { 
        width: size * 0.9, 
        height: size * 0.9, 
        borderColor: ICON_COLORS.notepad 
      }]} />
      
      {/* Inner colored circle with icon */}
      <View style={[styles.innerCircle, { 
        width: size * 0.7, 
        height: size * 0.7, 
        backgroundColor: ICON_COLORS.notepad 
      }]}>
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
      {/* Outer decorative circle */}
      <View style={[styles.outerCircle, { 
        width: size * 0.9, 
        height: size * 0.9, 
        borderColor: ICON_COLORS.checklist 
      }]} />
      
      {/* Inner colored circle with icon */}
      <View style={[styles.innerCircle, { 
        width: size * 0.7, 
        height: size * 0.7, 
        backgroundColor: ICON_COLORS.checklist 
      }]}>
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
      {/* Outer decorative circle */}
      <View style={[styles.outerCircle, { 
        width: size * 0.9, 
        height: size * 0.9, 
        borderColor: ICON_COLORS.clock 
      }]} />
      
      {/* Inner colored circle with icon */}
      <View style={[styles.innerCircle, { 
        width: size * 0.7, 
        height: size * 0.7, 
        backgroundColor: ICON_COLORS.clock 
      }]}>
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
      {/* Outer decorative circle */}
      <View style={[styles.outerCircle, { 
        width: size * 0.9, 
        height: size * 0.9, 
        borderColor: ICON_COLORS.chart 
      }]} />
      
      {/* Inner colored circle with icon */}
      <View style={[styles.innerCircle, { 
        width: size * 0.7, 
        height: size * 0.7, 
        backgroundColor: ICON_COLORS.chart 
      }]}>
        <Text style={styles.emoji}>📊</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  outerCircle: {
    borderRadius: 999,
    borderWidth: 2,
    borderStyle: 'dashed',
    position: 'absolute',
    opacity: 0.7,
  },
  innerCircle: {
    borderRadius: 999,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    opacity: 0.9,
  },
  emoji: {
    fontSize: 100,
  }
});

export default {
  OnboardingImage1,
  OnboardingImage2,
  OnboardingImage3,
  OnboardingImage4
};

export default {
  OnboardingImage1,
  OnboardingImage2,
  OnboardingImage3,
  OnboardingImage4
};

export default {
  OnboardingImage1,
  OnboardingImage2,
  OnboardingImage3,
  OnboardingImage4
};