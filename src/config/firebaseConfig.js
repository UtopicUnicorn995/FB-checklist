import { initializeApp } from '@react-native-firebase/app';
import { getDatabase } from '@react-native-firebase/database';

// Your Firebase configuration object
const firebaseConfig = {
  apiKey: 'AIzaSyD74O0016GlMWoRlxs2-yEl7bfPXHl2lgI',
  authDomain: 'YOUR_PROJECT_ID.firebaseapp.com',
  databaseURL: 'https://checklist-58756-default-rtdb.asia-southeast1.firebasedatabase.app/',
  projectId: 'YOUR_PROJECT_ID',
  storageBucket: 'YOUR_PROJECT_ID.appspot.com',
  messagingSenderId: 'YOUR_MESSAGING_SENDER_ID',
  appId: '1:67797514392:android:2f8d9ed0436c3010b1b8ed',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export the database instance
const db = getDatabase(app);

export default db;