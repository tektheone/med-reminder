# Medication Reminder System

A voice-driven medication reminder system using Twilio, Deepgram, and ElevenLabs for real-time patient interactions.

![System Architecture](https://i.imgur.com/mE6kJKl.png)

## Features

- Initiate medication confirmation calls via REST API
- Real-time speech recognition (STT) and synthesis (TTS)
- Voicemail/SMS fallback for unanswered calls
- Detailed call logging with patient responses
- WebSocket-based media streaming
- Patient callback handling

## Prerequisites

- Node.js v18+
- Ngrok account (free tier)
- Twilio account with voice-enabled number
- Deepgram API key
- ElevenLabs API key

## Setup Instructions

### 1. Clone Repository
```bash
git clone https://github.com/yourusername/med-reminder.git
cd med-reminder
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Configuration
```bash
TWILIO_ACCOUNT_SID=
TWILIO_AUTH_TOKEN=
TWILIO_PHONE_NUMBER=
DEEPGRAM_API_KEY=
ELEVENLABS_API_KEY=
ELEVENLABS_VOICE_ID=
NGROK_AUTH_TOKEN=
```

### 4. Running Development Server
```bash
npm run dev
```