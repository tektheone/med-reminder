const express = require('express');
const router = express.Router();
const twilio = require('twilio');
const { client } = require('../config/twilio');
const { logCall } = require('../utils/logger');

// Outbound Call Handler (TwiML)
router.post('/outbound', (req, res) => {
  const response = new twilio.twiml.VoiceResponse();
  
  response.connect()
    .stream({
      url: `wss://${req.headers.host}/media`
    });

  res.type('text/xml').send(response.toString());
});

// Status Callback Handler
router.post('/status', (req, res) => {
  const { CallSid, CallStatus, AnsweredBy } = req.body;
  
  logCall(CallSid, CallStatus, { AnsweredBy });

  if (CallStatus === 'no-answer') {
    handleMissedCall(CallSid, req.body.To);
  }

  res.sendStatus(200);
});

// Incoming Call Handler
router.post('/incoming', (req, res) => {
  const response = new twilio.twiml.VoiceResponse();
  
  response.say('Please wait while we connect your call...');
  response.connect()
    .stream({
      url: `wss://${req.headers.host}/media`
    });

  res.type('text/xml').send(response.toString());
});

// Missed Call Logic
async function handleMissedCall(sid, to) {
  try {
    // Attempt voicemail
    await client.calls.create({
      url: `${process.env.NGROK_URL}/voicemail`,
      to,
      from: process.env.TWILIO_PHONE_NUMBER,
      machineDetection: 'Enable'
    });
    
    logCall(sid, 'voicemail_attempted');

  } catch (error) {
    // Fallback to SMS
    await client.messages.create({
      body: 'We tried to reach you regarding your medication...',
      to,
      from: process.env.TWILIO_PHONE_NUMBER
    });
    
    logCall(sid, 'sms_sent');
  }
}

module.exports = router;