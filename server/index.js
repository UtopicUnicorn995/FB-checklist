const express = require('express');
const admin = require('firebase-admin');
const serviceAccount = require('../checklist-58756-firebase-adminsdk-fbsvc-69049dc009.json');

const app = express();
const PORT = 3000;

// Initialize Firebase Admin SDK
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

app.use(express.json());

// Endpoint to send notifications
app.post('/send-notification', async (req, res) => {
  const { deviceToken, title, body, data } = req.body;

  try {
    const message = {
      token: deviceToken,
      notification: {
        title,
        body,
      },
      data,
    };

    const response = await admin.messaging().send(message);
    res.status(200).send({ success: true, response });
  } catch (error) {
    res.status(500).send({ success: false, error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});