import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Checkbox, IconButton, TextInput, useTheme, Divider } from 'react-native-paper';
import { useSubtaskStore, Subtask } from '../store/subtaskStore';
import * as Haptics from 'expo-haptics';

interface SubtaskListProps {
  taskId: string;
}

const SubtaskList: React.FC<SubtaskListProps> = ({ taskId }) => {
  const theme = useTheme();
  const { 
    getSubtasksForTask, 
    addSubtask, 
    updateSubtask, 
    deleteSubtask, 
    toggleSubtaskCompletion 
  } = useSubtaskStore();
  
  const [newSubtaskTitle, setNewSubtaskTitle] = useState('');
  const [editingSubtaskId, setEditingSubtaskId] = useState<string | null>(null);
  const [editingSubtaskTitle, setEditingSubtaskTitle] = useState('');
  
  const subtasks = getSubtasksForTask(taskId);
  
  const handleAddSubtask = () => {
    if (newSubtaskTitle.trim()) {
      addSubtask(taskId, newSubtaskTitle.trim());
      setNewSubtaskTitle('');
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };
  
  const handleUpdateSubtask = (id: string) => {
    if (editingSubtaskTitle.trim()) {
      updateSubtask(id, editingSubtaskTitle.trim());
      setEditingSubtaskId(null);
      setEditingSubtaskTitle('');
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };
  
  const handleDeleteSubtask = (id: string) => {
    deleteSubtask(id);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  };
  
  const handleToggleSubtask = (id: string) => {
    toggleSubtaskCompletion(id);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };
  
  const startEditingSubtask = (subtask: Subtask) => {
    setEditingSubtaskId(subtask.id);
    setEditingSubtaskTitle(subtask.title);
  };
  
  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: theme.colors.primary }]}>Subtasks</Text>
      
      {subtasks.length > 0 ? (
        <View style={styles.subtaskList}>
          {subtasks.map((subtask) => (
            <View key={subtask.id} style={styles.subtaskItem}>
              <Checkbox
                status={subtask.completed ? 'checked' : 'unchecked'}
                onPress={() => handleToggleSubtask(subtask.id)}
                color={theme.colors.primary}
              />
              
              {editingSubtaskId === subtask.id ? (
                <TextInput
                  value={editingSubtaskTitle}
                  onChangeText={setEditingSubtaskTitle}
                  style={styles.editInput}
                  autoFocus
                  onBlur={() => handleUpdateSubtask(subtask.id)}
                  onSubmitEditing={() => handleUpdateSubtask(subtask.id)}
                  blurOnSubmit
                />
              ) : (
                <Text 
                  style={[
                    styles.subtaskText,
                    subtask.completed && styles.completedText
                  ]}
                  onPress={() => startEditingSubtask(subtask)}
                >
                  {subtask.title}
                </Text>
              )}
              
              <IconButton
                icon="delete"
                size={16}
                onPress={() => handleDeleteSubtask(subtask.id)}
                style={styles.deleteButton}
              />
            </View>
          ))}
        </View>
      ) : (
        <Text style={styles.emptyText}>No subtasks yet</Text>
      )}
      
      <Divider style={styles.divider} />
      
      <View style={styles.addSubtaskContainer}>
        <TextInput
          label="Add a subtask"
          value={newSubtaskTitle}
          onChangeText={setNewSubtaskTitle}
          style={styles.input}
          right={
            <TextInput.Icon
              icon="plus"
              onPress={handleAddSubtask}
              disabled={!newSubtaskTitle.trim()}
            />
          }
          onSubmitEditing={handleAddSubtask}
          blurOnSubmit
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtaskList: {
    marginBottom: 8,
  },
  subtaskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 2,
  },
  subtaskText: {
    flex: 1,
    fontSize: 14,
  },
  completedText: {
    textDecorationLine: 'line-through',
    opacity: 0.7,
  },
  deleteButton: {
    margin: 0,
  },
  emptyText: {
    fontStyle: 'italic',
    opacity: 0.7,
    marginBottom: 8,
  },
  divider: {
    marginVertical: 8,
  },
  addSubtaskContainer: {
    marginTop: 8,
  },
  input: {
    backgroundColor: 'transparent',
  },
  editInput: {
    flex: 1,
    height: 40,
    fontSize: 14,
  },
});

export default SubtaskList;