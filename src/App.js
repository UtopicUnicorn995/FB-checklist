import {useEffect, useRef} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {Platform, PermissionsAndroid} from 'react-native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import Checklist from './screens/Checklist';
import Login from './screens/Login';
import Signup from './screens/Signup';
import Notes from './screens/Notes';
import ChecklistDetails from './screens/ChecklistDetails';
import NotesItemDetails from './screens/NotesItemDetails';
import {UserProvider, UserContext} from './context/UserContext';
import CustomDrawer from './components/CustomDrawer';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {useContext} from 'react';
import messaging from '@react-native-firebase/messaging';
import SplashScreen from './screens/SplashScreen';
import {AppProvider} from './context/AppContext';
import {getUserSettings} from './utils/asyncStorage';
import notifee, {AndroidImportance} from '@notifee/react-native';
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
  const {user, appInitializing} = useContext(UserContext);
  const notificationListenerRef = useRef(null);
  const backgroundHandlerRef = useRef(null);
  const openedAppListenerRef = useRef(null);

  useEffect(() => {
    console.log('useEffect rendered');
    async function initNotifications() {
      try {
        const settings = await getUserSettings(user.id);
        global.userSettings = settings || {};
        console.log('User settings loaded:', global.userSettings);

        const notifSettings = global.userSettings?.notifications || [];

        await notifee.createChannel({
          id: 'default',
          name: 'Default Channel',
          importance: AndroidImportance.HIGH,
        });

        if (Platform.OS === 'android' && Platform.Version >= 33) {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
          );
          console.log('Notification permission:', granted);
        }

        for (const setting of notifSettings) {
          console.log('settings state', setting);
          if (setting.state) {
            switch (setting.key) {
              case 'checklistUpdates':
                await messaging().subscribeToTopic('update');
                break;
              case 'invites':
                await messaging().subscribeToTopic('invites');
                break;
              case 'checklistItemCreated':
                await messaging().subscribeToTopic('create');
                break;
            }
          } else {
            switch (setting.key) {
              case 'checklistUpdates':
                await messaging().unsubscribeFromTopic('update');
                break;
              case 'invites':
                await messaging().unsubscribeFromTopic('invites');
                break;
              case 'checklistItemCreated':
                await messaging().unsubscribeFromTopic('create');
                break;
            }
          }
        }

        const isAnyEnabled = notifSettings.some(s => s.state);
        if (isAnyEnabled) {
          if (notificationListenerRef.current) {
            notificationListenerRef.current();
          }
          if (openedAppListenerRef.current) {
            openedAppListenerRef.current();
          }

          notificationListenerRef.current = messaging().onMessage(
            async remoteMessage => {
              console.log('Foreground message:', remoteMessage);
              await notifee.displayNotification({
                title: remoteMessage.notification?.title || 'New Message',
                body:
                  remoteMessage.notification?.body ||
                  'You have a new notification',
                android: {
                  channelId: 'default',
                  importance: AndroidImportance.HIGH,
                },
              });
            },
          );

          openedAppListenerRef.current = messaging().onNotificationOpenedApp(
            remoteMessage => {
              console.log(
                'Notification caused app to open from background:',
                remoteMessage,
              );
            },
          );

          if (!backgroundHandlerRef.current) {
            backgroundHandlerRef.current =
              messaging().setBackgroundMessageHandler(async remoteMessage => {
                console.log('Background message handled:', remoteMessage);
              });
          }

          messaging()
            .getInitialNotification()
            .then(remoteMessage => {
              if (remoteMessage) {
                console.log(
                  'Notification caused app to open from quit state:',
                  remoteMessage,
                );
              }
            });

          messaging()
            .getToken()
            .then(token => {
              console.log('FCM Token:', token);
            })
            .catch(err => console.error('Error getting FCM token', err));
        }
      } catch (e) {
        console.error('Notification setup failed:', e);
      }
    }

    if (user?.id) {
      initNotifications();
    }

    return () => {
      if (notificationListenerRef.current) {
        notificationListenerRef.current();
      }
      if (openedAppListenerRef.current) {
        openedAppListenerRef.current();
      }
    };
  }, [user]);

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
        <UserProvider>
          <AppProvider>
            <AppContent />
          </AppProvider>
        </UserProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
