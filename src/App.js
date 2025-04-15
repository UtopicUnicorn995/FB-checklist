import { NavigationContainer } from '@react-navigation/native';
import Checklist from './screens/Checklist';
import Login from './screens/Login';
import ChecklistDetails from './screens/ChecklistDetails';
import { AppProvider } from './context/AppContext';
import CustomDrawer from './components/CustomDrawer';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

const RootStack = () => {
  const options = {
    headerShown: false,
  };
  return (
    <Stack.Navigator initialRouteName="Drawer">
      <Stack.Screen name="Drawer" component={CustomDrawer} options={options} />
      <Stack.Screen name="Login" component={Login} options={options} />
      <Stack.Screen name="Checklist" component={Checklist} options={options} />
      <Stack.Screen
        name="ChecklistDetails"
        component={ChecklistDetails}
        options={options}
      />
    </Stack.Navigator>
  );
};

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AppProvider>
        <NavigationContainer>
          <RootStack />
        </NavigationContainer>
      </AppProvider>
    </GestureHandlerRootView>
  );
}