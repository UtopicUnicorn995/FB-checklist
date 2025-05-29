import {initializeApp} from '@react-native-firebase/app';
import {getDatabase} from '@react-native-firebase/database';
import messaging from '@react-native-firebase/messaging'; // ✅ Add this

const firebaseConfig = {
  apiKey: 'AIzaSyD74O0016GlMWoRlxs2-yEl7bfPXHl2lgI',
  authDomain: 'YOUR_PROJECT_ID.firebaseapp.com',
  databaseURL:
    'https://checklist-58756-default-rtdb.asia-southeast1.firebasedatabase.app/',
  projectId: 'checklist-58756',
  storageBucket: 'checklist-58756.firebasestorage.app',
  messagingSenderId: 'YOUR_MESSAGING_SENDER_ID',
  appId: '1:67797514392:android:2f8d9ed0436c3010b1b8ed',
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

export {db, messaging}; // ✅ Export messaging so you can use it in your app
