import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Stores user data in AsyncStorage.
 * @param {Object} user - The user object to store.
 * @returns {Promise<void>}
 */
export const storeUser = async (user) => {
  try {
    const jsonValue = JSON.stringify(user);
    console.log('jsonValue', jsonValue)
    await AsyncStorage.setItem('@user', jsonValue);
  } catch (error) {
    console.error('Error storing user data:', error);
  }
};

/**
 * Retrieves user data from AsyncStorage.
 * @returns {Promise<Object|null>} - The user object or null if not found.
 */
export const getUser = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem('@user');
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (error) {
    console.error('Error retrieving user data:', error);
    return null;
  }
};