const express = require('express');
const app = express();
const ngrok = require('ngrok');
const { WebSocketServer } = require('ws');

require('dotenv').config();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// WebSocket Server
const wss = new WebSocketServer({ port: 8080 });

// Routes
app.use('/api', require('./routes/api'));
app.use('/call', require('./routes/callHandlers'));

// Start server with Ngrok tunneling
const startServer = async () => {
  try {
    const url = await ngrok.connect({
      addr: process.env.SERVER_PORT,
      authtoken: process.env.NGROK_AUTH_TOKEN
    });
    
    console.log(`\nServer running at:
    - Local: http://localhost:${process.env.SERVER_PORT}
    - Public: ${url}`);
    
    app.listen(process.env.SERVER_PORT, () => {
      console.log('Twilio webhooks ready at:');
      console.log(`  Voice: ${url}/call/incoming`);
      console.log(` Status: ${url}/call/status`);
    });
    
  } catch (error) {
    console.error('Server startup failed:', error);
    process.exit(1);
  }
};

startServer();

// WebSocket handlers
wss.on('connection', require('./services/mediaStream')(wss));

module.exports = app;