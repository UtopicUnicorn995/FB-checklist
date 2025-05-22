import {
  getDatabase,
  ref,
  push,
  set,
  update,
  remove,
  get,
  query,
  orderByChild,
  equalTo,
  onValue,
} from '@react-native-firebase/database';

export const getChecklist = async (userId, callback) => {
  const db = getDatabase();

  const checklistRef = query(
    ref(db, `/checklists`).orderByChild('createdBy'),
    equalTo(userId),
  );

  onValue(checklistRef, snapshot => {
    if (snapshot.exists()) {
      const checklist = Object.entries(snapshot.val()).map(
        ([id, checklist]) => ({
          id,
          ...checklist,
        }),
      );
      callback(checklist);
    } else {
      callback([]);
    }
  });
};

export const getChecklistItem = async (checkItemId, selectedChecklistId) => {
  const db = getDatabase();
  const itemRef = ref(
    db,
    `/checklists/${selectedChecklistId}/checklistItems/${checkItemId}`,
  );
  const snapshot = await get(itemRef);

  if (snapshot.exists()) {
    return {id: checkItemId, ...snapshot.val()};
  } else {
    return null;
  }
};

export const addChecklistItem = async (checklistId, itemData) => {
  const db = getDatabase();

  const checklistRef = ref(db, `/checklists/${checklistId}/checklistItems`);
  const newItemRef = push(checklistRef);
  await set(newItemRef, itemData);
  return {id: newItemRef.key, ...itemData};
};

export const updateChecklistItem = async (checklistId, itemId, updatedData) => {
  const db = getDatabase();

  const itemRef = ref(
    db,
    `/checklists/${checklistId}/checklistItems/${itemId}`,
  );
  await update(itemRef, updatedData);
};

export const deleteChecklistItem = async (checklistId, itemId) => {
  const db = getDatabase();

  const itemRef = ref(
    db,
    `/checklists/${checklistId}/checklistItems/${itemId}`,
  );
  await remove(itemRef);
};

export const checkListEdit = async (checklistId, updates) => {
  const db = getDatabase();

  const payload = {
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  const checklistRef = ref(db, `/checklists/${checklistId}`);
  await update(checklistRef, payload);
};

export const getNotes = async userId => {
  const db = getDatabase();

  try {
    const notesQuery = query(
      ref(db, `/notes`),
      orderByChild('createdBy'),
      equalTo(userId),
    );

    const snapshot = await get(notesQuery);

    if (snapshot.exists()) {
      const notes = Object.entries(snapshot.val()).map(([id, note]) => ({
        id,
        ...note,
      }));
      return notes;
    } else {
      return [];
    }
  } catch (error) {
    console.error('Error fetching notes:', error.message);
    throw error;
  }
};

export const createNote = async itemData => {
  const db = getDatabase();
  const notesRef = ref(db, '/notes');

  try {
    const newNotesRef = push(notesRef);
    await set(newNotesRef, itemData);

    console.log('Note created successfully:', {itemData});
    return {id: newNotesRef.key, ...itemData};
  } catch (error) {
    console.error('Error creating note:', error.message, {itemData});
    throw error;
  }
};

export const updateNotes = async (updatedNotes, notesId) => {
  const db = getDatabase();

  console.log('edited');
  const notesRef = ref(db, `/notes/${notesId}`);
  console.log('edited2');
  await update(notesRef, updatedNotes);
};
