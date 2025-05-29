/**
 * @format
 */
globalThis.RNFB_SILENCE_MODULAR_DEPRECATION_WARNINGS = true;

if (process.env.NODE_ENV === 'production') {
  console.log = () => {};
  console.error = () => {};
  console.warn = () => {};
}

import 'react-native-gesture-handler';
import {AppRegistry, PermissionsAndroid, Platform} from 'react-native';
import messaging from '@react-native-firebase/messaging';
import notifee, {AndroidImportance} from '@notifee/react-native';
import App from './src/App';
import {name as appName} from './app.json';

async function setupNotifeeChannel() {
  await notifee.createChannel({
    id: 'default',
    name: 'Default Channel',
    importance: AndroidImportance.HIGH,
  });
}

async function requestPermissions() {
  if (Platform.OS === 'android' && Platform.Version >= 33) {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
    );
    console.log('Notification permission:', granted);
  }
}

async function subscribeToTopic() {
  try {
    await messaging().subscribeToTopic('checklists');
    console.log('Subscribed to checklist topic!');
  } catch (error) {
    console.error('Topic subscription failed:', error);
  }
}

function handleForegroundNotifications() {
  messaging().onMessage(async remoteMessage => {
    console.log('Foreground message:', remoteMessage);

    await notifee.displayNotification({
      title: remoteMessage.notification?.title || 'New Message',
      body: remoteMessage.notification?.body || 'You have a new notification',
      android: {
        channelId: 'default',
        importance: AndroidImportance.HIGH,
      },
    });
  });
}

function setupNotificationHandlers() {
  messaging().setBackgroundMessageHandler(async remoteMessage => {
    console.log('Background message handled:', remoteMessage);
  });

  messaging().onNotificationOpenedApp(remoteMessage => {
    console.log(
      'Notification caused app to open from background:',
      remoteMessage,
    );
  });

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
}

function logFCMToken() {
  messaging()
    .getToken()
    .then(token => {
      console.log('FCM Token:', token);
    })
    .catch(err => console.error('Error getting FCM token', err));
}

async function init() {
  await setupNotifeeChannel();
  await requestPermissions();
  await subscribeToTopic();
  handleForegroundNotifications();
  setupNotificationHandlers();
  logFCMToken();
}

init();

AppRegistry.registerComponent(appName, () => App);
