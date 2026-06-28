# ASCEND AI

Premium mobile-first web app for AI-powered facial aesthetics analysis, personalized 30-day ascension plans, and progress tracking.

## Tech Stack

- **Next.js 15** (App Router)
- **TypeScript**
- **TailwindCSS 4**
- **Framer Motion**
- **OpenAI GPT-4o Vision**
- **IndexedDB** (primary on-device storage, LocalStorage fallback)

## Features

- No accounts, registration, login, or sessions
- Opens directly to the Home Dashboard
- Multi-step onboarding (saved locally)
- Photo upload with quality validation
- AI facial & posture analysis (25+ scored metrics)
- Personalized 30-day Ascension Plan
- Daily checklist with streak tracking
- Weekly progress comparisons (Premium)
- AI Coach chat (Premium)
- Challenges
- Statistics dashboard
- Fully offline except OpenAI API calls

## Getting Started

```bash
npm install
cp .env.example .env
# Add OPENAI_API_KEY
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — redirects to `/dashboard`.

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `OPENAI_API_KEY` | Yes | Vision AI analysis, plans, coach, progress |

## Data Storage

All user data is stored locally on the device:

- **IndexedDB** (`ascend-ai-db`) — primary store with automatic backups
- **LocalStorage** — fallback and legacy migration from `ascend-ai-data`

Stored data includes photos, analyses, plans, tasks, challenges, streaks, workout/nutrition plans, weight history, measurements, settings, theme, notifications, premium state, and AI coach chat.

Data loads instantly on app open. Changes auto-save after every update. Users can export or clear data from Settings.

## Deployment (Vercel)

1. Push to GitHub and import in Vercel
2. Set `OPENAI_API_KEY`
3. Deploy — no database setup needed

## License

Private — All rights reserved.
