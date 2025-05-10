import React, { useState } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
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
  Chip
} from 'react-native-paper';
import { useTaskStore, Task } from '../store/taskStore';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';

type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

const HomeScreen = () => {
  const theme = useTheme();
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const { tasks, toggleTaskCompletion, deleteTask, addTask } = useTaskStore();
  
  const [dialogVisible, setDialogVisible] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDescription, setNewTaskDescription] = useState('');
  const [newTaskCategory, setNewTaskCategory] = useState('');
  
  const [menuVisible, setMenuVisible] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');
  
  const filteredTasks = tasks.filter(task => {
    if (filter === 'all') return true;
    if (filter === 'active') return !task.completed;
    if (filter === 'completed') return task.completed;
    return true;
  });
  
  const handleAddTask = () => {
    if (newTaskTitle.trim()) {
      addTask({
        title: newTaskTitle,
        description: newTaskDescription,
        completed: false,
        category: newTaskCategory || undefined,
      });
      setNewTaskTitle('');
      setNewTaskDescription('');
      setNewTaskCategory('');
      setDialogVisible(false);
    }
  };
  
  const renderTaskItem = ({ item }: { item: Task }) => (
    <Card style={styles.card} mode="outlined">
      <Card.Content>
        <View style={styles.taskHeader}>
          <View style={styles.taskTitleContainer}>
            <Checkbox
              status={item.completed ? 'checked' : 'unchecked'}
              onPress={() => toggleTaskCompletion(item.id)}
            />
            <View>
              <Text 
                variant="titleMedium" 
                style={item.completed ? styles.completedText : undefined}
              >
                {item.title}
              </Text>
              {item.description ? (
                <Text 
                  variant="bodySmall" 
                  style={item.completed ? styles.completedText : undefined}
                >
                  {item.description}
                </Text>
              ) : null}
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
              onPress={() => {
                setMenuVisible(null);
                deleteTask(item.id);
              }} 
              title="Delete" 
              leadingIcon="delete"
            />
            <Menu.Item 
              onPress={() => {
                setMenuVisible(null);
                // Edit functionality would go here
              }} 
              title="Edit" 
              leadingIcon="pencil"
            />
          </Menu>
        </View>
        {item.category && (
          <Chip style={styles.categoryChip} mode="outlined">
            {item.category}
          </Chip>
        )}
      </Card.Content>
    </Card>
  );
  
  return (
    <View style={styles.container}>
      <View style={styles.filterContainer}>
        <Chip 
          selected={filter === 'all'} 
          onPress={() => setFilter('all')}
          style={styles.filterChip}
        >
          All
        </Chip>
        <Chip 
          selected={filter === 'active'} 
          onPress={() => setFilter('active')}
          style={styles.filterChip}
        >
          Active
        </Chip>
        <Chip 
          selected={filter === 'completed'} 
          onPress={() => setFilter('completed')}
          style={styles.filterChip}
        >
          Completed
        </Chip>
      </View>
      
      {filteredTasks.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No tasks</Text>
          <Text style={styles.emptySubtext}>
            Add some tasks to get started
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredTasks}
          keyExtractor={(item) => item.id}
          renderItem={renderTaskItem}
          contentContainerStyle={styles.listContent}
        />
      )}
      
      <Portal>
        <Dialog visible={dialogVisible} onDismiss={() => setDialogVisible(false)}>
          <Dialog.Title>Add New Task</Dialog.Title>
          <Dialog.Content>
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
            />
            <TextInput
              label="Category (optional)"
              value={newTaskCategory}
              onChangeText={setNewTaskCategory}
              mode="outlined"
              style={styles.dialogInput}
            />
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setDialogVisible(false)}>Cancel</Button>
            <Button onPress={handleAddTask} disabled={!newTaskTitle.trim()}>
              Add
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
      
      <FAB
        icon="plus"
        style={[styles.fab, { backgroundColor: theme.colors.primary }]}
        onPress={() => setDialogVisible(true)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  card: {
    marginBottom: 8,
  },
  taskHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  taskTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  completedText: {
    textDecorationLine: 'line-through',
    opacity: 0.7,
  },
  listContent: {
    paddingBottom: 80,
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
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
  dialogInput: {
    marginBottom: 12,
  },
  filterContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  filterChip: {
    marginRight: 8,
  },
  categoryChip: {
    marginTop: 8,
    alignSelf: 'flex-start',
  },
});

export default HomeScreen;