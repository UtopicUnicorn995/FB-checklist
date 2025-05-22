/**
 * @format
 */

if (process.env.NODE_ENV === 'production') {
  console.log = () => {};
  console.error = () => {};
  console.warn = () => {};
}



import 'react-native-gesture-handler';
import {AppRegistry} from 'react-native';
import messaging from '@react-native-firebase/messaging';
import App from './src/App';
import {name as appName} from './app.json';
import {PermissionsAndroid} from 'react-native';
import database from '@react-native-firebase/database';

database().setPersistenceEnabled(true);

// database().setPersistenceEnabled(true);
globalThis.RNFB_MODULAR_DEPRECATION_STRICT_MODE === true;
PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);

messaging().setBackgroundMessageHandler(async remoteMessage => {
  console.log('Background message handled:', remoteMessage);
});

messaging().onNotificationOpenedApp(remoteMessage => {
  console.log('App opened by notification while in foreground:', remoteMessage);
  // Handle notification interaction when the app is in the foreground
});
messaging()
  .getInitialNotification()
  .then(remoteMessage => {
    console.log('App opened by notification from closed state:', remoteMessage);
    // Handle notification interaction when the app is opened from a closed state
  });

messaging()
  .getToken()
  .then(token => {
    console.log('FCM Token:', token);
  });

AppRegistry.registerComponent(appName, () => App);
