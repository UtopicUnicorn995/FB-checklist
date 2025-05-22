import {createContext, useEffect, useState} from 'react';
import {updateChecklistItem, createChecklist} from '../utils/firebaseServices';
import {
  saveSelectedChecklist,
  getSelectedChecklist,
} from '../utils/asyncStorage';
import {getAuth} from '@react-native-firebase/auth';
import {
  getDatabase,
  ref,
  query,
  orderByChild,
  equalTo,
  onValue,
} from '@react-native-firebase/database';

export const ChecklistContext = createContext();

export const ChecklistProvider = ({children}) => {
  const auth = getAuth();
  const currentUser = auth.currentUser;
  const [selectedChecklistId, setSelectedChecklistId] = useState(null);
  const [userCheckList, setUserCheckList] = useState(null);
  const [selectedChecklist, setSelectedChecklist] = useState(null);

  useEffect(() => {
    if (!currentUser.uid) {
      setUserCheckList([]);
      setSelectedChecklist(null);
      return;
    }
    const db = getDatabase();
    const checklistQuery = query(
      ref(db, '/checklists'),
      orderByChild('createdBy'),
      equalTo(currentUser.uid),
    );
    const unsubscribe = onValue(checklistQuery, snapshot => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const checklistArray = Object.entries(data).map(([id, value]) => ({
          id,
          ...value,
        }));
        setUserCheckList(checklistArray);
        // Optionally auto-select the first checklist if none selected
        if (!selectedChecklist && checklistArray.length > 0) {
          setSelectedChecklist(checklistArray[0]);
        }
      } else {
        setUserCheckList([]);
        setSelectedChecklist(null);
      }
    });
    return () => unsubscribe();
  }, [currentUser.uid]);

  useEffect(() => {
    if (selectedChecklist) {
      saveSelectedChecklist(selectedChecklist.id);
    }
  }, [selectedChecklist]);

  useEffect(() => {
    const loadSelectedChecklist = async () => {
      try {
        const savedChecklistId = await getSelectedChecklist();
        if (savedChecklistId && userCheckList) {
          const savedChecklist = userCheckList.find(
            checklist => checklist.id === savedChecklistId,
          );
          if (savedChecklist) {
            setSelectedChecklist(savedChecklist);
          }
        }
      } catch (error) {
        console.error('Error loading selected checklist:', error);
      }
    };

    loadSelectedChecklist();
  }, [userCheckList]);

  useEffect(() => {
    if (!userCheckList || !userCheckList.length) {
      setSelectedChecklist(null);
      return;
    }
    setSelectedChecklist(prev => {
      if (!prev) return userCheckList[0];
      const found = userCheckList.find(c => c.id === prev.id);
      console.log('foound', found)
      return found || userCheckList[0];
    });
  }, [userCheckList]);

  const handleCreateChecklist = checklistTitle => {
    createChecklist(
      currentUser.uid,
      checklistTitle,
      setSelectedChecklist,
      saveSelectedChecklist,
    );
  };

  const checkItem = async (checklistId, itemId, check) => {
    const payload = {
      checked: !check,
      updatedAt: new Date().toISOString(),
      checkedBy: !check ? userData.username : null,
    };

    console.log('userrrdata', userData.username, userData, payload);

    try {
      await updateChecklistItem(checklistId, itemId, payload);
      console.log(`Item ${itemId} updated successfully!`, payload);
    } catch (error) {
      console.error(`Error updating item ${itemId}:`, error.message);
    }
  };

  return (
    <ChecklistContext.Provider
      value={{
        selectedChecklistId,
        setSelectedChecklistId,
        checkItem,
        selectedChecklist,
        setSelectedChecklist,
        userCheckList,
        handleCreateChecklist,
        setUserCheckList,
      }}>
      {children}
    </ChecklistContext.Provider>
  );
};
