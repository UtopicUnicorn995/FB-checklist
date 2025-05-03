import {createContext, useEffect, useState} from 'react';
import {updateChecklistItem} from '../utils/firebaseServices';
import {
  saveSelectedChecklist,
  getSelectedChecklist,
} from '../utils/asyncStorage';

export const ChecklistContext = createContext();

export const ChecklistProvider = ({children}) => {
  const [selectedChecklistId, setSelectedChecklistId] = useState(null);
  const [userCheckList, setUserCheckList] = useState(null);
  const [selectedChecklist, setSelectedChecklist] = useState(null);

  console.log(
    'user checklist and selected checklists',
    selectedChecklistId,
    userCheckList,
    selectedChecklist,
  );

  useEffect(() => {
    if (selectedChecklist) {
      saveSelectedChecklist(selectedChecklist.id);
    }
  }, [selectedChecklist]);

  useEffect(() => {
    const loadSelectedChecklist = async () => {
      try {
        const savedChecklistId = await getSelectedChecklist();
        console.log('eye dee', savedChecklistId);
        if (savedChecklistId && userCheckList) {
          const savedChecklist = userCheckList.find(
            checklist => checklist.id === savedChecklistId,
          );
          console.log('saved checklists', savedChecklist)
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
    if (!userCheckList || userCheckList.length === 0) {
      setSelectedChecklist(null);
      return;
    }

    setSelectedChecklist(prev => {
      if (!prev) {
        return userCheckList[0];
      }

      const found = userCheckList.find(c => c.id === prev.id);
      return found || userCheckList[0];
    });
  }, [userCheckList]);

  const createChecklist = checklistTitle => {
    const db = getDatabase();

    const newChecklistRef = push(ref(db, '/checklists'));
    const newChecklistId = newChecklistRef.key;

    const newChecklist = {
      id: newChecklistId,
      createdBy: user,
      title: checklistTitle,
      collaborators: [],
      checklistItems: [],
    };

    set(newChecklistRef, newChecklist)
      .then(() => {
        setSelectedChecklist(newChecklist);
        saveSelectedChecklist(newChecklistId);
        console.log('selected checklist upon creating', newChecklist);
      })
      .catch(error => console.error('Error creating checklist:', error));
  };

  const checkItem = async (checklistId, itemId, check) => {
    const updatedData = {
      checked: !check,
      updatedAt: new Date().toISOString(),
      checkedBy: !check ? userData.username : null,
    };

    console.log('userrrdata', userData.username, userData, updatedData);

    try {
      await updateChecklistItem(checklistId, itemId, updatedData);
      console.log(`Item ${itemId} updated successfully!`, updatedData);
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
        createChecklist,
        setUserCheckList,
      }}>
      {children}
    </ChecklistContext.Provider>
  );
};
