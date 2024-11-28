const express = require('express');
const admin = require('firebase-admin');
const cors = require('cors');
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

app.get('/', (req, res) => {
  res.send('Bird Monitoring System Backend is Running');
});

app.get('/api/bird-history', async (req, res) => {
  try {
    const birdHistoryRef = db.ref('/birdHistory');
    const snapshot = await birdHistoryRef.once('value');
    const data = snapshot.val();
    if (data) {
      const records = Object.entries(data).map(([key, value]) => ({
        id: key,
        ...value,
      }));
      res.json(records);
    } else {
      res.json([]);
    }
  } catch (error) {
    res.status(500).send('Error fetching bird history data');
  }
});

app.post('/api/sensor-data', async (req, res) => {
  try {
    const sensorData = req.body;
    const sensorDataRef = db.ref('/data');
    await sensorDataRef.push(sensorData);
    res.status(200).send('Sensor data saved successfully');
  } catch (error) {
    res.status(500).send('Error saving sensor data');
  }
});

app.get('/api/sensor-data', async (req, res) => {
  try {
    const sensorDataRef = db.ref('/data');
    const snapshot = await sensorDataRef.once('value');
    const data = snapshot.val();
    if (data) {
      res.json(data);
    } else {
      res.json({});
    }
  } catch (error) {
    res.status(500).send('Error fetching sensor data');
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});