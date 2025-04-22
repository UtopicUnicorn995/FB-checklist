import React, {createContext, useState, useEffect} from 'react';
import {getAuth, signOut} from '@react-native-firebase/auth';
import {
  getDatabase,
  ref,
  onValue,
  query,
  orderByChild,
  equalTo,
  push,
  set,
} from '@react-native-firebase/database';
import {
  saveSelectedChecklist,
  getSelectedChecklist,
  clearSelectedChecklist,
} from '../utils/asyncStorage';

export const AppContext = createContext();

export function AppProvider({children}) {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [userCheckList, setUserCheckList] = useState(null);
  const [selectedChecklist, setSelectedChecklist] = useState(null);

  const [appInitializing, setAppInitializing] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      setAppInitializing(true);
      try {
        const auth = getAuth();
        const currentUser = auth.currentUser;
        setUser(currentUser ? currentUser.uid : null);
      } catch (error) {
        console.error('Error checking user:', error);
      } finally {
        setAppInitializing(false);
      }
    };

    checkUser();
  }, []);

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

  useEffect(() => {
    if (!user) {
      setUserData(null);
      setUserCheckList(null);
      return;
    }

    const db = getDatabase();

    const userRef = ref(db, `/users/${user}`);
    const unsubscribeUser = onValue(userRef, snapshot => {
      if (snapshot.exists()) {
        setUserData(snapshot.val());
      } else {
        setUserData(null);
      }
    });

    const checklistQuery = query(
      ref(db, '/checklists'),
      orderByChild('createdBy'),
      equalTo(user),
    );

    const unsubscribeChecklist = onValue(checklistQuery, snapshot => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const checklistArray = Object.entries(data).map(([key, value]) => ({
          id: key,
          ...value,
        }));
        setUserCheckList(checklistArray);
      } else {
        setUserCheckList([]);
      }
    });

    return () => {
      unsubscribeUser();
      unsubscribeChecklist();
    };
  }, [user]);

  const createChecklist = checklistTitle => {
    const db = getDatabase();

    const newChecklistRef = push(ref(db, '/checklists'));
    const newChecklistId = newChecklistRef.key;

    const newChecklist = {
      id: newChecklistId,
      createdBy: user,
      title: checklistTitle,
      collaborators: [],
      checklistItems: {},
    };

    set(newChecklistRef, newChecklist)
      .then(() => {
        setSelectedChecklist(newChecklist);
        saveSelectedChecklist(newChecklistId);
        console.log('selected checklist upon creating', newChecklist);
      })
      .catch(error => console.error('Error creating checklist:', error));
  };

  const logoutUser = () => {
    const auth = getAuth();
    console.log('Logging out user:', user);

    signOut(auth)
      .then(() => {
        console.log('User signed out!');
        selectedChecklist && clearSelectedChecklist(selectedChecklist.id);
        setUser(null);
      })
      .catch(error => {
        console.error('Error logging out:', error);
      });
  };

  return (
    <AppContext.Provider
      value={{
        user,
        setUser,
        logoutUser,
        userData,
        userCheckList,
        selectedChecklist,
        setSelectedChecklist,
        appInitializing,
        createChecklist,
      }}>
      {children}
    </AppContext.Provider>
  );
}
