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

export const getLoggedUser = async userId => {
  const db = getDatabase();
  const userRef = ref(db, `/users/${userId}`);
  const snapshot = await get(userRef);
  if (snapshot.exists()) {
    const userData = snapshot.val();
    const withIdUserData = {id: userId, ...userData};
    return withIdUserData;
  }
  return null;
};

export const createChecklist = async (
  userId,
  checklistTitle,
  setSelectedChecklist,
  saveSelectedChecklist,
) => {
  const db = getDatabase();

  const newChecklistRef = push(ref(db, '/checklists'));
  const newChecklistId = newChecklistRef.key;

  const newChecklist = {
    id: newChecklistId,
    createdBy: userId,
    title: checklistTitle,
    collaborators: [],
    checklistItems: [],
  };

  await set(newChecklistRef, newChecklist)
    .then(() => {
      saveSelectedChecklist(newChecklist);
      setSelectedChecklist(newChecklist);
    })
    .catch(error => console.error('Error creating new checklist', error));
};

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

export const getNotes = async (userId, callback) => {
  const db = getDatabase();

  try {
    const notesQuery = query(
      ref(db, `/notes`),
      orderByChild('createdBy'),
      equalTo(userId),
    );

    onValue(notesQuery, snapshot => {
      if (snapshot.exists()) {
        console.log('ss', snapshot.val());
        const notes = Object.entries(snapshot.val()).map(([id, note]) => ({
          id,
          ...note,
        }));
        callback(notes);
      } else {
        callback([]);
      }
    });
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
    console.log('neeee', newNotesRef);
    await set(newNotesRef, itemData);
    return {id: newNotesRef.key, ...itemData};
  } catch (error) {
    throw error;
  }
};

export const updateNotes = async (updatedNotes, notesId) => {
  console.log('notes value', updatedNotes, notesId);
  const db = getDatabase();
  const notesRef = ref(db, `/notes/${notesId}`);
  await update(notesRef, updatedNotes);
};
