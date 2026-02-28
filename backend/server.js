const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// MongoDB connection (no extra options needed in new versions)
mongoose.connect('mongodb://localhost:27017/spamDetectionDB')
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error(err));

// Schema
const CallLogSchema = new mongoose.Schema({
  caller: String,
  status: String,
  timestamp: Number
});
const CallLog = mongoose.model('CallLog', CallLogSchema);

// Routes
app.post('/log', async (req, res) => {
  const { caller, status } = req.body;
  const log = new CallLog({ caller, status, timestamp: Date.now() });
  await log.save();
  res.json({ message: 'Log saved', log });
});

app.get('/logs', async (req, res) => {
  const logs = await CallLog.find();
  res.json(logs);
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
