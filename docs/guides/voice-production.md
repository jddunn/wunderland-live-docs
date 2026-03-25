---
sidebar_position: 13
---

# Voice Production Deployment

Checklist and architecture for deploying voice agents in production.

## TLS / WSS Configuration

Voice WebSocket connections must use WSS (WebSocket Secure) in production. Configure TLS at the reverse proxy level:

```nginx
# nginx example
location /voice/ws {
    proxy_pass http://localhost:3777;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection "upgrade";
    proxy_read_timeout 86400;
}
```

For telephony webhooks (Twilio/Telnyx/Plivo), the webhook URL must be HTTPS. Use a reverse proxy or ngrok for development.

## Telephony Webhook Security

Always verify webhook signatures in production:

```json
{
  "telephony": {
    "provider": "twilio",
    "verifySignatures": true,
    "authToken": "your-auth-token"
  }
}
```

Without signature verification, anyone can send fake call events to your webhook endpoint.

## Monitoring

Key metrics to track:

| Metric | Target | Alert Threshold |
|--------|--------|-----------------|
| STT latency (P95) | <500ms | >1000ms |
| TTS latency (P95) | <300ms | >800ms |
| End-to-end turn latency | <2s | >4s |
| Barge-in rate | <30% | >50% (agent talking too long) |
| STT error rate | <2% | >5% |
| Call drop rate | <1% | >3% |
| Concurrent calls | varies | >80% capacity |

## Capacity Planning

Each active voice call consumes:
- ~1 WebSocket connection
- ~2-5 MB RAM (audio buffers, session state)
- ~64 kbps bandwidth per direction (mu-law telephony) or ~256 kbps (raw PCM WebSocket)

Rule of thumb: a single 2-core server handles 50-100 concurrent voice calls comfortably.

## Call Logging

Enable call logging for debugging and compliance:

```json
{
  "telephony": {
    "logCalls": true,
    "logDir": "./call-logs",
    "retentionDays": 90
  }
}
```

Logs include: call metadata (duration, participants, DTMF), full transcript with speaker labels and timestamps, and agent decisions.

## Multi-Region Architecture

For low-latency voice, deploy close to your users:
- US East + US West for North America
- EU West for Europe
- AP Southeast for Asia-Pacific

Each region runs its own voice server connecting to the nearest STT/TTS provider endpoints. The LLM backend can be centralized (latency is less sensitive for the reasoning step).

## Graceful Degradation

Configure fallback behavior when providers fail:

```json
{
  "voice": {
    "stt": {
      "provider": "deepgram",
      "fallback": "whisper-local"
    },
    "tts": {
      "provider": "elevenlabs",
      "fallback": "openai"
    }
  }
}
```

If the primary provider times out (>5s) or returns an error, the pipeline automatically switches to the fallback provider for the remainder of the call.
