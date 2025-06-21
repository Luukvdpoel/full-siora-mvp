# Creator App

This directory contains the Next.js application used by creators.

## Setup

1. Install dependencies from the repository root:

```bash
npm install
```

2. Copy the example environment file and provide your values:

```bash
cp apps/creator/.env.example apps/creator/.env.local
```

Update `.env.local` with the following variables:

- `DATABASE_URL` – Prisma database connection
- `NEXTAUTH_URL` – URL for NextAuth (e.g. `http://localhost:3000`)
- `NEXTAUTH_SECRET` – session secret for NextAuth
- `EMAIL_SERVER` – SMTP connection string
- `EMAIL_FROM` – sender address for authentication emails
- `OPENAI_API_KEY` – your OpenAI API key

3. Start the development server:

```bash
npm run dev:creator
```

## Authentication

Magic link sign-in is handled with [NextAuth.js](https://next-auth.js.org/).
Configure `EMAIL_SERVER` and `EMAIL_FROM` then visit `/signin` to request your login link.

## Useful commands

- `npm run dev:creator` – start the dev server
- `npm run build -w apps/creator` – build for production
- `npm run lint -w apps/creator` – run ESLint

## Onboarding Drafts

Use `/api/onboarding-draft` to save or load onboarding progress for a creator.

- `POST /api/onboarding-draft` – body `{ userId: string, progress: object }` saves a draft
- `GET /api/onboarding-draft?userId=123` – retrieves saved progress if available

For local persistence during onboarding, `lib/localOnboarding.ts` exposes
`saveOnboardingDraft(progress)` and `loadOnboardingDraft()` which store the
progress in `localStorage`.
