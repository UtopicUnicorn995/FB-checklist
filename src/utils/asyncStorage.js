import AsyncStorage from '@react-native-async-storage/async-storage';

const SELECTED_CHECKLIST_KEY = 'selectedChecklistId';

export const saveSelectedChecklist = async checklistId => {
  try {
    await AsyncStorage.setItem(SELECTED_CHECKLIST_KEY, checklistId);
    console.log('Selected checklist saved locally');
  } catch (error) {
    console.error('Error saving selected checklist:', error);
  }
};

export const getSelectedChecklist = async () => {
  try {
    const checklistId = await AsyncStorage.getItem(SELECTED_CHECKLIST_KEY);
    return checklistId;
  } catch (error) {
    console.error('Error retrieving selected checklist:', error);
    return null;
  }
};

export const clearSelectedChecklist = async () => {
  try {
    await AsyncStorage.removeItem(SELECTED_CHECKLIST_KEY);
    console.log('Selected checklist cleared from local storage');
  } catch (error) {
    console.error('Error clearing selected checklist:', error);
  }
};
