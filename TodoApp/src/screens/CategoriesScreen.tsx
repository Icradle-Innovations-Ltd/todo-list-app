import React, { useState } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Card, Text, Button, TextInput, FAB, useTheme, Dialog, Portal } from 'react-native-paper';
import { useTaskStore } from '../store/taskStore';

const CategoriesScreen = () => {
  const theme = useTheme();
  const { tasks, categories, addCategory, deleteCategory } = useTaskStore();
  const [newCategory, setNewCategory] = useState('');
  const [dialogVisible, setDialogVisible] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<string | null>(null);
  
  // Count tasks per category
  const getCategoryTaskCount = (category: string) => {
    return tasks.filter((task) => task.category === category).length;
  };
  
  // Add a new category
  const handleAddCategory = () => {
    if (newCategory.trim() && !categories.includes(newCategory.trim())) {
      addCategory(newCategory.trim());
      setNewCategory('');
    }
  };
  
  // Confirm category deletion
  const confirmDeleteCategory = (category: string) => {
    setCategoryToDelete(category);
    setDialogVisible(true);
  };
  
  // Delete category
  const handleDeleteCategory = () => {
    if (categoryToDelete) {
      deleteCategory(categoryToDelete);
      setCategoryToDelete(null);
      setDialogVisible(false);
    }
  };
  
  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <TextInput
          label="New Category"
          value={newCategory}
          onChangeText={setNewCategory}
          style={styles.input}
          mode="outlined"
        />
        <Button
          mode="contained"
          onPress={handleAddCategory}
          disabled={!newCategory.trim() || categories.includes(newCategory.trim())}
          style={{ backgroundColor: theme.colors.primary }}
        >
          Add
        </Button>
      </View>
      
      {categories.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No categories yet</Text>
          <Text style={styles.emptySubtext}>
            Add categories to organize your tasks better
          </Text>
        </View>
      ) : (
        <FlatList
          data={categories}
          keyExtractor={(item) => item}
          renderItem={({ item }) => (
            <Card style={styles.card} mode="outlined">
              <Card.Content>
                <View style={styles.categoryHeader}>
                  <Text variant="titleLarge">{item}</Text>
                  <Text variant="bodyMedium">
                    {getCategoryTaskCount(item)} tasks
                  </Text>
                </View>
              </Card.Content>
              <Card.Actions>
                <Button onPress={() => confirmDeleteCategory(item)}>Delete</Button>
              </Card.Actions>
            </Card>
          )}
          contentContainerStyle={styles.listContent}
        />
      )}
      
      <Portal>
        <Dialog visible={dialogVisible} onDismiss={() => setDialogVisible(false)}>
          <Dialog.Title>Delete Category</Dialog.Title>
          <Dialog.Content>
            <Text variant="bodyMedium">
              Are you sure you want to delete this category? Tasks in this category will be uncategorized.
            </Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setDialogVisible(false)}>Cancel</Button>
            <Button onPress={handleDeleteCategory}>Delete</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
      
      <FAB
        icon="plus"
        style={[styles.fab, { backgroundColor: theme.colors.primary }]}
        onPress={() => {
          setNewCategory('');
          // You could open a dialog here instead of using the input at the top
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    alignItems: 'center',
  },
  input: {
    flex: 1,
    marginRight: 8,
  },
  card: {
    marginBottom: 8,
  },
  categoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
});

export default CategoriesScreen;