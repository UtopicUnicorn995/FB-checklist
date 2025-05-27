import {createContext, useEffect, useState, useContext} from 'react';
import {
  updateChecklistItem,
  createChecklist,
  getChecklist,
  getNotes,
} from '../utils/firebaseServices';
import {
  saveSelectedChecklist,
  getSelectedChecklist,
} from '../utils/asyncStorage';
import {UserContext} from './UserContext';

export const AppContext = createContext();

export const AppProvider = ({children}) => {
  const {user} = useContext(UserContext);
  const [selectedChecklistId, setSelectedChecklistId] = useState(null);
  const [userCheckList, setUserCheckList] = useState([]);
  const [collaboratorsChecklist, setCollaboratorsChecklist] = useState([]);
  const [userNotes, setUserNotes] = useState([]);
  const [selectedChecklist, setSelectedChecklist] = useState(null);

  useEffect(() => {
    if (!user) {
      setUserCheckList([]);
      setSelectedChecklist(null);
      setCollaboratorsChecklist([]);
      setUserNotes([]);
      return;
    }

    const fetchChecklist = async () => {
      await getChecklist(user.id, setUserCheckList);
    };

    const fetchNotes = async () => {
      await getNotes(user.id, setUserNotes);
    };

    fetchNotes();
    fetchChecklist();
  }, [user]);

  useEffect(() => {
    if (selectedChecklist) {
      saveSelectedChecklist(selectedChecklist);
    }
  }, [selectedChecklist]);

  useEffect(() => {
    const loadSelectedChecklist = async () => {
      console.log('savedddd', saveSelectedChecklist, userCheckList);
      try {
        const savedChecklistId = await getSelectedChecklist();
        console.log('reached 1');
        if (savedChecklistId && userCheckList) {
          const savedChecklist = userCheckList.find(
            checklist =>
              checklist.id.toString() === savedChecklistId.id.toString(),
          );
          if (savedChecklist) {
            console.log('reached 2');
            setSelectedChecklist(savedChecklist);
          }
        } else if (userCheckList) {
          console.log('reached 3');
          setSelectedChecklist(userCheckList[0]);
        }
      } catch (error) {
        console.error('Error loading selected checklist:', error);
      }
    };

    loadSelectedChecklist();
  }, [userCheckList]);

  const handleCreateChecklist = checklistTitle => {
    createChecklist(
      user.id,
      checklistTitle,
      setSelectedChecklist,
      saveSelectedChecklist,
    );
  };

  const checkItem = async (checklistId, itemId, check) => {
    const payload = {
      checked: !check,
      updatedAt: new Date().toISOString(),
      checkedBy: !check ? user.username : null,
    };

    try {
      await updateChecklistItem(checklistId, itemId, payload);
      console.log(`Item ${itemId} updated successfully!`, payload);
    } catch (error) {
      console.error(`Error updating item ${itemId}:`, error.message);
    }
  };

  return (
    <AppContext.Provider
      value={{
        selectedChecklistId,
        setSelectedChecklistId,
        checkItem,
        selectedChecklist,
        setSelectedChecklist,
        userCheckList,
        handleCreateChecklist,
        setUserCheckList,
        userNotes,
      }}>
      {children}
    </AppContext.Provider>
  );
};
