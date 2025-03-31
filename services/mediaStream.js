const { Deepgram } = require('@deepgram/sdk');
const ElevenLabs = require('elevenlabs');
const deepgram = new Deepgram(process.env.DEEPGRAM_API_KEY);
const elevenlabs = ElevenLabs({ apiKey: process.env.ELEVENLABS_API_KEY });

module.exports = (wss) => {
  return function handleConnection(ws) {
    let mediaBuffer = [];
    let callSid = null;

    // TTS Generation
    const generateTTS = async () => {
      const ttsStream = await elevenlabs.generate({
        text: "Hello, this is your medication reminder...",
        voice: process.env.ELEVENLABS_VOICE_ID,
        stream: true
      });

      ttsStream.on('data', (chunk) => {
        ws.send(JSON.stringify({
          event: 'media',
          media: {
            payload: chunk.toString('base64')
          }
        }));
      });
    };

    // STT Processing
    const dgConnection = deepgram.transcription.live({
      punctuate: true,
      interim_results: false
    });

    dgConnection.addListener('transcriptReceived', (data) => {
      const transcript = data.channel.alternatives[0].transcript;
      console.log('Patient Response:', transcript);
      logCall(callSid, 'response_received', { transcript });
    });

    // WebSocket Message Handling
    ws.on('message', (data) => {
      const message = JSON.parse(data);
      
      if (message.event === 'start') {
        callSid = message.start.callSid;
        generateTTS();
      }
      
      if (message.event === 'media') {
        dgConnection.send(message.media.payload);
      }
    });

    // Cleanup
    ws.on('close', () => {
      dgConnection.finish();
    });
  };
};