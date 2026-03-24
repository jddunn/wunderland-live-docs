---
title: "Build a Phone Agent"
sidebar_position: 4
---

# Build an AI Phone Agent

This tutorial walks you through building an AI receptionist that answers phone calls, handles DTMF input, and routes callers — all using Wunderland's voice pipeline.

## What You'll Build

An AI agent that:
- Answers inbound phone calls
- Greets callers and asks how it can help
- Handles digit presses ("Press 1 for hours, 2 for directions")
- Responds naturally to spoken questions
- Transfers or hangs up gracefully

## Prerequisites

- Wunderland CLI installed (`npm i -g wunderland`)
- A Twilio account with a phone number ([setup guide](/docs/guides/telephony-setup))
- An OpenAI API key (for STT + TTS + LLM)
- ngrok for local webhook tunneling

## Step 1: Create Your Agent

```bash
wunderland new phone-receptionist
cd phone-receptionist
```

## Step 2: Configure Voice + Telephony

Edit `agent.config.json`:

```json
{
  "name": "Phone Receptionist",
  "llm": {
    "provider": "openai",
    "model": "gpt-4o"
  },
  "voice": {
    "enabled": true,
    "pipeline": "streaming",
    "stt": "deepgram",
    "tts": "openai",
    "ttsVoice": "nova",
    "endpointing": "heuristic",
    "bargeIn": "hard-cut",
    "telephony": {
      "provider": "twilio",
      "fromNumber": "+15551234567",
      "inboundPolicy": "open",
      "callMode": "conversation",
      "webhookBaseUrl": "https://your-ngrok-url.ngrok.io/api/voice"
    }
  },
  "systemPrompt": "You are a friendly AI receptionist for Acme Corp. Answer phone calls professionally. When the caller presses a digit, respond accordingly:\n- 1: Tell them business hours (Mon-Fri 9am-5pm)\n- 2: Give directions (123 Main Street, Anytown)\n- 3: Transfer to a human (say you'll connect them and end the call)\n- 0: Repeat the menu\n\nAlways greet with: 'Thank you for calling Acme Corp. How can I help you today? You can also press 1 for hours, 2 for directions, or 3 to speak with someone.'"
}
```

## Step 3: Set Up Environment

```bash
# Telephony
export TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
export TWILIO_AUTH_TOKEN=your_auth_token

# Voice
export OPENAI_API_KEY=sk-...
export DEEPGRAM_API_KEY=your_deepgram_key
```

## Step 4: Start the Agent

```bash
# Terminal 1: Start ngrok
ngrok http 3001

# Terminal 2: Start the agent
wunderland chat --voice \
  --voice-stt deepgram \
  --voice-tts openai \
  --telephony-provider twilio \
  --telephony-webhook-port 3001
```

## Step 5: Configure Twilio Webhook

1. Copy your ngrok URL (e.g., `https://abc123.ngrok.io`)
2. In the Twilio Console → Phone Numbers → your number
3. Set Voice webhook to: `https://abc123.ngrok.io/api/voice/webhook/twilio`
4. Set Status callback to: `https://abc123.ngrok.io/api/voice/status/twilio`

## Step 6: Call Your Agent

Dial your Twilio number. You should hear your AI receptionist greet you.

## How It Works

```
Caller dials → Twilio → webhook → Wunderland agent
  → TwiML: <Connect><Stream ws://localhost:8765 />
  → Audio streams bidirectionally over WebSocket
  → STT transcribes → LLM responds → TTS speaks
  → If caller presses digit → [User pressed digit: X] injected
  → LLM interprets digit per system prompt
```

## Next Steps

- Add [speaker diarization](/docs/guides/voice-runtime) to identify multiple callers
- Use [semantic endpointing](/docs/guides/telephony-setup) for smarter turn detection
- Deploy to production with a real webhook URL (no ngrok)
- Add call recording and transcript storage
