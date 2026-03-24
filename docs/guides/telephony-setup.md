---
title: "Telephony Setup"
sidebar_position: 6
---

# Telephony Setup

Connect your Wunderland agent to phone calls via Twilio, Telnyx, or Plivo. Your agent can make and receive calls, speak with callers using the streaming voice pipeline, and handle DTMF digit input.

## Prerequisites

- A Wunderland agent configured with voice enabled
- An account with at least one telephony provider (Twilio, Telnyx, or Plivo)
- A publicly accessible URL for webhooks (use ngrok for local development)

## Provider Setup

### Twilio

1. Sign up at [twilio.com](https://www.twilio.com)
2. Get your Account SID and Auth Token from the console
3. Purchase a phone number with voice capabilities
4. Set environment variables:

```bash
export TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
export TWILIO_AUTH_TOKEN=your_auth_token
```

### Telnyx

1. Sign up at [telnyx.com](https://telnyx.com)
2. Create a Call Control Application in the Mission Control Portal
3. Note your API Key and Connection ID
4. Set environment variables:

```bash
export TELNYX_API_KEY=KEY_xxxxxxxxxxxxxxxx
export TELNYX_CONNECTION_ID=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
```

### Plivo

1. Sign up at [plivo.com](https://www.plivo.com)
2. Get your Auth ID and Auth Token from the dashboard
3. Purchase a phone number
4. Set environment variables:

```bash
export PLIVO_AUTH_ID=your_auth_id
export PLIVO_AUTH_TOKEN=your_auth_token
```

## Configuration

### agent.config.json

```json
{
  "voice": {
    "enabled": true,
    "pipeline": "streaming",
    "stt": "deepgram",
    "tts": "openai",
    "telephony": {
      "provider": "twilio",
      "fromNumber": "+15551234567",
      "inboundPolicy": "open",
      "callMode": "conversation",
      "webhookBaseUrl": "https://your-server.com/api/voice"
    }
  }
}
```

### CLI Flags

```bash
# Start with telephony enabled
wunderland chat --voice \
  --telephony-provider twilio \
  --telephony-webhook-port 3001

# The webhook server starts at http://localhost:3001/api/voice
# Configure your Twilio number to point webhooks to this URL
```

## Call Modes

### Conversation Mode

Full duplex conversation — the agent listens, thinks, and responds in real-time:

```
Phone call → mu-law 8kHz audio → TelephonyStreamTransport
  → PCM 16kHz → STT (Deepgram/Whisper) → Endpoint Detection
  → LLM Agent → TTS (OpenAI/ElevenLabs) → PCM → mu-law → Phone
```

### Notify Mode

One-way message — the agent speaks a message and hangs up:

```bash
# Programmatic outbound call
wunderland call --to +15559876543 --mode notify --message "Your appointment is confirmed for tomorrow at 3pm."
```

## Webhook Configuration

### Twilio
In the Twilio console, set your phone number's Voice webhook URL to:
```
https://your-server.com/api/voice/webhook/twilio
```
Set the status callback URL to:
```
https://your-server.com/api/voice/status/twilio
```

### Telnyx
In the Telnyx Mission Control Portal, set your Connection's webhook URL to:
```
https://your-server.com/api/voice/webhook/telnyx
```

### Plivo
In the Plivo console, set your Application's Answer URL to:
```
https://your-server.com/api/voice/webhook/plivo
```

## DTMF Handling

When a caller presses a digit during a call, the agent receives it as context:

```
[User pressed digit: 2]
```

The LLM decides what the digit means. No IVR menu engine — your agent IS the IVR. Prompt your agent to handle digits:

```
You are a phone receptionist. When the user presses:
- 1: Transfer to sales
- 2: Transfer to support
- 0: Speak to a human operator
```

## Local Development with ngrok

```bash
# Start ngrok tunnel
ngrok http 3001

# Use the ngrok URL as your webhook base
wunderland chat --voice \
  --telephony-provider twilio \
  --telephony-webhook-port 3001
# Then set Twilio webhook to: https://abc123.ngrok.io/api/voice/webhook/twilio
```

## Webhook Verification

All three providers verify webhook authenticity:

| Provider | Method | Header |
|----------|--------|--------|
| Twilio | HMAC-SHA1 | `X-Twilio-Signature` |
| Telnyx | Ed25519 | `X-Telnyx-Signature-Ed25519` |
| Plivo | HMAC-SHA256 | `X-Plivo-Signature-V3` |

Invalid signatures are rejected with 403.

## Known Limitations

- The telephony webhook server handles call control but does not yet bridge provider media streams into the voice pipeline automatically — this requires manual WS connection setup
- No true incremental LLM streaming yet; full text reply is chunked for TTS
- No multi-party conferencing support
