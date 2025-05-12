import React, { useState, useRef } from 'react';
import { View, StyleSheet, Dimensions, FlatList } from 'react-native';
import { Text, Button, useTheme } from 'react-native-paper';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  interpolate,
  Extrapolate
} from 'react-native-reanimated';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { 
  OnboardingImage1, 
  OnboardingImage2, 
  OnboardingImage3, 
  OnboardingImage4 
} from '../components/SimpleOnboardingImages';

const { width, height } = Dimensions.get('window');

const onboardingData = [
  {
    id: '1',
    title: 'Welcome to Todo App',
    description: 'The most powerful and intuitive task management app to help you stay organized.',
    imageComponent: OnboardingImage1,
  },
  {
    id: '2',
    title: 'Organize Your Tasks',
    description: 'Create categories, set priorities, and add due dates to keep your tasks organized.',
    imageComponent: OnboardingImage2,
  },
  {
    id: '3',
    title: 'Set Reminders',
    description: 'Never miss a deadline with customizable reminders and notifications.',
    imageComponent: OnboardingImage3,
  },
  {
    id: '4',
    title: 'Track Your Progress',
    description: 'View detailed analytics and charts to track your productivity over time.',
    imageComponent: OnboardingImage4,
  },
];

const OnboardingScreen = () => {
  const theme = useTheme();
  const navigation = useNavigation();
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);
  const scrollX = useSharedValue(0);
  
  const onViewableItemsChanged = useRef(({ viewableItems }: any) => {
    if (viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index);
    }
  }).current;

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 50,
  }).current;

  const handleNext = () => {
    if (currentIndex < onboardingData.length - 1) {
      flatListRef.current?.scrollToIndex({
        index: currentIndex + 1,
        animated: true,
      });
    } else {
      completeOnboarding();
    }
  };

  const handleSkip = () => {
    completeOnboarding();
  };

  const completeOnboarding = async () => {
    try {
      // Set the value in AsyncStorage
      await AsyncStorage.setItem('hasCompletedOnboarding', 'true');
      
      console.log('Onboarding completed, navigating to Register screen...');
      
      // Navigate to the Register screen
      // @ts-ignore - We know this screen exists in our navigation stack
      navigation.navigate('Register');
    } catch (error) {
      console.error('Error saving onboarding status:', error);
    }
  };

  const renderItem = ({ item, index }: any) => {
    const ImageComponent = item.imageComponent;
    return (
      <View style={styles.slide}>
        <ImageComponent 
          size={width * 0.8} 
          primaryColor={theme.colors.primary}
          secondaryColor={theme.colors.secondary}
        />
        <Text style={[styles.title, { color: theme.colors.primary }]}>{item.title}</Text>
        <Text style={styles.description}>{item.description}</Text>
      </View>
    );
  };

  const renderDots = () => {
    return (
      <View style={styles.dotsContainer}>
        {onboardingData.map((_, index) => {
          const animatedDotStyle = useAnimatedStyle(() => {
            const inputRange = [
              (index - 1) * width,
              index * width,
              (index + 1) * width,
            ];
            
            const width = interpolate(
              scrollX.value,
              inputRange,
              [8, 16, 8],
              Extrapolate.CLAMP
            );
            
            const opacity = interpolate(
              scrollX.value,
              inputRange,
              [0.5, 1, 0.5],
              Extrapolate.CLAMP
            );
            
            return {
              width,
              opacity,
              backgroundColor: currentIndex === index 
                ? theme.colors.primary 
                : theme.colors.surfaceVariant,
            };
          });
          
          return (
            <Animated.View
              key={index.toString()}
              style={[styles.dot, animatedDotStyle]}
            />
          );
        })}
      </View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <FlatList
        ref={flatListRef}
        data={onboardingData}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={(event) => {
          scrollX.value = event.nativeEvent.contentOffset.x;
        }}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
      />
      
      {renderDots()}
      
      <View style={styles.buttonContainer}>
        <Button 
          mode="text" 
          onPress={handleSkip}
          style={styles.skipButton}
        >
          Skip
        </Button>
        
        <Button 
          mode="contained" 
          onPress={handleNext}
          style={styles.nextButton}
        >
          {currentIndex === onboardingData.length - 1 ? 'Get Started' : 'Next'}
        </Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  slide: {
    width,
    height: height * 0.8,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  image: {
    width: width * 0.8,
    height: height * 0.4,
    marginBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    opacity: 0.8,
    lineHeight: 24,
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  dot: {
    height: 8,
    width: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  skipButton: {
    alignSelf: 'center',
  },
  nextButton: {
    paddingHorizontal: 24,
  },
});

export default OnboardingScreen;