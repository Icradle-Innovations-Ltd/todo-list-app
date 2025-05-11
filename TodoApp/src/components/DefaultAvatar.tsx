import React from 'react';
import Svg, { Circle, Path } from 'react-native-svg';

interface DefaultAvatarProps {
  size?: number;
  color?: string;
}

const DefaultAvatar: React.FC<DefaultAvatarProps> = ({ 
  size = 100, 
  color = '#6200ee' 
}) => {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
    >
      <Circle cx="50" cy="50" r="50" fill={color} />
      <Circle cx="50" cy="35" r="18" fill="white" />
      <Path
        d="M50 60 C 30 60 20 80 20 100 L 80 100 C 80 80 70 60 50 60 Z"
        fill="white"
      />
    </Svg>
  );
};

export default DefaultAvatar;