const express = require('express');
const router = express.Router();
const twilio = require('twilio');

router.post('/voicemail', (req, res) => {
  const response = new twilio.twiml.VoiceResponse();
  
  response.say('We called to check on your medication...');
  response.pause({ length: 2 });
  
  if (req.body.AnsweredBy === 'machine') {
    response.say('Leaving voicemail...');
    response.record({
      action: '/call/voicemail-complete',
      maxLength: 30
    });
  } else {
    response.hangup();
  }

  res.type('text/xml').send(response.toString());
});

module.exports = router;