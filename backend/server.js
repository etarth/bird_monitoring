const express = require('express');
const admin = require('firebase-admin');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const serviceAccount = {
  type: process.env.TYPE,
  project_id: process.env.PROJECT_ID,
  private_key_id: process.env.PRIVATE_KEY_ID,
  private_key: process.env.PRIVATE_KEY.replace(/\\n/g, '\n'),
  client_email: process.env.CLIENT_EMAIL,
  client_id: process.env.CLIENT_ID,
  auth_uri: process.env.AUTH_URI,
  token_uri: process.env.TOKEN_URI,
  auth_provider_x509_cert_url: process.env.AUTH_PROVIDER_X509_CERT_URL,
  client_x509_cert_url: process.env.CLIENT_X509_CERT_URL,
  universe_domain: process.env.UNIVERSE_DOMAIN
};

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: process.env.DATABASE_URL
});

const db = admin.database();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(cors());

// Serve static files from the "uploads" directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const formatDate = (date) => {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
    timeZone: 'America/New_York'
  }).format(date);
};

// Ensure the uploads directory exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ storage });

app.get('/', (req, res) => {
  console.log(`[${formatDate(new Date())}] ✔️ GET / - Bird Monitoring System Backend is Running`);
  res.send('Bird Monitoring System Backend is Running');
});

app.get('/api/bird-history', async (req, res) => {
  console.log(`[${formatDate(new Date())}] GET /api/bird-history - Fetching bird history data`);
  try {
    const birdHistoryRef = db.ref('/birdHistory');
    const snapshot = await birdHistoryRef.once('value');
    const data = snapshot.val();
    if (data) {
      const records = Object.entries(data).map(([key, value]) => ({
        id: key,
        ...value,
      }));
      console.log(`[${formatDate(new Date())}] ✔️ GET /api/bird-history - Successfully fetched bird history data`);
      res.json(records);
    } else {
      console.log(`[${formatDate(new Date())}] ✔️ GET /api/bird-history - No bird history data found`);
      res.json([]);
    }
  } catch (error) {
    console.error(`[${formatDate(new Date())}] ❌ GET /api/bird-history - Error fetching bird history data:`, error);
    res.status(500).send('Error fetching bird history data');
  }
});

app.post('/api/sensor-data', async (req, res) => {
  console.log(`[${formatDate(new Date())}] ✔️ POST /api/sensor-data - Receiving sensor data`);
  try {
    const sensorData = req.body;
    const sensorDataRef = db.ref('/data');
    await sensorDataRef.push(sensorData);
    console.log(`[${formatDate(new Date())}] ✔️ POST /api/sensor-data - Successfully saved sensor data`);
    res.status(200).send('Sensor data saved successfully');
  } catch (error) {
    console.error(`[${formatDate(new Date())}] ❌ POST /api/sensor-data - Error saving sensor data:`, error);
    res.status(500).send('Error saving sensor data');
  }
});

app.get('/api/sensor-data', async (req, res) => {
  console.log(`[${formatDate(new Date())}] ✔️ GET /api/sensor-data - Fetching sensor data`);
  try {
    const sensorDataRef = db.ref('/data');
    const snapshot = await sensorDataRef.once('value');
    const data = snapshot.val();
    if (data) {
      console.log(`[${formatDate(new Date())}] ✔️ GET /api/sensor-data - Successfully fetched sensor data`);
      res.json(data);
    } else {
      console.log(`[${formatDate(new Date())}] ✔️ GET /api/sensor-data - No sensor data found`);
      res.json({});
    }
  } catch (error) {
    console.error(`[${formatDate(new Date())}] ❌ GET /api/sensor-data - Error fetching sensor data:`, error);
    res.status(500).send('Error fetching sensor data');
  }
});

app.post('/api/settings', upload.single('file'), async (req, res) => {
  console.log(`[${formatDate(new Date())}] ✔️ POST /api/settings - Receiving settings data`);
  try {
    const settingsRef = db.ref('/settings');
    const snapshot = await settingsRef.once('value');
    const currentSettings = snapshot.val() || {};

    const settingsData = { ...currentSettings, ...req.body }; // Merge current settings with new settings
    if (req.file) {
      settingsData.file = req.file.path;
    }

    await settingsRef.set(settingsData);
    console.log(`[${formatDate(new Date())}] ✔️ POST /api/settings - Successfully saved settings data`);
    res.status(200).send('Settings data saved successfully');
  } catch (error) {
    console.error(`[${formatDate(new Date())}] ❌ POST /api/settings - Error saving settings data:`, error);
    res.status(500).send('Error saving settings data');
  }
});

app.get('/api/settings', async (req, res) => {
  console.log(`[${formatDate(new Date())}] ✔️ GET /api/settings - Fetching settings data`);
  try {
    const settingsRef = db.ref('/settings');
    const snapshot = await settingsRef.once('value');
    const data = snapshot.val();
    if (data) {
      console.log(`[${formatDate(new Date())}] ✔️ GET /api/settings - Successfully fetched settings data`);
      res.json(data);
    } else {
      console.log(`[${formatDate(new Date())}] ✔️ GET /api/settings - No settings data found`);
      res.json({});
    }
  } catch (error) {
    console.error(`[${formatDate(new Date())}] ❌ GET /api/settings - Error fetching settings data:`, error);
    res.status(500).send('Error fetching settings data');
  }
});

app.listen(PORT, () => {
  console.log(`🚀 [${formatDate(new Date())}] Server is running on http://localhost:${PORT} 🚀`);
});