# ASCEND AI

Premium mobile-first web app for AI-powered facial aesthetics analysis, personalized 30-day ascension plans, and progress tracking.

## Tech Stack

- **Next.js 15** (App Router)
- **TypeScript**
- **TailwindCSS 4**
- **Shadcn-style UI** (Radix primitives)
- **Framer Motion**
- **Prisma 7** + **PostgreSQL**
- **NextAuth v5**
- **OpenAI GPT-4o Vision**
- **Stripe** subscriptions
- **Vercel** deployment ready

## Features

- Multi-step onboarding (body, lifestyle, face metrics)
- Photo upload with quality validation (lighting, resolution, compression)
- AI facial & posture analysis (25+ scored metrics)
- Personalized 30-day Ascension Plan
- Daily checklist with streak tracking
- Weekly progress comparisons (Premium)
- AI Coach chat (Premium)
- Challenges (30 Day Glow Up, 75 Hard Lite, etc.)
- Statistics dashboard
- Stripe Premium subscriptions ($14.99/mo)
- Notification preferences
- Glassmorphism dark UI with bottom navigation

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment

Copy `.env.example` to `.env` and fill in:

```bash
cp .env.example .env
```

Required:
- `DATABASE_URL` — PostgreSQL connection string
- `AUTH_SECRET` or `NEXTAUTH_SECRET` — `openssl rand -base64 32`
- `NEXTAUTH_URL` — `http://localhost:3000`
- `OPENAI_API_KEY` — for Vision AI analysis

For Premium billing:
- `STRIPE_SECRET_KEY`
- `STRIPE_PREMIUM_PRICE_ID`
- `STRIPE_WEBHOOK_SECRET`

### 3. Set up database

```bash
npx prisma migrate deploy
```

Or for development:

```bash
npm run db:migrate
```

### 4. Run development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Deployment (Vercel)

1. Push to GitHub
2. Import project in Vercel
3. Add environment variables from `.env.example`
4. Use [Vercel Postgres](https://vercel.com/storage/postgres) or [Neon](https://neon.tech) for `DATABASE_URL`
5. Run `npx prisma db push` against production DB
6. Configure Stripe webhook: `https://yourdomain.com/api/stripe/webhook`

## Project Structure

```
src/
├── app/
│   ├── (app)/          # Authenticated app pages
│   ├── api/            # API routes
│   ├── auth/           # Sign in / sign up
│   ├── onboarding/     # Profile setup
│   ├── upload/         # Photo upload & analysis
│   └── analysis/       # Results report
├── components/
│   ├── app/            # App-specific components
│   └── ui/             # Reusable UI primitives
├── lib/                # Auth, Prisma, OpenAI, Stripe, utils
└── generated/prisma/   # Prisma client (auto-generated)
```

## Free vs Premium

| Feature | Free | Premium |
|---------|------|---------|
| AI Analysis | 1 | Unlimited |
| Ascension Plan | 7 days | 30 days |
| AI Coach | — | ✓ |
| Weekly Comparisons | — | ✓ |
| Advanced Stats | — | ✓ |

## License

Private — All rights reserved.
