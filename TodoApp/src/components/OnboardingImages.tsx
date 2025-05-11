import React from 'react';
import Svg, { Circle, Path, Rect, G, Ellipse } from 'react-native-svg';
import { View } from 'react-native';

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
    <View style={{ width: size, height: size, justifyContent: 'center', alignItems: 'center' }}>
      <Svg width={size * 0.8} height={size * 0.8} viewBox="0 0 100 100">
        <Circle cx="50" cy="50" r="45" fill={primaryColor} opacity="0.2" />
        <Circle cx="50" cy="50" r="30" fill={primaryColor} opacity="0.4" />
        <Path
          d="M40 40 L60 40 L60 60 L40 60 Z"
          stroke={secondaryColor}
          strokeWidth="3"
          fill="none"
        />
        <Path
          d="M45 50 L55 50"
          stroke={secondaryColor}
          strokeWidth="3"
          strokeLinecap="round"
        />
        <Path
          d="M45 45 L55 45"
          stroke={secondaryColor}
          strokeWidth="3"
          strokeLinecap="round"
        />
        <Path
          d="M45 55 L55 55"
          stroke={secondaryColor}
          strokeWidth="3"
          strokeLinecap="round"
        />
      </Svg>
    </View>
  );
};

export const OnboardingImage2: React.FC<OnboardingImageProps> = ({ 
  size = 300, 
  primaryColor = '#6200ee',
  secondaryColor = '#03dac6'
}) => {
  return (
    <View style={{ width: size, height: size, justifyContent: 'center', alignItems: 'center' }}>
      <Svg width={size * 0.8} height={size * 0.8} viewBox="0 0 100 100">
        <Rect x="20" y="30" width="60" height="40" rx="5" fill={primaryColor} opacity="0.2" />
        <Rect x="25" y="35" width="50" height="30" rx="3" fill={primaryColor} opacity="0.4" />
        <Path
          d="M30 45 L40 45"
          stroke={secondaryColor}
          strokeWidth="3"
          strokeLinecap="round"
        />
        <Path
          d="M30 55 L50 55"
          stroke={secondaryColor}
          strokeWidth="3"
          strokeLinecap="round"
        />
        <Circle cx="65" cy="45" r="5" fill={secondaryColor} />
      </Svg>
    </View>
  );
};

export const OnboardingImage3: React.FC<OnboardingImageProps> = ({ 
  size = 300, 
  primaryColor = '#6200ee',
  secondaryColor = '#03dac6'
}) => {
  return (
    <View style={{ width: size, height: size, justifyContent: 'center', alignItems: 'center' }}>
      <Svg width={size * 0.8} height={size * 0.8} viewBox="0 0 100 100">
        <Circle cx="50" cy="50" r="40" fill={primaryColor} opacity="0.2" />
        <Circle cx="50" cy="50" r="30" fill={primaryColor} opacity="0.4" />
        <Path
          d="M50 30 L50 50 L65 65"
          stroke={secondaryColor}
          strokeWidth="3"
          strokeLinecap="round"
          fill="none"
        />
        <Circle cx="50" cy="50" r="5" fill={secondaryColor} />
      </Svg>
    </View>
  );
};

export const OnboardingImage4: React.FC<OnboardingImageProps> = ({ 
  size = 300, 
  primaryColor = '#6200ee',
  secondaryColor = '#03dac6'
}) => {
  return (
    <View style={{ width: size, height: size, justifyContent: 'center', alignItems: 'center' }}>
      <Svg width={size * 0.8} height={size * 0.8} viewBox="0 0 100 100">
        <Rect x="20" y="20" width="60" height="60" rx="5" fill={primaryColor} opacity="0.2" />
        <Path
          d="M30 40 L70 40"
          stroke={secondaryColor}
          strokeWidth="2"
          strokeLinecap="round"
        />
        <Path
          d="M30 50 L70 50"
          stroke={secondaryColor}
          strokeWidth="2"
          strokeLinecap="round"
        />
        <Path
          d="M30 60 L70 60"
          stroke={secondaryColor}
          strokeWidth="2"
          strokeLinecap="round"
        />
        <Path
          d="M30 70 L50 70"
          stroke={secondaryColor}
          strokeWidth="2"
          strokeLinecap="round"
        />
        <Path
          d="M30 30 L40 30 L40 35 L30 35 Z"
          fill={secondaryColor}
        />
        <Path
          d="M45 30 L55 30 L55 35 L45 35 Z"
          fill={secondaryColor}
        />
        <Path
          d="M60 30 L70 30 L70 35 L60 35 Z"
          fill={secondaryColor}
        />
      </Svg>
    </View>
  );
};

export default {
  OnboardingImage1,
  OnboardingImage2,
  OnboardingImage3,
  OnboardingImage4
};