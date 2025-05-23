import React, {createContext, useState, useEffect, useContext} from 'react';
import {getAuth, signOut} from '@react-native-firebase/auth';
import {clearSelectedChecklist} from '../utils/asyncStorage';
import {getLoggedUser} from '../utils/firebaseServices';

export const AppContext = createContext();

export function AppProvider({children}) {
  const [user, setUser] = useState(null);
  const [appInitializing, setAppInitializing] = useState(true);
  const auth = getAuth();
  const currentUser = auth.currentUser;

  console.log('currentz', currentUser);

  useEffect(() => {
    setAppInitializing(true);
    const unsubscribe = auth.onAuthStateChanged(async loggedUser => {
      if (loggedUser) {
        const userData = await getLoggedUser(loggedUser.uid);
        setUser(userData);
      } else {
        setUser(null);
      }
      setAppInitializing(false);
    });
    return unsubscribe;
  }, []);

  const logoutUser = () => {
    signOut(auth).then(() => {
      clearSelectedChecklist();
      setUser(null);
    });
  };

  return (
    <AppContext.Provider
      value={{
        user,
        setUser,
        logoutUser,
        appInitializing,
      }}>
      {children}
    </AppContext.Provider>
  );
}
