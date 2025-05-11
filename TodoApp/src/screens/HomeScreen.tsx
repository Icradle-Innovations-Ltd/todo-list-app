import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  Image, 
  Platform, 
  Alert,
  RefreshControl,
  Share,
  ScrollView,
  Animated as RNAnimated
} from 'react-native';
import CachedImage from '../components/CachedImage';
import { 
  Card, 
  Text, 
  Checkbox, 
  IconButton, 
  FAB, 
  Dialog, 
  Portal, 
  Button, 
  TextInput,
  useTheme,
  Menu,
  Divider,
  Chip,
  SegmentedButtons,
  HelperText,
  ActivityIndicator,
  Avatar,
  Badge,
  Switch,
  RadioButton,
  Snackbar
} from 'react-native-paper';
import { useTaskStore, Task, Priority, RecurrencePattern } from '../store/taskStore';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as ImagePicker from 'expo-image-picker';
import * as Haptics from 'expo-haptics';
import * as Calendar from 'expo-calendar';
import { Swipeable } from 'react-native-gesture-handler';
import Animated, { FadeIn, FadeOut, SlideInRight } from 'react-native-reanimated';
import { useAuthStore } from '../store/authStore';
import { canUseNotifications, scheduleNotification as scheduleNotificationHelper, requestNotificationPermissions } from '../utils/notificationHelper';

type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

const HomeScreen = () => {
  const theme = useTheme();
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const { user } = useAuthStore();
  const { 
    tasks, 
    categories, 
    isLoading,
    lastSynced,
    toggleTaskCompletion, 
    deleteTask, 
    addTask,
    updateTask,
    deleteCompletedTasks,
    addAttachment,
    setReminder,
    removeReminder,
    syncTasks
  } = useTaskStore();
  
  // Task creation/editing state
  const [dialogVisible, setDialogVisible] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentTaskId, setCurrentTaskId] = useState<string | null>(null);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDescription, setNewTaskDescription] = useState('');
  const [newTaskCategory, setNewTaskCategory] = useState('');
  const [newTaskPriority, setNewTaskPriority] = useState<Priority>('medium');
  const [newTaskDueDate, setNewTaskDueDate] = useState<Date | undefined>(undefined);
  const [newTaskRecurrence, setNewTaskRecurrence] = useState<RecurrencePattern>('none');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [newTaskReminder, setNewTaskReminder] = useState(false);
  const [newTaskReminderTime, setNewTaskReminderTime] = useState<Date | undefined>(undefined);
  const [showReminderTimePicker, setShowReminderTimePicker] = useState(false);
  const [showReminderTimePickerAndroid, setShowReminderTimePickerAndroid] = useState(false);
  
  // UI state
  const [menuVisible, setMenuVisible] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  const [priorityFilter, setPriorityFilter] = useState<Priority | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState<'dueDate' | 'priority' | 'createdAt'>('createdAt');
  
  // Category dialog state
  const [categoryDialogVisible, setCategoryDialogVisible] = useState(false);
  
  // Permission states
  const [cameraPermission, setCameraPermission] = useState<boolean | null>(null);
  const [calendarPermission, setCalendarPermission] = useState<boolean | null>(null);
  
  // Animation values
  const fadeAnim = useRef(new RNAnimated.Value(1)).current;
  
  // Request permissions on mount
  useEffect(() => {
    (async () => {
      const { status: cameraStatus } = await ImagePicker.requestCameraPermissionsAsync();
      setCameraPermission(cameraStatus === 'granted');
      
      const { status: calendarStatus } = await Calendar.requestCalendarPermissionsAsync();
      setCalendarPermission(calendarStatus === 'granted');
      
      // Request notification permissions using our helper
      await requestNotificationPermissions();
    })();
  }, []);
  
  // Filter and sort tasks
  const filteredAndSortedTasks = React.useMemo(() => {
    // First filter
    let result = tasks.filter(task => {
      // Filter by completion status
      if (filter === 'active' && task.completed) return false;
      if (filter === 'completed' && !task.completed) return false;
      
      // Filter by category
      if (categoryFilter && task.category !== categoryFilter) return false;
      
      // Filter by priority
      if (priorityFilter && task.priority !== priorityFilter) return false;
      
      return true;
    });
    
    // Then sort
    return result.sort((a, b) => {
      if (sortBy === 'dueDate') {
        // Sort by due date (tasks without due date go to the end)
        if (!a.dueDate && !b.dueDate) return 0;
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      } else if (sortBy === 'priority') {
        // Sort by priority (high to low)
        const priorityOrder = { high: 0, medium: 1, low: 2 };
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      } else {
        // Sort by creation date (newest first)
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
    });
  }, [tasks, filter, categoryFilter, priorityFilter, sortBy]);
  
  // Handle pull-to-refresh
  const onRefresh = async () => {
    setRefreshing(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    
    try {
      await syncTasks();
      
      // Force a re-render to update the last synced time
      setRefreshing(false);
      
      // Show snackbar
      setSnackbarMessage('Tasks synced successfully');
      setSnackbarVisible(true);
    } catch (error) {
      console.error('Sync failed:', error);
      setSnackbarMessage('Sync failed. Please try again.');
      setSnackbarVisible(true);
      setRefreshing(false);
    }
  };
  
  // Reset form when dialog is opened
  const resetForm = () => {
    setNewTaskTitle('');
    setNewTaskDescription('');
    setNewTaskCategory('');
    setNewTaskPriority('medium');
    setNewTaskDueDate(undefined);
    setNewTaskRecurrence('none');
    setNewTaskReminder(false);
    setNewTaskReminderTime(undefined);
    setShowDatePicker(false);
    setShowReminderTimePicker(false);
    setShowReminderTimePickerAndroid(false);
    setIsEditMode(false);
    setCurrentTaskId(null);
  };
  
  // Open dialog to add a new task
  const openAddTaskDialog = () => {
    resetForm();
    setDialogVisible(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  };
  
  // Open dialog to edit an existing task
  const openEditTaskDialog = (task: Task) => {
    setIsEditMode(true);
    setCurrentTaskId(task.id);
    setNewTaskTitle(task.title);
    setNewTaskDescription(task.description || '');
    setNewTaskCategory(task.category || '');
    setNewTaskPriority(task.priority);
    setNewTaskDueDate(task.dueDate);
    setNewTaskRecurrence(task.recurrence);
    setNewTaskReminder(!!task.reminderSet);
    setNewTaskReminderTime(task.reminderTime);
    setDialogVisible(true);
    setMenuVisible(null);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };
  
  // Handle adding or updating a task
  const handleSaveTask = async () => {
    if (!newTaskTitle.trim()) return;
    
    const taskData = {
      title: newTaskTitle.trim(),
      description: newTaskDescription.trim() || undefined,
      category: newTaskCategory.trim() || undefined,
      priority: newTaskPriority,
      dueDate: newTaskDueDate,
      recurrence: newTaskRecurrence,
      reminderSet: newTaskReminder,
      reminderTime: newTaskReminderTime,
    };
    
    if (isEditMode && currentTaskId) {
      // Update existing task
      updateTask(currentTaskId, taskData);
      
      // Show snackbar
      setSnackbarMessage('Task updated');
      setSnackbarVisible(true);
    } else {
      // Add new task
      addTask({
        ...taskData,
        completed: false,
      });
      
      // Show snackbar
      setSnackbarMessage('Task added');
      setSnackbarVisible(true);
    }
    
    // Set reminder notification if enabled
    if (newTaskReminder && newTaskReminderTime) {
      const taskId = currentTaskId || Date.now().toString();
      await scheduleNotification(taskId, newTaskTitle, newTaskReminderTime);
      
      // Add to calendar if permission granted
      if (calendarPermission) {
        await addEventToCalendar(
          newTaskTitle,
          newTaskDescription,
          newTaskReminderTime,
          newTaskDueDate || newTaskReminderTime
        );
      }
    }
    
    // Close dialog and reset form
    setDialogVisible(false);
    resetForm();
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };
  
  // Schedule a notification
  const scheduleNotification = async (taskId: string, title: string, date: Date) => {
    try {
      // If we're in Expo Go on Android, just show an alert instead of scheduling a notification
      if (!canUseNotifications) {
        console.log('Notification would be scheduled for:', title, 'at', date.toLocaleString());
        Alert.alert(
          'Reminder Set',
          `A reminder for "${title}" would be set for ${date.toLocaleString()}.\n\nNote: Push notifications are not supported in Expo Go on Android. Use a development build for full functionality.`,
          [{ text: 'OK' }]
        );
        return;
      }
      
      // Schedule the notification using our helper
      await scheduleNotificationHelper('Task Reminder', title, date, { taskId });
    } catch (error) {
      console.error('Failed to schedule notification:', error);
      Alert.alert(
        'Notification Error',
        'Could not schedule notification. Push notifications may not be fully supported in this environment.'
      );
    }
  };
  
  // Add event to calendar
  const addEventToCalendar = async (
    title: string,
    notes: string = '',
    startDate: Date,
    endDate: Date
  ) => {
    try {
      const calendars = await Calendar.getCalendarsAsync(Calendar.EntityTypes.EVENT);
      const defaultCalendar = calendars.find(cal => cal.isPrimary) || calendars[0];
      
      if (defaultCalendar) {
        await Calendar.createEventAsync(defaultCalendar.id, {
          title,
          notes,
          startDate,
          endDate,
          alarms: [{ relativeOffset: -30 }], // 30 minutes before
        });
      }
    } catch (error) {
      console.error('Error adding event to calendar:', error);
    }
  };
  
  // Handle task deletion
  const confirmDeleteTask = (id: string) => {
    Alert.alert(
      'Delete Task',
      'Are you sure you want to delete this task?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => {
            deleteTask(id);
            setMenuVisible(null);
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
            
            // Show snackbar
            setSnackbarMessage('Task deleted');
            setSnackbarVisible(true);
          }
        },
      ]
    );
  };
  
  // Handle task completion toggle with haptic feedback
  const handleToggleCompletion = (id: string) => {
    toggleTaskCompletion(id);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  };
  
  // Handle picking an image from camera or gallery
  const handleImagePick = async (taskId: string) => {
    setMenuVisible(null);
    
    Alert.alert(
      'Add Attachment',
      'Choose an option',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Take Photo', 
          onPress: async () => {
            if (!cameraPermission) {
              Alert.alert('Permission Required', 'Camera permission is required to take photos');
              return;
            }
            
            const result = await ImagePicker.launchCameraAsync({
              mediaTypes: ImagePicker.MediaType.Images,
              quality: 0.8,
            });
            
            if (!result.canceled && result.assets && result.assets.length > 0) {
              addAttachment(taskId, result.assets[0].uri);
              
              // Show snackbar
              setSnackbarMessage('Photo added to task');
              setSnackbarVisible(true);
            }
          }
        },
        { 
          text: 'Choose from Gallery', 
          onPress: async () => {
            const result = await ImagePicker.launchImageLibraryAsync({
              mediaTypes: ImagePicker.MediaType.Images,
              quality: 0.8,
            });
            
            if (!result.canceled && result.assets && result.assets.length > 0) {
              addAttachment(taskId, result.assets[0].uri);
              
              // Show snackbar
              setSnackbarMessage('Image added to task');
              setSnackbarVisible(true);
            }
          }
        },
      ]
    );
  };
  
  // Share task
  const handleShareTask = (task: Task) => {
    setMenuVisible(null);
    
    Share.share({
      title: 'Task from Todo List App',
      message: `Task: ${task.title}\n${task.description ? `Description: ${task.description}\n` : ''}${task.dueDate ? `Due: ${task.dueDate.toLocaleDateString()}\n` : ''}Priority: ${task.priority}`,
    });
    
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };
  
  // Render priority indicator
  const renderPriorityIndicator = (priority: Priority) => {
    const colors = {
      low: '#8BC34A',
      medium: '#FFC107',
      high: '#F44336',
    };
    
    return (
      <View 
        style={[
          styles.priorityIndicator, 
          { backgroundColor: colors[priority] }
        ]} 
      />
    );
  };
  
  // Render task item with swipe actions
  const renderTaskItem = ({ item }: { item: Task }) => {
    // Get category color
    const categoryObj = categories.find(c => c.name === item.category);
    const categoryColor = categoryObj?.color || theme.colors.primary;
    
    // Format due date
    const formattedDueDate = item.dueDate 
      ? new Date(item.dueDate).toLocaleDateString(undefined, { 
          month: 'short', 
          day: 'numeric',
          year: 'numeric'
        })
      : null;
    
    // Render right swipe actions (delete)
    const renderRightActions = (
      progress: RNAnimated.AnimatedInterpolation,
      dragX: RNAnimated.AnimatedInterpolation
    ) => {
      const scale = dragX.interpolate({
        inputRange: [-80, 0],
        outputRange: [1, 0],
        extrapolate: 'clamp',
      });
      
      return (
        <TouchableOpacity 
          style={styles.deleteAction}
          onPress={() => confirmDeleteTask(item.id)}
        >
          <RNAnimated.View style={[styles.actionIcon, { transform: [{ scale }] }]}>
            <IconButton icon="delete" size={24} iconColor="#fff" />
          </RNAnimated.View>
        </TouchableOpacity>
      );
    };
    
    // Render left swipe actions (complete)
    const renderLeftActions = (
      progress: RNAnimated.AnimatedInterpolation,
      dragX: RNAnimated.AnimatedInterpolation
    ) => {
      const scale = dragX.interpolate({
        inputRange: [0, 80],
        outputRange: [0, 1],
        extrapolate: 'clamp',
      });
      
      return (
        <TouchableOpacity 
          style={styles.completeAction}
          onPress={() => handleToggleCompletion(item.id)}
        >
          <RNAnimated.View style={[styles.actionIcon, { transform: [{ scale }] }]}>
            <IconButton icon="check" size={24} iconColor="#fff" />
          </RNAnimated.View>
        </TouchableOpacity>
      );
    };
    
    return (
      <Animated.View entering={FadeIn} exiting={FadeOut}>
        <Swipeable
          renderRightActions={renderRightActions}
          renderLeftActions={renderLeftActions}
          onSwipeableOpen={(direction) => {
            if (direction === 'right') {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            } else {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            }
          }}
        >
          <Card 
            style={[
              styles.card, 
              item.completed && styles.completedCard
            ]} 
            mode="outlined"
          >
            <Card.Content>
              <View style={styles.taskHeader}>
                <View style={styles.taskTitleContainer}>
                  <Checkbox
                    status={item.completed ? 'checked' : 'unchecked'}
                    onPress={() => handleToggleCompletion(item.id)}
                  />
                  <View style={styles.taskDetails}>
                    <View style={styles.titleRow}>
                      {renderPriorityIndicator(item.priority)}
                      <Text 
                        variant="titleMedium" 
                        style={[
                          styles.taskTitle,
                          item.completed && styles.completedText
                        ]}
                        numberOfLines={1}
                      >
                        {item.title}
                      </Text>
                      {item.reminderSet && (
                        <IconButton 
                          icon="bell" 
                          size={16} 
                          style={styles.reminderIcon}
                        />
                      )}
                    </View>
                    
                    {item.description ? (
                      <Text 
                        variant="bodySmall" 
                        style={[
                          styles.taskDescription,
                          item.completed ? styles.completedText : undefined
                        ]}
                        numberOfLines={2}
                      >
                        {item.description}
                      </Text>
                    ) : null}
                    
                    <View style={styles.taskMetaContainer}>
                      {formattedDueDate && (
                        <Text 
                          variant="bodySmall" 
                          style={[
                            styles.dueDate,
                            item.completed ? styles.completedText : null,
                            !item.completed && item.dueDate && new Date(item.dueDate) < new Date() 
                              ? styles.overdue 
                              : null
                          ]}
                        >
                          {formattedDueDate}
                        </Text>
                      )}
                      
                      {item.recurrence !== 'none' && (
                        <Chip 
                          compact 
                          style={styles.recurrenceChip}
                          textStyle={{ fontSize: 10 }}
                        >
                          {item.recurrence}
                        </Chip>
                      )}
                    </View>
                  </View>
                </View>
                
                <IconButton
                  icon="dots-vertical"
                  onPress={() => setMenuVisible(item.id)}
                />
                
                <Menu
                  visible={menuVisible === item.id}
                  onDismiss={() => setMenuVisible(null)}
                  anchor={{ x: 0, y: 0 }}
                >
                  <Menu.Item 
                    onPress={() => openEditTaskDialog(item)} 
                    title="Edit" 
                    leadingIcon="pencil"
                  />
                  <Menu.Item 
                    onPress={() => handleImagePick(item.id)} 
                    title="Add Attachment" 
                    leadingIcon="paperclip"
                  />
                  <Menu.Item 
                    onPress={() => handleShareTask(item)} 
                    title="Share" 
                    leadingIcon="share"
                  />
                  <Divider />
                  <Menu.Item 
                    onPress={() => confirmDeleteTask(item.id)} 
                    title="Delete" 
                    leadingIcon="delete"
                  />
                </Menu>
              </View>
              
              {/* Attachments */}
              {item.attachments && item.attachments.length > 0 && (
                <View style={styles.attachmentsContainer}>
                  {item.attachments.map((uri, index) => (
                    <CachedImage 
                      key={index}
                      source={{ uri }}
                      style={styles.attachmentImage}
                      placeholderColor="#e0e0e0"
                    />
                  ))}
                </View>
              )}
              
              {/* Category chip */}
              {item.category && (
                <Chip 
                  style={[
                    styles.categoryChip, 
                    { borderColor: categoryColor }
                  ]} 
                  textStyle={{ color: categoryColor }}
                  mode="outlined"
                >
                  {item.category}
                </Chip>
              )}
            </Card.Content>
          </Card>
        </Swipeable>
      </Animated.View>
    );
  };
  
  return (
    <View style={styles.container}>
      {/* Header with user info and sync status */}
      <View style={styles.header}>
        <View style={styles.userInfo}>
          <Avatar.Text 
            size={40} 
            label={user?.username.substring(0, 2).toUpperCase() || 'U'} 
            backgroundColor={theme.colors.primary}
          />
          <View style={styles.userTextContainer}>
            <Text variant="titleMedium">
              {user?.username || 'User'}
            </Text>
            <Text variant="bodySmall">
              {lastSynced 
                ? `Last synced: ${new Date(lastSynced).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}` 
                : 'Not synced yet'}
            </Text>
          </View>
        </View>
        
        <View style={styles.headerButtonsContainer}>
          {refreshing ? (
            <ActivityIndicator 
              size={24} 
              color={theme.colors.primary} 
              style={[styles.headerButton, styles.syncIndicator]} 
            />
          ) : (
            <IconButton 
              icon="sync"
              onPress={onRefresh}
              style={styles.headerButton}
            />
          )}
          <IconButton 
            icon="tag-multiple"
            onPress={() => navigation.navigate('Categories')}
            style={styles.headerButton}
          />
          <IconButton 
            icon={showFilters ? "filter-off" : "filter"} 
            onPress={() => setShowFilters(!showFilters)}
          />
        </View>
      </View>
      
      {/* Filters section */}
      {showFilters && (
        <Animated.View 
          entering={SlideInRight.duration(300)}
          style={styles.filtersSection}
        >
          <Text variant="titleSmall" style={styles.filterTitle}>
            Status
          </Text>
          <SegmentedButtons
            value={filter}
            onValueChange={(value) => setFilter(value as 'all' | 'active' | 'completed')}
            buttons={[
              { value: 'all', label: 'All' },
              { value: 'active', label: 'Active' },
              { value: 'completed', label: 'Completed' }
            ]}
            style={styles.segmentedButtons}
          />
          
          <Text variant="titleSmall" style={[styles.filterTitle, { marginTop: 12 }]}>
            Priority
          </Text>
          <View style={styles.priorityFilterContainer}>
            <TouchableOpacity
              style={[
                styles.priorityFilterButton,
                priorityFilter === 'high' && styles.priorityFilterButtonActive,
                { borderColor: '#F44336' }
              ]}
              onPress={() => setPriorityFilter(priorityFilter === 'high' ? null : 'high')}
            >
              <Text style={{ color: priorityFilter === 'high' ? '#F44336' : '#888' }}>
                High
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.priorityFilterButton,
                priorityFilter === 'medium' && styles.priorityFilterButtonActive,
                { borderColor: '#FFC107' }
              ]}
              onPress={() => setPriorityFilter(priorityFilter === 'medium' ? null : 'medium')}
            >
              <Text style={{ color: priorityFilter === 'medium' ? '#FFC107' : '#888' }}>
                Medium
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.priorityFilterButton,
                priorityFilter === 'low' && styles.priorityFilterButtonActive,
                { borderColor: '#8BC34A' }
              ]}
              onPress={() => setPriorityFilter(priorityFilter === 'low' ? null : 'low')}
            >
              <Text style={{ color: priorityFilter === 'low' ? '#8BC34A' : '#888' }}>
                Low
              </Text>
            </TouchableOpacity>
          </View>
          
          <Text variant="titleSmall" style={[styles.filterTitle, { marginTop: 12 }]}>
            Sort By
          </Text>
          <SegmentedButtons
            value={sortBy}
            onValueChange={(value) => setSortBy(value as 'dueDate' | 'priority' | 'createdAt')}
            buttons={[
              { value: 'dueDate', label: 'Due Date' },
              { value: 'priority', label: 'Priority' },
              { value: 'createdAt', label: 'Created' }
            ]}
            style={styles.segmentedButtons}
          />
          
          {categories.length > 0 && (
            <>
              <Text variant="titleSmall" style={[styles.filterTitle, { marginTop: 12 }]}>
                Categories
              </Text>
              <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                style={styles.categoriesScrollView}
              >
                <Chip
                  selected={categoryFilter === null}
                  onPress={() => setCategoryFilter(null)}
                  style={styles.categoryFilterChip}
                >
                  All
                </Chip>
                {categories.map((category) => (
                  <Chip
                    key={category.id}
                    selected={categoryFilter === category.name}
                    onPress={() => setCategoryFilter(
                      categoryFilter === category.name ? null : category.name
                    )}
                    style={[
                      styles.categoryFilterChip,
                      { borderColor: category.color }
                    ]}
                    textStyle={{ color: categoryFilter === category.name ? '#fff' : category.color }}
                    selectedColor={category.color}
                  >
                    {category.name}
                  </Chip>
                ))}
              </ScrollView>
            </>
          )}
          
          <View style={styles.filterButtonsContainer}>
            <Button 
              mode="outlined" 
              onPress={() => navigation.navigate('Categories')}
              style={styles.manageCategoriesButton}
              icon="tag-multiple"
            >
              Manage Categories
            </Button>
            
            <Button 
              mode="outlined" 
              onPress={() => setShowFilters(false)}
              style={styles.closeFiltersButton}
            >
              Close Filters
            </Button>
          </View>
        </Animated.View>
      )}
      
      {/* Task list */}
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={styles.loadingText}>Syncing tasks...</Text>
        </View>
      ) : filteredAndSortedTasks.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No tasks</Text>
          <Text style={styles.emptySubtext}>
            {filter === 'all' 
              ? 'Add some tasks to get started'
              : filter === 'active'
                ? 'No active tasks'
                : 'No completed tasks'}
          </Text>
          <Button 
            mode="contained" 
            onPress={openAddTaskDialog}
            style={{ marginTop: 16 }}
          >
            Add Task
          </Button>
        </View>
      ) : (
        <FlatList
          data={filteredAndSortedTasks}
          keyExtractor={(item) => item.id}
          renderItem={renderTaskItem}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[theme.colors.primary]}
            />
          }
        />
      )}
      
      {/* Task dialog */}
      <Portal>
        <Dialog 
          visible={dialogVisible} 
          onDismiss={() => setDialogVisible(false)}
          style={styles.dialog}
        >
          <View style={styles.dialogHeader}>
            <Dialog.Title style={styles.dialogTitle}>
              {isEditMode ? 'Edit Task' : 'Add New Task'}
            </Dialog.Title>
            <IconButton
              icon="close"
              size={24}
              onPress={() => setDialogVisible(false)}
              style={styles.dialogCloseButton}
            />
          </View>
          <Dialog.ScrollArea style={styles.dialogScrollArea}>
            <ScrollView>
              <View style={styles.dialogContent}>
                <TextInput
                  label="Title"
                  value={newTaskTitle}
                  onChangeText={setNewTaskTitle}
                  mode="outlined"
                  style={styles.dialogInput}
                />
                
                <TextInput
                  label="Description (optional)"
                  value={newTaskDescription}
                  onChangeText={setNewTaskDescription}
                  mode="outlined"
                  style={styles.dialogInput}
                  multiline
                  numberOfLines={3}
                />
                
                <Text variant="bodyMedium" style={styles.inputLabel}>
                  Priority
                </Text>
                <SegmentedButtons
                  value={newTaskPriority}
                  onValueChange={(value) => setNewTaskPriority(value as Priority)}
                  buttons={[
                    { 
                      value: 'low', 
                      label: 'Low',
                      style: { borderColor: '#8BC34A' },
                      checkedColor: '#8BC34A'
                    },
                    { 
                      value: 'medium', 
                      label: 'Medium',
                      style: { borderColor: '#FFC107' },
                      checkedColor: '#FFC107'
                    },
                    { 
                      value: 'high', 
                      label: 'High',
                      style: { borderColor: '#F44336' },
                      checkedColor: '#F44336'
                    }
                  ]}
                  style={styles.segmentedButtons}
                />
                
                <View style={styles.dueDateContainer}>
                  <Text variant="bodyMedium" style={styles.inputLabel}>
                    Due Date (optional)
                  </Text>
                  <View style={styles.datePickerRow}>
                    <Text style={styles.dateText}>
                      {newTaskDueDate 
                        ? newTaskDueDate.toLocaleDateString() 
                        : 'No date selected'}
                    </Text>
                    <View style={styles.dateButtons}>
                      <Button 
                        mode="outlined" 
                        onPress={() => setShowDatePicker(true)}
                        style={styles.dateButton}
                      >
                        Select
                      </Button>
                      {newTaskDueDate && (
                        <Button 
                          mode="outlined" 
                          onPress={() => setNewTaskDueDate(undefined)}
                          style={[styles.dateButton, styles.clearButton]}
                        >
                          Clear
                        </Button>
                      )}
                    </View>
                  </View>
                  
                  {showDatePicker && (
                    <DateTimePicker
                      value={newTaskDueDate || new Date()}
                      mode="date"
                      display={Platform.OS === 'ios' ? 'inline' : 'default'}
                      onChange={(event, selectedDate) => {
                        setShowDatePicker(Platform.OS === 'ios'); // Only keep open on iOS
                        if (selectedDate) {
                          setNewTaskDueDate(selectedDate);
                        }
                      }}
                    />
                  )}
                </View>
                
                <Text variant="bodyMedium" style={styles.inputLabel}>
                  Recurrence
                </Text>
                <RadioButton.Group
                  value={newTaskRecurrence}
                  onValueChange={(value) => setNewTaskRecurrence(value as RecurrencePattern)}
                >
                  <View style={styles.radioRow}>
                    <RadioButton.Item label="None" value="none" position="leading" />
                    <RadioButton.Item label="Daily" value="daily" position="leading" />
                  </View>
                  <View style={styles.radioRow}>
                    <RadioButton.Item label="Weekly" value="weekly" position="leading" />
                    <RadioButton.Item label="Monthly" value="monthly" position="leading" />
                  </View>
                </RadioButton.Group>
                
                <View style={styles.reminderContainer}>
                  <View style={styles.reminderRow}>
                    <Text variant="bodyMedium" style={styles.inputLabel}>
                      Set Reminder
                    </Text>
                    <Switch
                      value={newTaskReminder}
                      onValueChange={setNewTaskReminder}
                    />
                  </View>
                  
                  {newTaskReminder && (
                    <View style={styles.reminderTimeContainer}>
                      <Text style={styles.dateText}>
                        {newTaskReminderTime 
                          ? newTaskReminderTime.toLocaleString() 
                          : 'No time selected'}
                      </Text>
                      <View style={styles.dateButtons}>
                        <Button 
                          mode="outlined" 
                          onPress={() => setShowReminderTimePicker(true)}
                          style={styles.dateButton}
                        >
                          Select
                        </Button>
                      </View>
                      
                      {showReminderTimePicker && (
                        <DateTimePicker
                          value={newTaskReminderTime || new Date()}
                          mode={Platform.OS === 'ios' ? 'datetime' : 'date'}
                          display={Platform.OS === 'ios' ? 'inline' : 'default'}
                          onChange={(event, selectedDate) => {
                            if (Platform.OS === 'android') {
                              setShowReminderTimePicker(false);
                              if (selectedDate) {
                                // For Android, first pick date, then time
                                setNewTaskReminderTime(selectedDate);
                                // Show time picker after date is selected
                                setTimeout(() => {
                                  setShowReminderTimePickerAndroid(true);
                                }, 100);
                              }
                            } else {
                              // iOS behavior
                              if (selectedDate) {
                                setNewTaskReminderTime(selectedDate);
                              }
                            }
                          }}
                        />
                      )}
                      
                      {showReminderTimePickerAndroid && Platform.OS === 'android' && (
                        <DateTimePicker
                          value={newTaskReminderTime || new Date()}
                          mode="time"
                          display="default"
                          onChange={(event, selectedDate) => {
                            setShowReminderTimePickerAndroid(false);
                            if (selectedDate) {
                              // Combine the previously selected date with the new time
                              const combinedDate = new Date(newTaskReminderTime);
                              combinedDate.setHours(selectedDate.getHours());
                              combinedDate.setMinutes(selectedDate.getMinutes());
                              setNewTaskReminderTime(combinedDate);
                            }
                          }}
                        />
                      )}
                    </View>
                  )}
                </View>
                
                <Text variant="bodyMedium" style={styles.inputLabel}>
                  Category (optional)
                </Text>
                <View style={styles.categorySelectionContainer}>
                  <ScrollView 
                    horizontal 
                    showsHorizontalScrollIndicator={false}
                    style={styles.categoriesScrollView}
                  >
                    {categories.map((category) => (
                      <Chip
                        key={category.id}
                        selected={newTaskCategory === category.name}
                        onPress={() => setNewTaskCategory(
                          newTaskCategory === category.name ? '' : category.name
                        )}
                        style={[
                          styles.categoryFilterChip,
                          { borderColor: category.color }
                        ]}
                        textStyle={{ 
                          color: newTaskCategory === category.name ? '#fff' : category.color 
                        }}
                        selectedColor={category.color}
                      >
                        {category.name}
                      </Chip>
                    ))}
                  </ScrollView>
                  <Button 
                    mode="text" 
                    onPress={() => {
                      setCategoryDialogVisible(true);
                      setDialogVisible(false);
                    }}
                    style={styles.addCategoryButton}
                  >
                    Manage Categories
                  </Button>
                </View>
              </View>
            </ScrollView>
          </Dialog.ScrollArea>
          <Dialog.Actions>
            <Button onPress={() => setDialogVisible(false)}>Cancel</Button>
            <Button 
              onPress={handleSaveTask} 
              disabled={!newTaskTitle.trim()}
            >
              {isEditMode ? 'Update' : 'Add'}
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
      
      {/* Category management dialog */}
      <Portal>
        <Dialog 
          visible={categoryDialogVisible} 
          onDismiss={() => {
            setCategoryDialogVisible(false);
            setDialogVisible(true);
          }}
        >
          <Dialog.Title>Manage Categories</Dialog.Title>
          <Dialog.Content>
            <Text>
              You can manage categories in the Categories screen.
            </Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button 
              onPress={() => {
                setCategoryDialogVisible(false);
                setDialogVisible(true);
              }}
            >
              Back to Task
            </Button>
            <Button 
              onPress={() => {
                setCategoryDialogVisible(false);
                navigation.navigate('Categories');
              }}
            >
              Go to Categories
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
      
      {/* FAB */}
      <FAB
        icon="plus"
        style={[styles.fab, { backgroundColor: theme.colors.primary }]}
        onPress={openAddTaskDialog}
      />
      
      {/* Snackbar */}
      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={3000}
        action={{
          label: 'Dismiss',
          onPress: () => setSnackbarVisible(false),
        }}
      >
        {snackbarMessage}
      </Snackbar>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
  },
  headerButtonsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerButton: {
    marginRight: 4,
  },
  syncIndicator: {
    marginHorizontal: 12,
    shadowRadius: 1,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userTextContainer: {
    marginLeft: 12,
  },
  filtersSection: {
    backgroundColor: '#fff',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  filterTitle: {
    marginBottom: 8,
    opacity: 0.7,
  },
  segmentedButtons: {
    marginBottom: 8,
  },
  priorityFilterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  priorityFilterButton: {
    flex: 1,
    padding: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  priorityFilterButtonActive: {
    backgroundColor: 'rgba(0,0,0,0.05)',
  },
  categoriesScrollView: {
    marginVertical: 8,
  },
  categoryFilterChip: {
    marginRight: 8,
    borderWidth: 1,
  },
  filterButtonsContainer: {
    marginTop: 16,
    flexDirection: 'column',
    gap: 8,
  },
  manageCategoriesButton: {
    borderColor: '#009688',
  },
  closeFiltersButton: {
    marginTop: 8,
  },
  card: {
    marginHorizontal: 16,
    marginTop: 8,
    borderRadius: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  completedCard: {
    opacity: 0.7,
    backgroundColor: '#f9f9f9',
  },
  taskHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  taskTitleContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    flex: 1,
  },
  taskDetails: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  taskTitle: {
    flex: 1,
    marginRight: 4,
    fontSize: 16,
    fontWeight: '600',
  },
  priorityIndicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 8,
    marginTop: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
    elevation: 1,
  },
  reminderIcon: {
    margin: 0,
    padding: 0,
  },
  completedText: {
    textDecorationLine: 'line-through',
    opacity: 0.7,
  },
  taskDescription: {
    marginTop: 4,
    marginLeft: 4,
    lineHeight: 18,
    opacity: 0.8,
  },
  taskMetaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  dueDate: {
    fontSize: 12,
    opacity: 0.7,
    marginRight: 8,
  },
  overdue: {
    color: '#F44336',
    fontWeight: 'bold',
  },
  recurrenceChip: {
    height: 20,
  },
  attachmentsContainer: {
    flexDirection: 'row',
    marginTop: 8,
    flexWrap: 'wrap',
  },
  attachmentImage: {
    width: 60,
    height: 60,
    borderRadius: 4,
    marginRight: 8,
    marginBottom: 8,
  },
  categoryChip: {
    marginTop: 8,
    alignSelf: 'flex-start',
  },
  listContent: {
    paddingBottom: Platform.OS === 'ios' ? 120 : 100,
    paddingTop: 8,
    paddingHorizontal: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  emptySubtext: {
    textAlign: 'center',
    opacity: 0.7,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    opacity: 0.7,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: Platform.OS === 'ios' ? 30 : 16, // Add extra padding for iOS
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    zIndex: 999, // Ensure it's above other elements
  },
  dialog: {
    maxHeight: '80%',
  },
  dialogHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingRight: 8,
  },
  dialogTitle: {
    flex: 1,
  },
  dialogCloseButton: {
    margin: 0,
  },
  dialogScrollArea: {
    paddingHorizontal: 0,
  },
  dialogContent: {
    padding: 16,
  },
  dialogInput: {
    marginBottom: 16,
  },
  inputLabel: {
    marginBottom: 8,
    opacity: 0.7,
  },
  dueDateContainer: {
    marginBottom: 16,
  },
  datePickerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dateText: {
    flex: 1,
  },
  dateButtons: {
    flexDirection: 'row',
  },
  dateButton: {
    marginLeft: 8,
  },
  clearButton: {
    borderColor: '#F44336',
  },
  radioRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  reminderContainer: {
    marginBottom: 16,
  },
  reminderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  reminderTimeContainer: {
    marginTop: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  categorySelectionContainer: {
    marginBottom: 16,
  },
  addCategoryButton: {
    alignSelf: 'flex-start',
    marginTop: 8,
  },
  deleteAction: {
    backgroundColor: '#F44336',
    justifyContent: 'center',
    alignItems: 'flex-end',
    flex: 1,
    width: 80,
  },
  completeAction: {
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'flex-start',
    flex: 1,
    width: 80,
  },
  actionIcon: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default HomeScreen;