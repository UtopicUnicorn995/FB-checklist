import {NavigationContainer} from '@react-navigation/native';
import Checklist from './screens/Checklist';
import Login from './screens/Login';
import {AppProvider} from './AppContext';

import {createNativeStackNavigator} from '@react-navigation/native-stack';

const stack = createNativeStackNavigator();

const RootStack = () => {
  const options = {
    headerShown: false,
  };
  return (
    <stack.Navigator initialRouteName="Checklist">
      <stack.Screen name="Login" component={Login} options={options} />
      <stack.Screen name="Checklist" component={Checklist} options={options} />
    </stack.Navigator>
  );
};

export default function App() {
  return (
    <AppProvider>
      <NavigationContainer>
        <RootStack />
      </NavigationContainer>
    </AppProvider>
  );
}
