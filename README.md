# VOXON AI

A Next.js starter for a glassmorphic AI workspace with AI chat, image studio UI, video timeline UI, and manual EasyPaisa payment-request intake.

## Important launch notes

This is a **deployable starter**, not a fully production-ready AI media service. The chat API becomes live when a Gemini API key is configured. Image generation and video rendering require a provider and server-side integration. The timeline and captions are UI previews, not a real non-linear video editor. Payment submission is intentionally **not** automatic Pro verification.

Never grant paid entitlements based only on a user-entered transaction ID. Verify the transaction through a trusted payment record/admin workflow, then store Pro entitlements server-side against an authenticated user. The sample payment endpoint uses memory only and will not persist requests across serverless invocations; replace it with a database before launch. Add authentication, authorization, abuse controls, logging, privacy policy, and terms before accepting real users/payments.

## Run locally

1. Install Node.js 20 or later.
2. Extract this ZIP and open the `voxon-ai` folder in a terminal.
3. Run `npm install`.
4. Copy `.env.example` to `.env.local` and add `GEMINI_API_KEY`.
5. Run `npm run dev`, then open http://localhost:3000.

Without a Gemini API key, the app shows a setup message instead of pretending chat works.

## Deploy to Vercel

1. Upload the extracted project to a GitHub repository.
2. In Vercel, import that repository. Framework preset should be Next.js.
3. In Project Settings → Environment Variables, add `GEMINI_API_KEY`.
4. Deploy. Redeploy after changing environment variables.

## GitHub Pages note

This project uses Next.js API routes, so **GitHub Pages alone cannot run the live API**. Use Vercel or another Node/serverless host for the application. A GitHub Pages static export would not support the included server routes.

## Project structure

```text
voxon-ai/
├── app/
│   ├── api/
│   │   ├── chat/route.ts
│   │   └── payment-request/route.ts
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── .env.example
├── .gitignore
├── next.config.mjs
├── package.json
└── tsconfig.json
```

## Provider integration roadmap

- **Image Studio:** connect an image provider through a server API route; keep API keys server-side; return an image URL or a storage-backed asset.
- **Video generation:** connect a video provider, enforce Free/Pro duration limits on the server, and process jobs asynchronously.
- **Editor:** integrate a media engine or browser editing library; implement real trim, tracks, captions, render/export, and file persistence.
- **Auth & entitlements:** add an auth provider and database. Check subscription state on every privileged API route.
- **Payment review:** persist requests to a database, create an admin-only review interface, verify payment independently, then issue an auditable entitlement.

## Security checklist

- Do not expose API keys in client-side code.
- Add authentication and authorization before personal data or Pro access.
- Add rate limiting and request size limits.
- Add CSRF/origin protections as appropriate for your auth setup.
- Store payment requests in a database with restricted access and retention limits.
- Publish accurate Terms, Privacy, and support contact details.
