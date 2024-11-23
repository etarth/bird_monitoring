const express = require('express');
const admin = require('firebase-admin');
const path = require('path');

// Initialize Firebase Admin SDK
const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://bird-monitoring-system-default-rtdb.asia-southeast1.firebasedatabase.app'
});

const db = admin.database(); // Access the Firebase Realtime Database

// Initialize Express app
const app = express();
const PORT = 3000;

// Middleware to parse JSON requests
app.use(express.json());

// Test route to check if the server is running
app.get('/', (req, res) => {
  res.send('Bird Monitoring System Backend is Running');
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
