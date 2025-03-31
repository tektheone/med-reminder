const twilio = require('twilio');
const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

const callDefaults = {
  statusCallback: `${process.env.NGROK_URL}/call/status`,
  statusCallbackEvent: ['initiated', 'ringing', 'answered', 'completed'],
  record: true
};

module.exports = {
  client,
  initiateOutboundCall: async (to) => {
    return client.calls.create({
      ...callDefaults,
      url: `${process.env.NGROK_URL}/call/outbound`,
      to,
      from: process.env.TWILIO_PHONE_NUMBER
    });
  },
  sendSMS: async (to, body) => {
    return client.messages.create({
      body,
      to,
      from: process.env.TWILIO_PHONE_NUMBER
    });
  }
};