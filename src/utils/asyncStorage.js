import AsyncStorage from '@react-native-async-storage/async-storage';

const SELECTED_CHECKLIST_KEY = 'selectedChecklistId';

export const saveSelectedChecklist = async checklist => {
  try {
    await AsyncStorage.setItem(
      SELECTED_CHECKLIST_KEY,
      JSON.stringify(checklist),
    );
  } catch (error) {
    console.error('Error saving selected checklist:', error);
  }
};

export const getSelectedChecklist = async () => {
  try {
    const checklistId = await AsyncStorage.getItem(SELECTED_CHECKLIST_KEY);
    return JSON.parse(checklistId);
  } catch (error) {
    console.error('Error retrieving selected checklist:', error);
    return null;
  }
};

export const clearSelectedChecklist = async () => {
  try {
    await AsyncStorage.removeItem(SELECTED_CHECKLIST_KEY);
  } catch (error) {
    console.error('Error clearing selected checklist:', error);
  }
};

export const setUserSettings = async (settings, userId) => {
  try {
    await AsyncStorage.setItem(
      `user_settings_${userId}`,
      JSON.stringify(settings),
    );
    console.log('settt', settings, userId)
  } catch (error) {
    console.error('Error saving user settings', error);
  }
};

export const getUserSettings = async userId => {
  try {
    const jsonValue = await AsyncStorage.getItem(`user_settings_${userId}`);
    console.log('hson value', jsonValue)
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (error) {
    console.error('Error retrieving user settings', error);
  }
};
