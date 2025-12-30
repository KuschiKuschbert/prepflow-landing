---
description: How to expose CurbOS to the public internet for external testing
---

# Exposing CurbOS to the Public

To let others access your local CurbOS development server from their own network/phone, follow these steps:

## 1. Install and Start ngrok

If you haven't already, install ngrok:

```bash
brew install ngrok/ngrok/ngrok
```

Configure your auth token (get it from [ngrok.com](https://dashboard.ngrok.com/get-started/your-authtoken)):

```bash
ngrok config add-authtoken YOUR_TOKEN
```

Start the tunnel:

```bash
ngrok http 3000
```

## 2. Note your Public URL

Copy the `https://...ngrok-free.app` URL from the ngrok terminal.

## 3. Update Auth0 Dashboard

Log in to your [Auth0 Dashboard](https://manage.auth0.com/), find your application, and update the following settings:

- **Allowed Callback URLs**: Add `https://YOUR_NGROK_URL/api/auth/callback`
- **Allowed Logout URLs**: Add `https://YOUR_NGROK_URL/api/auth/logout`
- **Allowed Web Origins**: Add `https://YOUR_NGROK_URL`

## 4. Update Environment Variables

In `prepflow-landing/.env.local`, update:

```env
AUTH0_BASE_URL=https://YOUR_NGROK_URL
NEXTAUTH_URL=https://YOUR_NGROK_URL
```

## 5. Restart Dev Server

Restart your Next.js dev server to pick up the new environment variables:

```bash
npm run dev
```

Now anyone can access CurbOS using the `https://YOUR_NGROK_URL/curbos` link!
