import React, {createContext, useState, useEffect} from 'react';
import {getAuth, signOut} from '@react-native-firebase/auth';
import {
  getDatabase,
  ref,
  onValue,
  query,
  orderByChild,
  equalTo,
  get,
} from '@react-native-firebase/database';

export const AppContext = createContext();

export function AppProvider({children}) {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [userCheckList, setUserCheckList] = useState(null);
  const [selectedChecklist, setSelectedChecklist] = useState(null);

  useEffect(() => {
    if (userCheckList && userCheckList.length > 0) {
      setSelectedChecklist(userCheckList[0]);
    } else {
      setSelectedChecklist(null);
    }
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

  console.log('data from the app Context', userData, userCheckList);

  const logoutUser = () => {
    const auth = getAuth();
    console.log('Logging out user:', user);

    signOut(auth)
      .then(() => {
        console.log('User signed out!');
        setUser(null);
      })
      .catch(error => {
        console.error('Error logging out:', error);
      });
  };

  // const createChecklist = () => {
  //   const db = getDatabase()

  //   ref(db, 'checklist')
  // }

  return (
    <AppContext.Provider
      value={{
        user,
        setUser,
        logoutUser,
        userData,
        userCheckList,
        selectedChecklist
      }}>
      {children}
    </AppContext.Provider>
  );
}
