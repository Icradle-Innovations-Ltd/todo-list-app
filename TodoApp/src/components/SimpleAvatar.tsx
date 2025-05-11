import React from 'react';
import { View, StyleSheet, Text } from 'react-native';

interface SimpleAvatarProps {
  size?: number;
  color?: string;
  initials?: string;
}

const SimpleAvatar: React.FC<SimpleAvatarProps> = ({ 
  size = 100, 
  color = '#6200ee',
  initials = 'U'
}) => {
  return (
    <View style={[
      styles.container, 
      { 
        width: size, 
        height: size, 
        borderRadius: size / 2,
        backgroundColor: color 
      }
    ]}>
      <Text style={[
        styles.text, 
        { 
          fontSize: size * 0.4,
          lineHeight: size * 0.45
        }
      ]}>
        {initials}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: 'white',
    fontWeight: 'bold',
  }
});

export default SimpleAvatar;