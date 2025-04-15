import React, {createContext, useState} from 'react';
import {getDatabase, ref, push, set} from '@react-native-firebase/database';
export const AppContext = createContext();

export function AppProvider({children}) {
  const [user, setUser] = useState(null);

  return (
    <AppContext.Provider
      value={{
        user,
        setUser,
      }}>
      {children}
    </AppContext.Provider>
  );
}
