import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import Slider from '@react-native-community/slider';

interface CustomColorPickerProps {
  defaultColor: string;
  onColorChange: (color: string) => void;
  style?: any;
}

const CustomColorPicker: React.FC<CustomColorPickerProps> = ({ 
  defaultColor, 
  onColorChange,
  style 
}) => {
  const [color, setColor] = useState(defaultColor);
  const [hsv, setHsv] = useState(toHsv(defaultColor));
  
  // Update color when hsv changes
  useEffect(() => {
    const newColor = fromHsv(hsv);
    setColor(newColor);
    onColorChange(newColor);
  }, [hsv]);
  
  return (
    <View style={[styles.container, style]}>
      <View style={styles.pickerContainer}>
        <RNColorPicker
          color={color}
          onColorChange={(color) => {
            setHsv(color);
            onColorChange(fromHsv(color));
          }}
          style={styles.picker}
          hideSliders
        />
      </View>
      
      <View style={styles.sliderContainer}>
        <Text style={styles.sliderLabel}>Saturation:</Text>
        <Slider
          value={hsv.s}
          onValueChange={(value) => setHsv({ ...hsv, s: value })}
          minimumValue={0}
          maximumValue={1}
          step={0.01}
          minimumTrackTintColor="#3498db"
          maximumTrackTintColor="#bdc3c7"
          thumbTintColor="#2980b9"
          style={styles.slider}
        />
      </View>
      
      <View style={styles.sliderContainer}>
        <Text style={styles.sliderLabel}>Brightness:</Text>
        <Slider
          value={hsv.v}
          onValueChange={(value) => setHsv({ ...hsv, v: value })}
          minimumValue={0}
          maximumValue={1}
          step={0.01}
          minimumTrackTintColor="#3498db"
          maximumTrackTintColor="#bdc3c7"
          thumbTintColor="#2980b9"
          style={styles.slider}
        />
      </View>
      
      <View style={styles.colorPreview}>
        <View 
          style={[
            styles.colorPreviewBox, 
            { backgroundColor: color }
          ]} 
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  pickerContainer: {
    height: 200,
    width: '100%',
  },
  picker: {
    flex: 1,
  },
  sliderContainer: {
    width: '100%',
    marginTop: 16,
  },
  sliderLabel: {
    marginBottom: 4,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  colorPreview: {
    marginTop: 16,
    alignItems: 'center',
  },
  colorPreviewBox: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: '#ddd',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
  },
});

export default CustomColorPicker;