import {sendNotification} from './sendNotifications';
import { useState } from 'react';
import messaging from '@react-native-firebase/messaging';

export const testNotification = async () => {

  const [deviceToken, setDeviceToken] = useState('')
  const title = 'Checklist Updated';
  const body = 'An item in your checklist has been checked!';
  const data = {checklistId: '12345', itemId: '67890'};

  messaging()
  .getToken()
  .then(token => {
    setDeviceToken(token)
    console.log('FCM Token:', token);
  });


  try {
    await sendNotification(deviceToken, title, body, data);
    console.log('Test notification sent successfully!');
  } catch (error) {
    console.error('Error sending test notification:', error.message);
  }
};