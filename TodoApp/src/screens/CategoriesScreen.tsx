import React, { useState } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import { 
  Card, 
  Text, 
  Button, 
  TextInput, 
  FAB, 
  useTheme, 
  Dialog, 
  Portal,
  IconButton,
  Divider,
  Snackbar,
  Menu,
  Chip,
  ActivityIndicator
} from 'react-native-paper';
import { useTaskStore, Category } from '../store/taskStore';
import * as Haptics from 'expo-haptics';
import { ColorPicker, fromHsv } from 'react-native-color-picker';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { Swipeable } from 'react-native-gesture-handler';

const CategoriesScreen = () => {
  const theme = useTheme();
  const { 
    tasks, 
    categories, 
    addCategory, 
    updateCategory, 
    deleteCategory,
    isLoading
  } = useTaskStore();
  
  // State for adding new category
  const [newCategory, setNewCategory] = useState('');
  const [selectedColor, setSelectedColor] = useState('#6200ee');
  const [colorPickerVisible, setColorPickerVisible] = useState(false);
  
  // State for editing category
  const [editMode, setEditMode] = useState(false);
  const [categoryToEdit, setCategoryToEdit] = useState<Category | null>(null);
  const [editedCategoryName, setEditedCategoryName] = useState('');
  const [editedCategoryColor, setEditedCategoryColor] = useState('');
  
  // State for deleting category
  const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<string | null>(null);
  
  // State for menu
  const [menuVisible, setMenuVisible] = useState<string | null>(null);
  
  // State for snackbar
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  
  // Count tasks per category
  const getCategoryTaskCount = (categoryName: string) => {
    return tasks.filter((task) => task.category === categoryName).length;
  };
  
  // Add a new category
  const handleAddCategory = () => {
    if (newCategory.trim() && !categories.some(c => c.name === newCategory.trim())) {
      addCategory(newCategory.trim(), selectedColor);
      setNewCategory('');
      setSelectedColor('#6200ee');
      
      // Show snackbar
      setSnackbarMessage('Category added');
      setSnackbarVisible(true);
      
      // Haptic feedback
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
  };
  
  // Open edit dialog
  const openEditDialog = (category: Category) => {
    setCategoryToEdit(category);
    setEditedCategoryName(category.name);
    setEditedCategoryColor(category.color);
    setEditMode(true);
    setMenuVisible(null);
    
    // Haptic feedback
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };
  
  // Update category
  const handleUpdateCategory = () => {
    if (categoryToEdit && editedCategoryName.trim()) {
      // Check if name already exists (except for the current category)
      const nameExists = categories.some(
        c => c.name === editedCategoryName.trim() && c.id !== categoryToEdit.id
      );
      
      if (nameExists) {
        Alert.alert('Error', 'A category with this name already exists');
        return;
      }
      
      updateCategory(categoryToEdit.id, editedCategoryName.trim(), editedCategoryColor);
      setCategoryToEdit(null);
      setEditMode(false);
      
      // Show snackbar
      setSnackbarMessage('Category updated');
      setSnackbarVisible(true);
      
      // Haptic feedback
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
  };
  
  // Confirm category deletion
  const confirmDeleteCategory = (categoryId: string) => {
    setCategoryToDelete(categoryId);
    setDeleteDialogVisible(true);
    setMenuVisible(null);
  };
  
  // Delete category
  const handleDeleteCategory = () => {
    if (categoryToDelete) {
      deleteCategory(categoryToDelete);
      setCategoryToDelete(null);
      setDeleteDialogVisible(false);
      
      // Show snackbar
      setSnackbarMessage('Category deleted');
      setSnackbarVisible(true);
      
      // Haptic feedback
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    }
  };
  
  // Render category item with swipe actions
  const renderCategoryItem = ({ item }: { item: Category }) => {
    const taskCount = getCategoryTaskCount(item.name);
    
    // Render right swipe actions (delete)
    const renderRightActions = (progress: any, dragX: any) => {
      return (
        <TouchableOpacity 
          style={[styles.deleteAction, { backgroundColor: theme.colors.error }]}
          onPress={() => confirmDeleteCategory(item.id)}
        >
          <IconButton icon="delete" size={24} iconColor="#fff" />
        </TouchableOpacity>
      );
    };
    
    return (
      <Animated.View entering={FadeIn} exiting={FadeOut}>
        <Swipeable
          renderRightActions={renderRightActions}
          onSwipeableOpen={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          }}
        >
          <Card 
            style={styles.card} 
            mode="outlined"
          >
            <Card.Content>
              <View style={styles.categoryHeader}>
                <View style={styles.categoryNameContainer}>
                  <View 
                    style={[
                      styles.colorIndicator, 
                      { backgroundColor: item.color }
                    ]} 
                  />
                  <Text variant="titleLarge">{item.name}</Text>
                </View>
                <View style={styles.categoryActions}>
                  <Chip mode="outlined" style={styles.taskCountChip}>
                    {taskCount} {taskCount === 1 ? 'task' : 'tasks'}
                  </Chip>
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
                      onPress={() => openEditDialog(item)} 
                      title="Edit" 
                      leadingIcon="pencil"
                    />
                    <Menu.Item 
                      onPress={() => confirmDeleteCategory(item.id)} 
                      title="Delete" 
                      leadingIcon="delete"
                    />
                  </Menu>
                </View>
              </View>
            </Card.Content>
          </Card>
        </Swipeable>
      </Animated.View>
    );
  };
  
  return (
    <View style={styles.container}>
      <Card style={styles.addCategoryCard}>
        <Card.Content>
          <Text variant="titleMedium" style={styles.cardTitle}>
            Add New Category
          </Text>
          <View style={styles.inputContainer}>
            <TextInput
              label="Category Name"
              value={newCategory}
              onChangeText={setNewCategory}
              style={styles.input}
              mode="outlined"
            />
            <TouchableOpacity
              style={[styles.colorButton, { backgroundColor: selectedColor }]}
              onPress={() => setColorPickerVisible(true)}
            />
          </View>
          <Button
            mode="contained"
            onPress={handleAddCategory}
            disabled={!newCategory.trim() || categories.some(c => c.name === newCategory.trim())}
            style={styles.addButton}
            buttonColor={theme.colors.primary}
            textColor="white"
            icon="plus"
          >
            Add Category
          </Button>
        </Card.Content>
      </Card>
      
      <Divider style={styles.divider} />
      
      <Text variant="titleMedium" style={styles.sectionTitle}>
        Your Categories
      </Text>
      
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={styles.loadingText}>Loading categories...</Text>
        </View>
      ) : categories.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No categories yet</Text>
          <Text style={styles.emptySubtext}>
            Add categories to organize your tasks better
          </Text>
        </View>
      ) : (
        <FlatList
          data={categories}
          keyExtractor={(item) => item.id}
          renderItem={renderCategoryItem}
          contentContainerStyle={styles.listContent}
        />
      )}
      
      {/* Color Picker Dialog */}
      <Portal>
        <Dialog 
          visible={colorPickerVisible} 
          onDismiss={() => setColorPickerVisible(false)}
          style={styles.colorPickerDialog}
        >
          <Dialog.Title>Choose a Color</Dialog.Title>
          <Dialog.Content>
            <View style={styles.colorPickerContainer}>
              <ColorPicker
                onColorChange={color => setSelectedColor(fromHsv(color))}
                style={styles.colorPicker}
                defaultColor={selectedColor}
              />
              <View style={styles.colorPreview}>
                <Text variant="bodyMedium">Selected Color:</Text>
                <View 
                  style={[
                    styles.colorPreviewBox, 
                    { backgroundColor: selectedColor }
                  ]} 
                />
              </View>
            </View>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setColorPickerVisible(false)}>Cancel</Button>
            <Button 
              onPress={() => {
                setColorPickerVisible(false);
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              }}
            >
              Select
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
      
      {/* Edit Category Dialog */}
      <Portal>
        <Dialog 
          visible={editMode} 
          onDismiss={() => setEditMode(false)}
        >
          <Dialog.Title>Edit Category</Dialog.Title>
          <Dialog.Content>
            <TextInput
              label="Category Name"
              value={editedCategoryName}
              onChangeText={setEditedCategoryName}
              mode="outlined"
              style={styles.dialogInput}
            />
            <View style={styles.colorSelectionContainer}>
              <Text variant="bodyMedium" style={styles.colorSelectionLabel}>
                Category Color:
              </Text>
              <TouchableOpacity
                style={[
                  styles.colorButton, 
                  styles.dialogColorButton,
                  { backgroundColor: editedCategoryColor }
                ]}
                onPress={() => {
                  setSelectedColor(editedCategoryColor);
                  setEditMode(false);
                  setColorPickerVisible(true);
                }}
              />
            </View>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setEditMode(false)}>Cancel</Button>
            <Button 
              onPress={handleUpdateCategory}
              disabled={!editedCategoryName.trim()}
            >
              Update
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
      
      {/* Delete Confirmation Dialog */}
      <Portal>
        <Dialog 
          visible={deleteDialogVisible} 
          onDismiss={() => setDeleteDialogVisible(false)}
        >
          <Dialog.Title>Delete Category</Dialog.Title>
          <Dialog.Content>
            <Text variant="bodyMedium">
              Are you sure you want to delete this category? Tasks in this category will be uncategorized.
            </Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setDeleteDialogVisible(false)}>Cancel</Button>
            <Button 
              onPress={handleDeleteCategory}
              textColor={theme.colors.error}
            >
              Delete
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
      
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
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  addCategoryCard: {
    marginBottom: 16,
    elevation: 2,
  },
  cardTitle: {
    marginBottom: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  input: {
    flex: 1,
    marginRight: 8,
  },
  colorButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#ddd',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
  },
  addButton: {
    marginTop: 16,
    marginBottom: 8,
    borderRadius: 8,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  divider: {
    marginVertical: 16,
  },
  sectionTitle: {
    marginBottom: 16,
    opacity: 0.7,
  },
  card: {
    marginBottom: 8,
    borderRadius: 8,
    elevation: 2,
  },
  categoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  categoryNameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  colorIndicator: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginRight: 8,
  },
  categoryActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  taskCountChip: {
    marginRight: 8,
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    opacity: 0.7,
  },
  colorPickerDialog: {
    maxHeight: '80%',
  },
  colorPickerContainer: {
    alignItems: 'center',
  },
  colorPicker: {
    width: 250,
    height: 250,
  },
  colorPreview: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
  },
  colorPreviewBox: {
    width: 30,
    height: 30,
    borderRadius: 4,
    marginLeft: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  dialogInput: {
    marginBottom: 16,
  },
  colorSelectionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  colorSelectionLabel: {
    marginRight: 8,
  },
  dialogColorButton: {
    marginLeft: 8,
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 3,
    borderColor: '#ddd',
  },
  deleteAction: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 80,
  },
});

export default CategoriesScreen;