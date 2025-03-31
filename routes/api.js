const express = require('express');
const router = express.Router();
const { initiateOutboundCall } = require('../config/twilio');
const { logCall } = require('../utils/logger');

router.post('/trigger-call', async (req, res) => {
  try {
    const { phoneNumber } = req.body;
    
    if (!phoneNumber) {
      return res.status(400).json({ error: 'Phone number required' });
    }

    const call = await initiateOutboundCall(phoneNumber);
    
    logCall({
      sid: call.sid,
      status: 'initiated',
      to: phoneNumber
    });

    res.json({
      success: true,
      sid: call.sid,
      message: `Call initiated to ${phoneNumber}`
    });

  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ 
      error: 'Call failed to initiate',
      details: error.message 
    });
  }
});

module.exports = router;