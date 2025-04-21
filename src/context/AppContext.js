import React, {createContext, useState} from 'react';
import {getAuth, signOut} from '@react-native-firebase/auth';

export const AppContext = createContext();

export function AppProvider({children}) {
  const [user, setUser] = useState(null);

  const logoutUser = () => {
    const auth = getAuth();
    console.log('userrrzz', user);

    signOut(auth)
      .then(() => {
        console.log('User signed out!');
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
      }}>
      {children}
    </AppContext.Provider>
  );
}
