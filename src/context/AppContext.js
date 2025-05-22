import React, {createContext, useState, useEffect, useContext} from 'react';
import {getAuth, signOut} from '@react-native-firebase/auth';
import {
  getDatabase,
  ref,
  onValue,
  query,
  orderByChild,
  equalTo,
} from '@react-native-firebase/database';
import {clearSelectedChecklist} from '../utils/asyncStorage';
import {ChecklistContext} from './ChecklistContext';

export const AppContext = createContext();

export function AppProvider({children}) {
  const {setUserCheckList, selectedChecklist} = useContext(ChecklistContext);
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
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

      console.log('snaapp', snapshot.val())
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
      unsubscribeChecklist();
      unsubscribeUser();
    };
  }, [user]);

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
        appInitializing,
      }}>
      {children}
    </AppContext.Provider>
  );
}
