import React, {createContext, useState, useEffect, useContext} from 'react';
import {getAuth, signOut} from '@react-native-firebase/auth';
import {clearSelectedChecklist} from '../utils/asyncStorage';
import {getLoggedUser} from '../utils/firebaseServices';

export const UserContext = createContext();

export function UserProvider({children}) {
  const [user, setUser] = useState(null);
  const [appInitializing, setAppInitializing] = useState(true);
  const auth = getAuth();

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
    <UserContext.Provider
      value={{
        user,
        setUser,
        logoutUser,
        appInitializing,
      }}>
      {children}
    </UserContext.Provider>
  );
}
