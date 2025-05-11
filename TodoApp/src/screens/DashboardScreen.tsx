import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, Dimensions, Platform } from 'react-native';
import { 
  Text, 
  Card, 
  useTheme, 
  ActivityIndicator, 
  Button, 
  Divider, 
  ProgressBar,
  IconButton,
  Avatar
} from 'react-native-paper';
import { useTaskStore, Task } from '../store/taskStore';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import * as Haptics from 'expo-haptics';
import { useAuthStore } from '../store/authStore';

const { width } = Dimensions.get('window');

const DashboardScreen = () => {
  const theme = useTheme();
  const navigation = useNavigation();
  const { user } = useAuthStore();
  const { tasks, syncTasks, lastSynced } = useTaskStore();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [taskStats, setTaskStats] = useState({
    total: 0,
    completed: 0,
    active: 0,
    overdue: 0,
    highPriority: 0,
    mediumPriority: 0,
    lowPriority: 0,
  });
  const [weeklyData, setWeeklyData] = useState({
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        data: [0, 0, 0, 0, 0, 0, 0],
        color: () => theme.colors.primary,
      },
      {
        data: [0, 0, 0, 0, 0, 0, 0],
        color: () => theme.colors.secondary,
      },
    ],
    legend: ['Created', 'Completed'],
  });
  const [categoryData, setCategoryData] = useState<any[]>([]);

  // Calculate statistics when tasks change
  useEffect(() => {
    calculateStats();
  }, [tasks]);

  // Refresh data when screen is focused
  useFocusEffect(
    React.useCallback(() => {
      calculateStats();
      return () => {};
    }, [tasks])
  );

  const calculateStats = () => {
    setLoading(true);
    
    // Basic stats
    const now = new Date();
    const completed = tasks.filter(task => task.completed).length;
    const active = tasks.filter(task => !task.completed).length;
    const overdue = tasks.filter(task => 
      !task.completed && 
      task.dueDate && 
      new Date(task.dueDate) < now
    ).length;
    
    // Priority stats
    const highPriority = tasks.filter(task => task.priority === 'high').length;
    const mediumPriority = tasks.filter(task => task.priority === 'medium').length;
    const lowPriority = tasks.filter(task => task.priority === 'low').length;
    
    setTaskStats({
      total: tasks.length,
      completed,
      active,
      overdue,
      highPriority,
      mediumPriority,
      lowPriority,
    });
    
    // Weekly data
    calculateWeeklyData();
    
    // Category data
    calculateCategoryData();
    
    setLoading(false);
  };

  const calculateWeeklyData = () => {
    // Get dates for the current week (Monday to Sunday)
    const today = new Date();
    const dayOfWeek = today.getDay(); // 0 = Sunday, 1 = Monday, etc.
    const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek; // If Sunday, go back 6 days, otherwise calculate days until Monday
    
    const monday = new Date(today);
    monday.setDate(today.getDate() + mondayOffset);
    monday.setHours(0, 0, 0, 0);
    
    const weekDays = Array.from({ length: 7 }, (_, i) => {
      const date = new Date(monday);
      date.setDate(monday.getDate() + i);
      return date;
    });
    
    // Count tasks created and completed for each day
    const createdCounts = Array(7).fill(0);
    const completedCounts = Array(7).fill(0);
    
    tasks.forEach(task => {
      // Check when task was created
      const createdDate = new Date(task.createdAt);
      weekDays.forEach((day, index) => {
        if (
          createdDate.getDate() === day.getDate() &&
          createdDate.getMonth() === day.getMonth() &&
          createdDate.getFullYear() === day.getFullYear()
        ) {
          createdCounts[index]++;
        }
      });
      
      // Check if task was completed this week
      if (task.completed) {
        const lastModified = new Date(task.lastModified);
        weekDays.forEach((day, index) => {
          if (
            lastModified.getDate() === day.getDate() &&
            lastModified.getMonth() === day.getMonth() &&
            lastModified.getFullYear() === day.getFullYear()
          ) {
            completedCounts[index]++;
          }
        });
      }
    });
    
    setWeeklyData({
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      datasets: [
        {
          data: createdCounts,
          color: () => theme.colors.primary,
        },
        {
          data: completedCounts,
          color: () => theme.colors.secondary,
        },
      ],
      legend: ['Created', 'Completed'],
    });
  };

  const calculateCategoryData = () => {
    // Group tasks by category
    const categoryMap = new Map<string, number>();
    
    tasks.forEach(task => {
      const category = task.category || 'Uncategorized';
      categoryMap.set(category, (categoryMap.get(category) || 0) + 1);
    });
    
    // Convert to format needed for pie chart
    const pieData = Array.from(categoryMap.entries()).map(([name, count], index) => {
      // Generate a color based on the category name
      const colors = [
        '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF',
        '#FF9F40', '#8AC054', '#FF6B6B', '#747FFF', '#67D5B5'
      ];
      
      return {
        name,
        count,
        color: colors[index % colors.length],
        legendFontColor: theme.colors.onSurface,
        legendFontSize: 12,
      };
    });
    
    setCategoryData(pieData);
  };
  
  // Handle pull-to-refresh
  const onRefresh = async () => {
    setRefreshing(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    
    try {
      await syncTasks();
      calculateStats();
      
      // Force a re-render to update the last synced time
      setRefreshing(false);
    } catch (error) {
      console.error('Sync failed:', error);
      setRefreshing(false);
    }
  };

  const chartConfig = {
    backgroundGradientFrom: theme.colors.background,
    backgroundGradientTo: theme.colors.background,
    color: (opacity = 1) => theme.colors.primary,
    labelColor: () => theme.colors.onSurface,
    strokeWidth: 2,
    barPercentage: 0.5,
    useShadowColorFromDataset: false,
    decimalPlaces: 0,
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={{ marginTop: 16 }}>Loading statistics...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header with user info and buttons */}
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
            onPress={() => navigation.navigate('Categories' as never)}
            style={styles.headerButton}
          />
          <IconButton 
            icon="home"
            onPress={() => navigation.navigate('Home' as never)}
          />
        </View>
      </View>
      
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <Text style={[styles.dashboardTitle, { color: theme.colors.primary }]}>Task Dashboard</Text>
      
      {/* Summary Cards */}
      <View style={styles.summaryContainer}>
        <Card style={[styles.summaryCard, { backgroundColor: theme.colors.primaryContainer }]}>
          <Card.Content>
            <Text style={styles.summaryNumber}>{taskStats.total}</Text>
            <Text style={styles.summaryLabel}>Total Tasks</Text>
          </Card.Content>
        </Card>
        
        <Card style={[styles.summaryCard, { backgroundColor: theme.colors.secondaryContainer }]}>
          <Card.Content>
            <Text style={styles.summaryNumber}>{taskStats.active}</Text>
            <Text style={styles.summaryLabel}>Active</Text>
          </Card.Content>
        </Card>
        
        <Card style={[styles.summaryCard, { backgroundColor: theme.colors.tertiaryContainer }]}>
          <Card.Content>
            <Text style={styles.summaryNumber}>{taskStats.completed}</Text>
            <Text style={styles.summaryLabel}>Completed</Text>
          </Card.Content>
        </Card>
        
        <Card style={[styles.summaryCard, { backgroundColor: theme.colors.errorContainer }]}>
          <Card.Content>
            <Text style={styles.summaryNumber}>{taskStats.overdue}</Text>
            <Text style={styles.summaryLabel}>Overdue</Text>
          </Card.Content>
        </Card>
      </View>
      
      {/* Task Status Distribution Chart */}
      <Card style={styles.chartCard}>
        <Card.Title title="Task Status Distribution" />
        <Card.Content>
          {taskStats.total > 0 ? (
            <View style={styles.statusContainer}>
              <View style={styles.statusItem}>
                <Text style={styles.statusLabel}>Active</Text>
                <View style={styles.progressContainer}>
                  <ProgressBar 
                    progress={taskStats.active / taskStats.total} 
                    color={theme.colors.secondary} 
                    style={styles.progressBar} 
                  />
                </View>
                <Text style={styles.statusValue}>{taskStats.active} ({Math.round((taskStats.active / taskStats.total) * 100)}%)</Text>
              </View>
              
              <View style={styles.statusItem}>
                <Text style={styles.statusLabel}>Completed</Text>
                <View style={styles.progressContainer}>
                  <ProgressBar 
                    progress={taskStats.completed / taskStats.total} 
                    color={theme.colors.tertiary} 
                    style={styles.progressBar} 
                  />
                </View>
                <Text style={styles.statusValue}>{taskStats.completed} ({Math.round((taskStats.completed / taskStats.total) * 100)}%)</Text>
              </View>
              
              <View style={styles.statusItem}>
                <Text style={styles.statusLabel}>Overdue</Text>
                <View style={styles.progressContainer}>
                  <ProgressBar 
                    progress={taskStats.overdue / taskStats.total} 
                    color={theme.colors.error} 
                    style={styles.progressBar} 
                  />
                </View>
                <Text style={styles.statusValue}>{taskStats.overdue} ({Math.round((taskStats.overdue / taskStats.total) * 100)}%)</Text>
              </View>
              
              <Text style={styles.chartDescription}>
                Distribution of tasks by their current status
              </Text>
            </View>
          ) : (
            <Text style={styles.noDataText}>No tasks to display</Text>
          )}
        </Card.Content>
      </Card>
      
      {/* Weekly Task Activity */}
      <Card style={styles.chartCard}>
        <Card.Title title="Weekly Task Activity" />
        <Card.Content>
          {taskStats.total > 0 ? (
            <View style={styles.weeklyContainer}>
              <View style={styles.weeklyLegend}>
                <View style={styles.legendItem}>
                  <View style={[styles.legendColor, { backgroundColor: theme.colors.primary }]} />
                  <Text>Created</Text>
                </View>
                <View style={styles.legendItem}>
                  <View style={[styles.legendColor, { backgroundColor: theme.colors.secondary }]} />
                  <Text>Completed</Text>
                </View>
              </View>
              
              <View style={styles.weeklyChart}>
                {weeklyData.labels.map((day, index) => (
                  <View key={day} style={styles.dayColumn}>
                    <Text style={styles.dayLabel}>{day}</Text>
                    <View style={styles.barContainer}>
                      <View 
                        style={[
                          styles.bar, 
                          { 
                            height: Math.max(weeklyData.datasets[0].data[index] * 15, 5),
                            backgroundColor: theme.colors.primary 
                          }
                        ]} 
                      />
                      <Text style={styles.barValue}>{weeklyData.datasets[0].data[index]}</Text>
                    </View>
                    <View style={styles.barContainer}>
                      <View 
                        style={[
                          styles.bar, 
                          { 
                            height: Math.max(weeklyData.datasets[1].data[index] * 15, 5),
                            backgroundColor: theme.colors.secondary 
                          }
                        ]} 
                      />
                      <Text style={styles.barValue}>{weeklyData.datasets[1].data[index]}</Text>
                    </View>
                  </View>
                ))}
              </View>
              
              <Text style={styles.chartDescription}>
                Task creation and completion trends over the current week
              </Text>
            </View>
          ) : (
            <Text style={styles.noDataText}>No tasks to display</Text>
          )}
        </Card.Content>
      </Card>
      
      {/* Category Distribution */}
      <Card style={styles.chartCard}>
        <Card.Title title="Tasks by Category" />
        <Card.Content>
          {categoryData.length > 0 ? (
            <View style={styles.categoryContainer}>
              {categoryData.map((category, index) => (
                <View key={category.name} style={styles.categoryItem}>
                  <View style={styles.categoryHeader}>
                    <View style={[styles.categoryColor, { backgroundColor: category.color }]} />
                    <Text style={styles.categoryName}>{category.name}</Text>
                    <Text style={styles.categoryCount}>{category.count}</Text>
                  </View>
                  <ProgressBar 
                    progress={category.count / taskStats.total} 
                    color={category.color} 
                    style={styles.categoryBar} 
                  />
                </View>
              ))}
              <Text style={styles.chartDescription}>
                Distribution of tasks across different categories
              </Text>
            </View>
          ) : (
            <Text style={styles.noDataText}>No category data to display</Text>
          )}
        </Card.Content>
      </Card>
      
      {/* Priority Distribution */}
      <Card style={styles.chartCard}>
        <Card.Title title="Priority Distribution" />
        <Card.Content>
          <View style={styles.textChartContainer}>
            <Text style={styles.chartTitle}>Task Priority Breakdown</Text>
            <View style={styles.priorityContainer}>
              <View style={styles.priorityItem}>
                <Text style={styles.priorityLabel}>High</Text>
                <Text style={styles.priorityValue}>{taskStats.highPriority}</Text>
                <View style={[styles.priorityBar, { width: `${(taskStats.highPriority / taskStats.total) * 100}%`, backgroundColor: '#FF6384' }]} />
              </View>
              <View style={styles.priorityItem}>
                <Text style={styles.priorityLabel}>Medium</Text>
                <Text style={styles.priorityValue}>{taskStats.mediumPriority}</Text>
                <View style={[styles.priorityBar, { width: `${(taskStats.mediumPriority / taskStats.total) * 100}%`, backgroundColor: '#36A2EB' }]} />
              </View>
              <View style={styles.priorityItem}>
                <Text style={styles.priorityLabel}>Low</Text>
                <Text style={styles.priorityValue}>{taskStats.lowPriority}</Text>
                <View style={[styles.priorityBar, { width: `${(taskStats.lowPriority / taskStats.total) * 100}%`, backgroundColor: '#FFCE56' }]} />
              </View>
            </View>
          </View>
        </Card.Content>
      </Card>
      
      {/* Category Distribution */}
      {categoryData.length > 0 && (
        <Card style={styles.chartCard}>
          <Card.Title title="Tasks by Category" />
          <Card.Content>
            <View style={styles.textChartContainer}>
              <Text style={styles.chartTitle}>Category Distribution</Text>
              {categoryData.map((item, index) => (
                <View key={index} style={styles.categoryItem}>
                  <View style={[styles.categoryColor, { backgroundColor: item.color }]} />
                  <Text style={styles.categoryName}>{item.name}</Text>
                  <Text style={styles.categoryCount}>{item.count}</Text>
                </View>
              ))}
            </View>
          </Card.Content>
        </Card>
      )}
      
      {/* Action Buttons */}
      <View style={styles.actionButtons}>
        <Button 
          mode="contained" 
          icon="refresh" 
          onPress={calculateStats}
          style={styles.actionButton}
        >
          Refresh Data
        </Button>
        
        <Button 
          mode="outlined" 
          icon="format-list-bulleted" 
          onPress={() => navigation.navigate('Home')}
          style={styles.actionButton}
        >
          View Tasks
        </Button>
      </View>
      
      {/* Extra space at the bottom to ensure content isn't covered by navigation */}
      <View style={styles.bottomSpacer} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
    padding: 16,
  },
  contentContainer: {
    paddingBottom: 100, // Add extra padding at the bottom
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
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
    shadowRadius: 2,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userTextContainer: {
    marginLeft: 12,
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
  },
  dashboardTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  summaryContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  summaryCard: {
    width: '48%',
    marginBottom: 16,
    elevation: 2,
    borderRadius: 8,
  },
  summaryNumber: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  summaryLabel: {
    fontSize: 14,
    textAlign: 'center',
    opacity: 0.8,
  },
  chartCard: {
    marginBottom: 16,
    elevation: 2,
    borderRadius: 8,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  noDataText: {
    textAlign: 'center',
    fontSize: 16,
    opacity: 0.7,
    padding: 20,
  },
  chartDescription: {
    textAlign: 'center',
    fontSize: 14,
    opacity: 0.7,
    marginTop: 10,
    marginBottom: 5,
    paddingHorizontal: 10,
  },
  // Status distribution styles
  statusContainer: {
    padding: 10,
  },
  statusItem: {
    marginBottom: 15,
  },
  statusLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  progressContainer: {
    height: 20,
    justifyContent: 'center',
  },
  progressBar: {
    height: 10,
    borderRadius: 5,
  },
  statusValue: {
    fontSize: 14,
    marginTop: 5,
    textAlign: 'right',
  },
  // Weekly activity styles
  weeklyContainer: {
    padding: 10,
  },
  weeklyLegend: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 15,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 10,
  },
  legendColor: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginRight: 5,
  },
  weeklyChart: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: 150,
    marginBottom: 10,
  },
  dayColumn: {
    alignItems: 'center',
    justifyContent: 'flex-end',
    flex: 1,
  },
  dayLabel: {
    fontSize: 12,
    marginBottom: 5,
  },
  barContainer: {
    alignItems: 'center',
    marginHorizontal: 2,
  },
  bar: {
    width: 15,
    borderRadius: 3,
    marginBottom: 2,
  },
  barValue: {
    fontSize: 10,
  },
  // Category styles
  categoryContainer: {
    padding: 10,
  },
  categoryItem: {
    marginBottom: 15,
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  categoryColor: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginRight: 8,
  },
  categoryName: {
    flex: 1,
    fontSize: 14,
  },
  categoryCount: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  categoryBar: {
    height: 8,
    borderRadius: 4,
  },
  textChartContainer: {
    padding: 10,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  chartSubtitle: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 15,
    opacity: 0.7,
  },
  chartDescription: {
    fontSize: 14,
    textAlign: 'center',
    marginTop: 15,
    fontStyle: 'italic',
  },
  legendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 10,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 10,
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 5,
  },
  priorityContainer: {
    marginTop: 10,
  },
  priorityItem: {
    marginBottom: 15,
  },
  priorityLabel: {
    fontSize: 14,
    marginBottom: 5,
  },
  priorityValue: {
    position: 'absolute',
    right: 0,
    top: 0,
    fontSize: 14,
    fontWeight: 'bold',
  },
  priorityBar: {
    height: 10,
    borderRadius: 5,
  },
  categoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    paddingVertical: 5,
  },
  categoryColor: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginRight: 10,
  },
  categoryName: {
    flex: 1,
  },
  categoryCount: {
    fontWeight: 'bold',
  },
  pieChartContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
    marginTop: 8,
  },
  actionButton: {
    flex: 1,
    marginHorizontal: 8,
    borderRadius: 8,
  },
  bottomSpacer: {
    height: 50, // Additional space at the bottom
  },
});

export default DashboardScreen;