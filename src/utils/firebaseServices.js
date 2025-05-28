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
  child,
} from '@react-native-firebase/database';
import {
  getStorage,
  ref as storageRef,
  deleteObject,
} from '@react-native-firebase/storage';
import {getAuth} from '@react-native-firebase/auth';

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

  try {
    const itemRef = ref(
      db,
      `/checklists/${checklistId}/checklistItems/${itemId}`,
    );

    await update(itemRef, updatedData);
  } catch (error) {
    console.error('Error updating checklist', error);
  }
};

export const deleteChecklistItem = async (checklistId, itemId) => {
  const db = getDatabase();
  const storage = getStorage();

  const itemRef = ref(
    db,
    `/checklists/${checklistId}/checklistItems/${itemId}`,
  );

  console.log('itemId', itemId);

  try {
    const snapshot = await get(itemRef);
    const itemData = snapshot.val();

    console.log('iteeemm data', itemData?.images);
    if (itemData?.images) {
      const images = itemData.images;
      const deletePromises = Object.values(images).map(async image => {
        try {
          const filePath = `/checklistImg/${checklistId}/${image.fileName}`;
          console.log('fileee path', filePath);
          const imageRef = storageRef(storage, filePath);
          await deleteObject(imageRef);
        } catch (error) {
          console.warn('Error deleting image from storage:', error);
        }
      });

      await Promise.all(deletePromises);
    }
    await remove(itemRef);

    console.log('Checklist item and associated images deleted.');
  } catch (error) {
    console.error('Error deleting checklist item:', error);
  }
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

export const uploadImage = async (
  checklistId,
  checklistItemId,
  payload,
  imagePath,
) => {
  try {
    const imageId = push(child(ref(getDatabase()), 'tmp')).key;
    const fileName = `${imageId}-${payload.fileName}`;
    const reference = getStorage().ref(
      `/checklistImg/${checklistId}/${fileName}`,
    );

    await reference.putFile(imagePath);

    const downloadURL = await reference.getDownloadURL();

    const imageMetadata = {
      ...payload,
      imageId,
      url: downloadURL,
      fileName,
    };

    const checklistItemRef = ref(
      getDatabase(),
      `/checklists/${checklistId}/checklistItems/${checklistItemId}/images/${imageId}`,
    );
    await set(checklistItemRef, imageMetadata);

    console.log('Image uploaded and metadata saved');
  } catch (error) {
    console.error('Error uploading image and saving metadata:', error);
  }
};

export const getNotes = async (userId, callback) => {
  const db = getDatabase();

  console.log('user eye dee', userId);

  try {
    const notesQuery = query(
      ref(db, `/notes`),
      orderByChild('createdBy'),
      equalTo(userId),
    );

    onValue(notesQuery, snapshot => {
      if (snapshot.exists()) {
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
    console.log('neeee', newNotesRef, itemData);
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

export const updateSettings = async newSettings => {
  if (!newSettings || typeof newSettings !== 'object') return;

  const userId = getAuth().currentUser.uid;
  const userRef = ref(getDatabase(), `/users/${userId}`);

  console.log('Writing settings:', newSettings);


  await update(userRef, {settings: newSettings});
};
