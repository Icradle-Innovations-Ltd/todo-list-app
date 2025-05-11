import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text, Button, ProgressBar, IconButton, useTheme, Card, Dialog, Portal } from 'react-native-paper';
import * as Haptics from 'expo-haptics';

type TimerMode = 'work' | 'shortBreak' | 'longBreak';

interface PomodoroTimerProps {
  onClose: () => void;
}

const PomodoroTimer: React.FC<PomodoroTimerProps> = ({ onClose }) => {
  const theme = useTheme();
  
  // Timer settings (in minutes)
  const [workDuration, setWorkDuration] = useState(25);
  const [shortBreakDuration, setShortBreakDuration] = useState(5);
  const [longBreakDuration, setLongBreakDuration] = useState(15);
  const [pomodorosUntilLongBreak, setPomodorosUntilLongBreak] = useState(4);
  
  // Timer state
  const [timerMode, setTimerMode] = useState<TimerMode>('work');
  const [timeRemaining, setTimeRemaining] = useState(workDuration * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [completedPomodoros, setCompletedPomodoros] = useState(0);
  const [settingsVisible, setSettingsVisible] = useState(false);
  
  // Timer interval ref
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  
  // Get current timer duration based on mode
  const getCurrentDuration = () => {
    switch (timerMode) {
      case 'work':
        return workDuration * 60;
      case 'shortBreak':
        return shortBreakDuration * 60;
      case 'longBreak':
        return longBreakDuration * 60;
    }
  };
  
  // Format time as MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  // Calculate progress (0 to 1)
  const calculateProgress = () => {
    const totalDuration = getCurrentDuration();
    return (totalDuration - timeRemaining) / totalDuration;
  };
  
  // Get color based on timer mode
  const getTimerColor = () => {
    switch (timerMode) {
      case 'work':
        return theme.colors.primary;
      case 'shortBreak':
        return theme.colors.secondary;
      case 'longBreak':
        return theme.colors.tertiary;
    }
  };
  
  // Provide feedback when timer completes
  const provideTimerCompletionFeedback = () => {
    // Just use haptic feedback instead of sound
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };
  
  // Start timer
  const startTimer = () => {
    setIsRunning(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    
    timerRef.current = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          // Timer completed
          clearInterval(timerRef.current!);
          setIsRunning(false);
          
          // Provide feedback
          provideTimerCompletionFeedback();
          
          // Handle timer completion
          handleTimerComplete();
          
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };
  
  // Pause timer
  const pauseTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setIsRunning(false);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };
  
  // Reset timer
  const resetTimer = () => {
    pauseTimer();
    setTimeRemaining(getCurrentDuration());
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  };
  
  // Handle timer completion
  const handleTimerComplete = () => {
    if (timerMode === 'work') {
      // Increment completed pomodoros
      const newCompletedCount = completedPomodoros + 1;
      setCompletedPomodoros(newCompletedCount);
      
      // Determine next break type
      if (newCompletedCount % pomodorosUntilLongBreak === 0) {
        setTimerMode('longBreak');
        setTimeRemaining(longBreakDuration * 60);
      } else {
        setTimerMode('shortBreak');
        setTimeRemaining(shortBreakDuration * 60);
      }
    } else {
      // After break, go back to work
      setTimerMode('work');
      setTimeRemaining(workDuration * 60);
    }
  };
  
  // Switch timer mode manually
  const switchMode = (mode: TimerMode) => {
    pauseTimer();
    setTimerMode(mode);
    
    switch (mode) {
      case 'work':
        setTimeRemaining(workDuration * 60);
        break;
      case 'shortBreak':
        setTimeRemaining(shortBreakDuration * 60);
        break;
      case 'longBreak':
        setTimeRemaining(longBreakDuration * 60);
        break;
    }
    
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };
  
  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);
  
  // Update timer when settings change
  useEffect(() => {
    resetTimer();
  }, [workDuration, shortBreakDuration, longBreakDuration]);
  
  return (
    <Card style={styles.container}>
      <Card.Title 
        title="Pomodoro Timer" 
        subtitle={`${completedPomodoros} pomodoros completed`}
        right={(props) => (
          <View style={styles.headerButtons}>
            <IconButton {...props} icon="cog" onPress={() => setSettingsVisible(true)} />
            <IconButton {...props} icon="close" onPress={onClose} />
          </View>
        )}
      />
      
      <Card.Content>
        {/* Timer Mode Selector */}
        <View style={styles.modeSelector}>
          <TouchableOpacity
            style={[
              styles.modeButton,
              timerMode === 'work' && { backgroundColor: theme.colors.primaryContainer }
            ]}
            onPress={() => switchMode('work')}
          >
            <Text style={[
              styles.modeButtonText,
              timerMode === 'work' && { color: theme.colors.primary }
            ]}>
              Work
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.modeButton,
              timerMode === 'shortBreak' && { backgroundColor: theme.colors.secondaryContainer }
            ]}
            onPress={() => switchMode('shortBreak')}
          >
            <Text style={[
              styles.modeButtonText,
              timerMode === 'shortBreak' && { color: theme.colors.secondary }
            ]}>
              Short Break
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.modeButton,
              timerMode === 'longBreak' && { backgroundColor: theme.colors.tertiaryContainer }
            ]}
            onPress={() => switchMode('longBreak')}
          >
            <Text style={[
              styles.modeButtonText,
              timerMode === 'longBreak' && { color: theme.colors.tertiary }
            ]}>
              Long Break
            </Text>
          </TouchableOpacity>
        </View>
        
        {/* Timer Display */}
        <View style={styles.timerContainer}>
          <Text style={styles.timerText}>{formatTime(timeRemaining)}</Text>
          <ProgressBar
            progress={calculateProgress()}
            color={getTimerColor()}
            style={styles.progressBar}
          />
        </View>
        
        {/* Timer Controls */}
        <View style={styles.controls}>
          {isRunning ? (
            <Button
              mode="contained"
              icon="pause"
              onPress={pauseTimer}
              style={[styles.controlButton, { backgroundColor: getTimerColor() }]}
            >
              Pause
            </Button>
          ) : (
            <Button
              mode="contained"
              icon="play"
              onPress={startTimer}
              style={[styles.controlButton, { backgroundColor: getTimerColor() }]}
            >
              Start
            </Button>
          )}
          
          <Button
            mode="outlined"
            icon="refresh"
            onPress={resetTimer}
            style={styles.controlButton}
          >
            Reset
          </Button>
        </View>
      </Card.Content>
      
      {/* Settings Dialog */}
      <Portal>
        <Dialog visible={settingsVisible} onDismiss={() => setSettingsVisible(false)}>
          <Dialog.Title>Timer Settings</Dialog.Title>
          <Dialog.Content>
            <View style={styles.settingRow}>
              <Text>Work Duration (minutes)</Text>
              <View style={styles.settingControls}>
                <IconButton icon="minus" size={20} onPress={() => setWorkDuration(prev => Math.max(1, prev - 1))} />
                <Text style={styles.settingValue}>{workDuration}</Text>
                <IconButton icon="plus" size={20} onPress={() => setWorkDuration(prev => prev + 1)} />
              </View>
            </View>
            
            <View style={styles.settingRow}>
              <Text>Short Break (minutes)</Text>
              <View style={styles.settingControls}>
                <IconButton icon="minus" size={20} onPress={() => setShortBreakDuration(prev => Math.max(1, prev - 1))} />
                <Text style={styles.settingValue}>{shortBreakDuration}</Text>
                <IconButton icon="plus" size={20} onPress={() => setShortBreakDuration(prev => prev + 1)} />
              </View>
            </View>
            
            <View style={styles.settingRow}>
              <Text>Long Break (minutes)</Text>
              <View style={styles.settingControls}>
                <IconButton icon="minus" size={20} onPress={() => setLongBreakDuration(prev => Math.max(1, prev - 1))} />
                <Text style={styles.settingValue}>{longBreakDuration}</Text>
                <IconButton icon="plus" size={20} onPress={() => setLongBreakDuration(prev => prev + 1)} />
              </View>
            </View>
            
            <View style={styles.settingRow}>
              <Text>Pomodoros until long break</Text>
              <View style={styles.settingControls}>
                <IconButton icon="minus" size={20} onPress={() => setPomodorosUntilLongBreak(prev => Math.max(1, prev - 1))} />
                <Text style={styles.settingValue}>{pomodorosUntilLongBreak}</Text>
                <IconButton icon="plus" size={20} onPress={() => setPomodorosUntilLongBreak(prev => prev + 1)} />
              </View>
            </View>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setSettingsVisible(false)}>Done</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: 16,
    elevation: 4,
    maxHeight: '90%', // Limit height to prevent overflow
    borderRadius: 8,
  },
  headerButtons: {
    flexDirection: 'row',
  },
  modeSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8, // Reduced margin
  },
  modeButton: {
    flex: 1,
    paddingVertical: 6, // Reduced padding
    paddingHorizontal: 4,
    borderRadius: 4,
    alignItems: 'center',
    marginHorizontal: 2,
  },
  modeButtonText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  timerContainer: {
    alignItems: 'center',
    marginVertical: 8, // Reduced margin
  },
  timerText: {
    fontSize: 48, // Reduced font size
    fontWeight: 'bold',
    marginBottom: 8, // Reduced margin
  },
  progressBar: {
    height: 6, // Reduced height
    width: '100%',
    borderRadius: 3,
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 8, // Reduced margin
    marginBottom: 8, // Added bottom margin
  },
  controlButton: {
    minWidth: 100, // Reduced width
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 4, // Reduced margin
  },
  settingControls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingValue: {
    width: 30,
    textAlign: 'center',
    fontSize: 16,
  },
});

export default PomodoroTimer;