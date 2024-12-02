const express = require('express');
const fileParser = require('express-multipart-file-parser')
const bodyParser = require('body-parser');
const admin = require('firebase-admin');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const functions = require('firebase-functions');
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

app.use(fileParser)
app.use(express.json());
app.use(cors({ origin: true }));
app.use(bodyParser.urlencoded({ extended: true }))

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

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, 'uploads/');
//   },
//   filename: (req, file, cb) => {
//     cb(null, `${Date.now()}-${file.originalname}`);
//   }
// });
const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024,
    fieldSize: 10 * 1024 * 1024,
    fieldNameSize: 100,
  }
});

app.get('/', (req, res) => {
  console.log(`[${formatDate(new Date())}] ✔️ GET / - Bird Monitoring System Backend is Running`);
  res.send('Bird Monitoring System Backend is Running');
});

app.get('/api/bird-history', async (req, res) => {
  console.log(`[${formatDate(new Date())}] GET /api/bird-history - Fetching bird history data`);
  try {
    const response = await fetch(process.env.SHEETDB_API_ENDPOINT);
    const data1 = await response.json();
    const data = data1.slice(-20);

    if (data && data.length) {
      console.log(`[${formatDate(new Date())}] ✔️ GET /api/bird-history - Successfully fetched bird history data`);
      res.json(data);
    } else {
      console.log(`[${formatDate(new Date())}] ✔️ GET /api/bird-history - No bird history data found`);
      res.json([]);
    }
  } catch (error) {
    console.error(`[${formatDate(new Date())}] ❌ GET /api/bird-history - Error fetching bird history data:`, error.message);
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
  console.log(`[${new Date().toISOString()}] ✔️ POST /api/settings - Receiving settings data`);
  try {
    const settingsRef = db.ref('/settings');
    const snapshot = await settingsRef.once('value');
    const currentSettings = snapshot.val() || {};

    const settingsData = { ...currentSettings, ...req.body };
    if (req.file) {
      settingsData.file = req.file.buffer.toString('base64');
    } else {
      settingsData.file = currentSettings.file;
    }

    settingsData.temperatureRange = JSON.parse(req.body.temperatureRange.replace(/\\/g, ''));
    settingsData.humidityRange = JSON.parse(req.body.humidityRange.replace(/\\/g, ''));

    await settingsRef.set(settingsData);
    console.log(`[${new Date().toISOString()}] ✔️ POST /api/settings - Successfully saved settings data`);

    const updatedSnapshot = await settingsRef.once('value');
    const updatedData = updatedSnapshot.val();
    res.status(200).json(updatedData);
  } catch (error) {
    console.error(`[${new Date().toISOString()}] ❌ POST /api/settings - Error saving settings data:`, error);
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

const nodemailer = require('nodemailer');
const cron = require('node-cron');

const sendNotificationEmail = async (subject, message) => {
  const transporter = nodemailer.createTransport({
    service: 'Gmail', 
    auth: {
      user: process.env.EMAIL_USER, 
      pass: process.env.EMAIL_PASS, 
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: process.env.NOTIFICATION_EMAIL, 
    subject,
    text: message,
  };

  try {
    console.log('data is not in range')
    await transporter.sendMail(mailOptions);
    console.log(`✔️ Notification sent: ${subject}`);
  } catch (error) {
    console.error('❌ Error sending notification email:', error);
  }
};

const monitorThresholds = async () => {
  console.log(`[${new Date().toISOString()}] Monitoring thresholds...`);

  try {
    const dataRef = db.ref('/data');
    const settingsRef = db.ref('/settings');

    const [dataSnapshot, settingsSnapshot] = await Promise.all([
      dataRef.once('value'),
      settingsRef.once('value'),
    ]);

    const data = dataSnapshot.val();
    const settings = settingsSnapshot.val();

    if (data.temperature < settings.temperatureRange.min || data.temperature > settings.temperatureRange.max) {
      await sendNotificationEmail(
        'Temperature Alert',
        `The temperature is ${data.temperature}°C, which is outside the preferred range (${settings.temperatureRange.min}°C - ${settings.temperatureRange.max}°C).`
      );
    }

    if (data.humidity < settings.humidityRange.min || data.humidity > settings.humidityRange.max) {
      await sendNotificationEmail(
        'Humidity Alert',
        `The humidity is ${data.humidity}%, which is outside the preferred range (${settings.humidityRange.min}% - ${settings.humidityRange.max}%).`
      );
    }

  } catch (error) {
    console.error('❌ Error monitoring thresholds:', error);
  }
};

cron.schedule('*/5 * * * *', monitorThresholds); // Runs every 5 minutes

// app.listen(PORT, () => {
//   console.log(`🚀 [${formatDate(new Date())}] Server is running on http://localhost:${PORT} 🚀`);
// });

exports.api = functions.https.onRequest(app);