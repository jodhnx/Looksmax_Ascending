# ASCEND AI

Premium mobile-first web app for AI-powered facial aesthetics analysis, personalized 30-day ascension plans, and progress tracking.

## Tech Stack

- **Next.js 15** (App Router)
- **TypeScript**
- **TailwindCSS 4**
- **Framer Motion**
- **OpenAI GPT-4o Vision**
- **LocalStorage** (all user data on-device)
- **Admin cookie auth** (admin panel only)

## Features

- No user registration or login required
- Multi-step onboarding (saved locally)
- Photo upload with quality validation
- AI facial & posture analysis (25+ scored metrics)
- Personalized 30-day Ascension Plan
- Daily checklist with streak tracking
- Weekly progress comparisons (Premium)
- AI Coach chat (Premium)
- Challenges
- Statistics dashboard
- Admin panel for configuration

## Getting Started

```bash
npm install
cp .env.example .env
# Add OPENAI_API_KEY
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

Admin panel: [http://localhost:3000/admin/login](http://localhost:3000/admin/login)

Default admin credentials (set in `.env`):
- `ADMIN_USERNAME=admin`
- `ADMIN_PASSWORD=admin123`

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `OPENAI_API_KEY` | Yes | Vision AI analysis |
| `ADMIN_USERNAME` | Yes | Admin login username |
| `ADMIN_PASSWORD` | Yes | Admin login password |
| `ADMIN_SECRET` | Recommended | Cookie signing secret |
| `APP_CONFIG` | Optional | JSON premium/free tier config |

## Data Storage

All user progress is stored in browser **LocalStorage** (`ascend-ai-data`):
- Photos, analyses, plans, tasks, challenges, settings, chat history

Users can export/clear data from Settings. No database required.

## Deployment (Vercel)

1. Push to GitHub and import in Vercel
2. Set environment variables from `.env.example`
3. Deploy — no database setup needed

## License

Private — All rights reserved.
