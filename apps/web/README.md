# Web App

This unified Next.js application merges the former `brand`, `creator` and `home` apps into a single project.

- Core dashboard pages live directly under `app/`.
- Creator routes are under `app/creator/`.
- Marketing pages are under `app/home/`.
- Supporting modules from the old apps are found in `/creator` and `/home`.

## Setup

1. Install dependencies from the repository root:

```bash
npm install
```

2. Start the development server:

```bash
npm run dev:web
```

## Environment variables

Set the following variables in your `.env` files or Vercel project:

- `DATABASE_URL` – PostgreSQL connection string (required)
- `WAITLIST_BASELINE` – number added to live waitlist count (optional, default 50)
- `SLACK_WEBHOOK_URL` – Slack webhook for new waitlist signups (optional)
- `RESEND_API_KEY` and `RESEND_FROM` – to send confirmation emails (optional)
- `POSTHOG_API_KEY` and `NEXT_PUBLIC_POSTHOG_KEY` – analytics keys (optional)
- `IP_HASH_SALT` – random string used to hash IP addresses (optional)

## Useful commands

- `npm run dev:web` – start the dev server with Turborepo
- `npm run build -w apps/web` – create a production build
- `npm run lint -w apps/web` – run ESLint

## Dashboard

Visit `/auth/login` to log in. After signing in, head to `/brands` to search creator personas. Results can be filtered by tone, platform and vibe. Each profile can be saved to your personal shortlist which is stored in your browser using `localStorage`. View your selections any time at `/shortlist`.

`/dashboard` and `/personas` remain available for exploring personas without authentication.

You can also try `/intent` for a quick campaign intent form that returns creators sorted by audience and tone fit.
