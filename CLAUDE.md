# Wealth Lead Engine

## Quick Start
```bash
npm run dev  # starts on localhost:3000
```

## Tech Stack
- Next.js 16 (App Router, Turbopack)
- TypeScript
- In-memory stores (no database — demo purposes)
- bcryptjs for password hashing
- HMAC-signed stateless cookie sessions

## Demo Credentials
- **Dashboard login**: `demo@wealthleadengine.com` / `demo123`

## Key Routes
- `/` — Banner preview page (ads/LinkedIn preview)
- `/lp` — Full landing page
- `/assessment` — Funnel questionnaire
- `/sg`, `/uae`, `/id` — Country-specific funnels
- `/login` — Advisor login
- `/dashboard` — Advisor dashboard

## Architecture Notes
- Session: stateless HMAC-signed cookie (no server-side store)
- Leads stored in-memory Map (reset on restart)
- Nurture sequences in-memory (reset on restart)
- Content generation: `/api/content/generate` (needs OPENAI_API_KEY)
- Vercel deploy: `vercel --prod` from project root
