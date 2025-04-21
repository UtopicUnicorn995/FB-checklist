import {NavigationContainer} from '@react-navigation/native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import Checklist from './screens/Checklist';
import Login from './screens/Login';
import Signup from './screens/Signup';
import ChecklistDetails from './screens/ChecklistDetails';
import {AppProvider, AppContext} from './context/AppContext';
import CustomDrawer from './components/CustomDrawer';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {useContext} from 'react';

import {createNativeStackNavigator} from '@react-navigation/native-stack';

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
    </Stack.Navigator>
  );
};

const AppContent = () => {
  const {user} = useContext(AppContext);
  console.log('context user', user);

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
          <AppContent /> 
        </AppProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
