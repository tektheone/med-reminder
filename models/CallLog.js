const mongoose = require('mongoose');

const callLogSchema = new mongoose.Schema({
  sid: { type: String, required: true, index: true },
  from: String,
  to: String,
  status: String,
  response: String,
  recordingUrl: String,
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('CallLog', callLogSchema);