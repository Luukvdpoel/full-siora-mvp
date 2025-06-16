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

## Useful commands

- `npm run dev:creator` – start the dev server
- `npm run build -w apps/creator` – build for production
- `npm run lint -w apps/creator` – run ESLint
