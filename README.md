# ASCEND AI V2

Premium looksmax application with **fully local** facial analysis. No API keys. No accounts. No database.

## Tech Stack

- **Next.js 15** · **TypeScript** · **TailwindCSS 4** · **Framer Motion**
- **MediaPipe Face Mesh** (468 landmarks) — on-device computer vision
- **IndexedDB** storage (LocalStorage fallback)

## User Flow

Landing → Upload (front + side) → ASCEND Score → 30-day plan → Dashboard → Weekly progress

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

No environment variables required.

## Features

- Local photo validation (one face, lighting, sharpness, angle)
- ASCEND SCORE (0–100) from facial geometry
- Personalized 30-day plan & daily tasks
- Exercise library with animations
- Weekly progress comparisons
- Local ASCEND Coach (rule-based)
- Fully offline after first MediaPipe model load

## Storage

All data persists in IndexedDB on your device.
