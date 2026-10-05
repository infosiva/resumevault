# resumevault

AI-powered ai-resume-builder app built with Next.js and Claude AI

**Live:** https://ai-resume-builder-vercel.vercel.app

## Tech stack
Next.js, React, TypeScript, Tailwind CSS, Stripe

## Run locally
```bash
git clone https://github.com/infosiva/resumevault.git && cd resumevault
npm install
cp .env.example .env.local   # names only, fill in your own values
npm run dev                    # http://localhost:3000
```

## Scripts
- `npm run dev`
- `npm run build`
- `npm run start`
- `npm run lint`

## Environment variables
Names only; never commit real values. Everything is optional unless the feature needs it.

**AI providers (free-first chain; any one is enough):** `GROQ_API_KEY`, `OLLAMA_HOST`

- `CRON_SECRET`
- `GNEWS_API_KEY`
- `NOTIFY_EMAIL`
- `PROMO_CODES`
- `RESEND_API_KEY`
- `RESEND_AUDIENCE_ID`
- `RESEND_AUDIENCE_ID_RESUMEVAULT`
- `STRIPE_PRICE_ID`
- `STRIPE_SECRET_KEY`

## Deploy
Vercel (`vercel --prod`). Set the variables above in the project settings.

## Status & open items
See `HANDOFF.md` if present; otherwise open an issue.
