const admin = require('firebase-admin');
const serviceAccount = require('../../checklist-58756-firebase-adminsdk-fbsvc-69049dc009.json');
const data = require('../../data.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://checklist-58756-default-rtdb.asia-southeast1.firebasedatabase.app/',
});

const database = admin.database();

const uploadData = async () => {
  try {
    const users = data.users;
    for (const userId in users) {
      await database.ref(`/users/${userId}`).set(users[userId]);
    }

    const checklists = data.checklists;
    for (const checklistId in checklists) {
      await database.ref(`/checklists/${checklistId}`).set(checklists[checklistId]);
    }

    console.log('Data uploaded successfully!');
  } catch (error) {
    console.error('Error uploading data:', error);
  }
};

uploadData();