import {NavigationContainer} from '@react-navigation/native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import Checklist from './screens/Checklist';
import Login from './screens/Login';
import Signup from './screens/Signup';
import Notes from './screens/Notes';
import ChecklistDetails from './screens/ChecklistDetails';
import NotesItemDetails from './screens/NotesItemDetails';
import {AppProvider, AppContext} from './context/AppContext';
import CustomDrawer from './components/CustomDrawer';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {useContext} from 'react';
import SplashScreen from './screens/SplashScreen';
import {ChecklistProvider} from './context/ChecklistContext';

import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Collaborators from './screens/Collaborators';
import Settings from './screens/Settings';
import Plan from './screens/Plan';

const Stack = createNativeStackNavigator();

const options = {
  headerShown: false,
};

const GuestStack = () => {
  return (
    <Stack.Navigator initialRouteName="Login">
      <Stack.Screen name="Login" component={Login} options={options} />
      <Stack.Screen name="Signup" component={Signup} options={options} />
    </Stack.Navigator>
  );
};

const UserStack = () => {
  return (
    <Stack.Navigator initialRouteName="Drawer">
      <Stack.Screen name="Drawer" component={CustomDrawer} options={options} />
      <Stack.Screen name="Checklist" component={Checklist} options={options} />
      <Stack.Screen
        name="ChecklistDetails"
        component={ChecklistDetails}
        options={options}
      />
      <Stack.Screen name="Notes" component={Notes} options={options} />
      <Stack.Screen
        name="NotesItemDetails"
        component={NotesItemDetails}
        options={options}
      />
      <Stack.Screen
        name="Collaborators"
        component={Collaborators}
        options={options}
      />
      <Stack.Screen name="Settings" component={Settings} options={options} />
      <Stack.Screen name="Plan" component={Plan} options={options} />
    </Stack.Navigator>
  );
};

const AppContent = () => {
  const {user, appInitializing} = useContext(AppContext);

  console.log('userss', user)

  if (appInitializing) {
    return <SplashScreen />;
  }

  return (
    <NavigationContainer>
      {user ? <UserStack /> : <GuestStack />}
    </NavigationContainer>
  );
};

export default function App() {
  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <SafeAreaProvider>
        <AppProvider>
          <ChecklistProvider>
            <AppContent />
          </ChecklistProvider>
        </AppProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
