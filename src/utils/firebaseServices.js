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
} from '@react-native-firebase/database';

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

export const checklistItemEdit = async (checklistId, itemId, updates) => {
  const db = getDatabase();

  const payload = {
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  const checklistItemRef = ref(
    db,
    `/checklists/${checklistId}/checklistItems/${itemId}`,
  );
  await update(checklistItemRef, payload);
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
      console.log('Fetched notes:', notes);
      return notes;
    } else {
      console.log('No notes found for user:', userId);
      return [];
    }
  } catch (error) {
    console.error('Error fetching notes:', error.message);
    throw error;
  }
};

export const createNoteWithOrder = async (title, description, userId) => {
  const db = getDatabase();
  const notesRef = ref(db, '/notes');

  try {
    const snapshot = await get(notesRef);

    let existingOrders = [];
    if (snapshot.exists()) {
      const notes = snapshot.val();
      existingOrders = Object.values(notes).map(note => note.order);
    }

    const maxOrder = Math.max(0, ...existingOrders);
    const missingOrder = Array.from({length: maxOrder}, (_, i) => i + 1).find(
      order => !existingOrders.includes(order),
    );
    const nextOrder = missingOrder || maxOrder + 1;

    const data = {
      title,
      description,
      createdBy: userId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const newNotesRef = push(notesRef);
    await set(newNotesRef, data);

    console.log('Note created successfully:', {userId});
    return {id: newNotesRef.key, ...data};
  } catch (error) {
    console.error('Error creating note with order:', error.message);
    throw error;
  }
};
