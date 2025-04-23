import {getDatabase, ref, push, set, update, remove} from '@react-native-firebase/database';

export const addChecklistItem = async (checklistId, itemData) => {
  const db = getDatabase();
  const checklistRef = ref(db, `/checklists/${checklistId}/checklistItems`);
  const newItemRef = push(checklistRef);
  await set(newItemRef, itemData);
  return {id: newItemRef.key, ...itemData};
};

export const updateChecklistItem = async (checklistId, itemId, updatedData) => {
  const db = getDatabase();
  const itemRef = ref(db, `/checklists/${checklistId}/checklistItems/${itemId}`);
  await update(itemRef, updatedData);
};

export const deleteChecklistItem = async (checklistId, itemId) => {
  const db = getDatabase();
  const itemRef = ref(db, `/checklists/${checklistId}/checklistItems/${itemId}`);
  await remove(itemRef);
};