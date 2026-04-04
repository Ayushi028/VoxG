require('dotenv').config();
const express = require('express');
const jwt = require('jsonwebtoken');
const keywordController = require('./controllers/keywords');
const logController = require('./controllers/logs');
const authController = require('./controllers/auth');
const auth = require('./middleware/auth');
const seedData = require('./utils/seed');
const db = require('./utils/db');

const app = express();

// 🔥 PERFECT CORS CONFIG - WORKS WITH ALL BROWSERS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

app.use(express.json());

// 🔥 SEED DATABASE ON STARTUP
seedData();

// 🔥 HEALTH CHECK - PUBLIC
app.get('/health', async (req, res) => {
  try {
    const [keywords, logs] = await Promise.all([
      db.get('keywords'), 
      db.get('logs')
    ]);
    res.json({ 
      status: '✅ OK', 
      keywords: keywords?.length || 0, 
      logs: logs?.length || 0,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ error: 'Health check failed' });
  }
});

// 🔥 PUBLIC AUTH ROUTES
app.post('/api/auth/register', authController.register);
app.post('/api/auth/login', authController.login);

// 🔥 PUBLIC LOG ROUTES - NO AUTH NEEDED FOR DASHBOARD TESTING
app.get('/api/logs', logController.getAll);
app.post('/api/logs/report', logController.addLog);  // 👈 Frontend calls this
app.post('/api/logs', logController.addLog);         // 👈 Original endpoint

// 🔥 PROTECTED ROUTES - KEEP AUTH
app.get('/api/keywords', auth, keywordController.getAll);
app.post('/api/keywords', auth, keywordController.addKeyword);
app.delete('/api/purge-logs', auth, async (req, res) => {
  try {
    await db.set('logs', []);
    res.json({ 
      success: true, 
      message: '🔐 Privacy purge complete! All logs deleted.' 
    });
  } catch (error) {
    res.status(500).json({ error: 'Purge failed' });
  }
});

// 🔥 404 HANDLER
app.use('*', (req, res) => {
  res.status(404).json({ 
    error: 'Route not found', 
    available: ['/health', '/api/logs', '/api/logs/report', '/api/auth/login'] 
  });
});

// 🔥 ERROR HANDLER
app.use((error, req, res, next) => {
  console.error('🚨 Server Error:', error);
  res.status(500).json({ 
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
  });
});

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log('🚀 VoxGuard API running on http://localhost:' + PORT);
  console.log('✅ CORS enabled - Browser testing ready!');
  console.log('🔍 Test endpoints:');
  console.log('   GET  http://localhost:' + PORT + '/health');
  console.log('   POST http://localhost:' + PORT + '/api/logs/report');
  console.log('   GET  http://localhost:' + PORT + '/api/logs');
});