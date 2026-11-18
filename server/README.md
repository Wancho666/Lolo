# SOS SMS API

This small Node service keeps the PhiSMS token outside the Expo app. It accepts the app's `POST /sos` request and forwards the SMS to the configured PhiSMS send endpoint.

## Local setup

1. Copy `.env.example` to `.env.local` in this folder.
2. Replace `PHILSMS_API_TOKEN` with a newly generated token. Do not commit `.env.local` or put the token in an `EXPO_PUBLIC_` variable.
3. Set `PHILSMS_SENDER_ID` to a sender ID approved for your PhiSMS account.
4. Set `SOS_ALLOWED_RECIPIENTS` to the emergency contact number in international digits-only format. Multiple recipients can be comma-separated.
5. From this folder, run `npm start`.
6. In the project root, copy `.env.example` to `.env.local` and set `EXPO_PUBLIC_SOS_API_URL` to the backend address. `http://10.0.2.2:8787/sos` is for the Android emulator; for a physical phone, use the computer's LAN IP and allow port 8787 through the firewall.
7. Restart Expo after changing environment values.

The server exposes `GET /health` and accepts `POST /sos` with `{ "to": "+639171234567", "message": "SOS: I need help." }`. It forwards `{ "recipient", "sender_id", "type": "plain", "message" }` to `PHILSMS_SEND_URL` using Bearer authorization.

The configured provider URL defaults to the common PhiSMS v3 path `/sms/send`. Confirm the exact endpoint and payload against your PhiSMS account documentation before a paid test. A successful response means the provider accepted the request, not that the handset received the SMS.

## Checks

Run `npm test` from this folder to exercise the API with a mocked provider. It does not send a real SMS.