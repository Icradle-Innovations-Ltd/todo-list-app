import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, Dimensions, Platform } from 'react-native';
import { Text, Card, useTheme, ActivityIndicator, Button } from 'react-native-paper';
import { useTaskStore, Task } from '../store/taskStore';
import { useFocusEffect } from '@react-navigation/native';

const { width } = Dimensions.get('window');

const DashboardScreen = ({ navigation }: any) => {
  const theme = useTheme();
  const { tasks } = useTaskStore();
  const [loading, setLoading] = useState(true);
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
    <ScrollView style={styles.container}>
      <Text style={[styles.header, { color: theme.colors.primary }]}>Task Dashboard</Text>
      
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
      
      {/* Weekly Activity Chart */}
      <Card style={styles.chartCard}>
        <Card.Title title="Weekly Activity" />
        <Card.Content>
          <View style={styles.textChartContainer}>
            <Text style={styles.chartTitle}>Weekly Task Activity</Text>
            <Text style={styles.chartSubtitle}>Created vs Completed Tasks</Text>
            <View style={styles.legendContainer}>
              <View style={styles.legendItem}>
                <View style={[styles.legendColor, { backgroundColor: theme.colors.primary }]} />
                <Text>Created</Text>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.legendColor, { backgroundColor: theme.colors.secondary }]} />
                <Text>Completed</Text>
              </View>
            </View>
            <Text style={styles.chartDescription}>
              This week you created {weeklyData.datasets[0].data.reduce((a, b) => a + b, 0)} tasks
              and completed {weeklyData.datasets[1].data.reduce((a, b) => a + b, 0)} tasks.
            </Text>
          </View>
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
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
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
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
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
  },
  actionButton: {
    flex: 1,
    marginHorizontal: 8,
  },
});

export default DashboardScreen;