# Brand App

This directory contains the Next.js dashboard for brands.

## Setup

1. Install dependencies from the repository root:

```bash
npm install
```

2. Start the development server:

```bash
npm run dev:brand
```

## Environment variables

This app does not require any environment variables by default.

## Useful commands

- `npm run dev:brand` – start the dev server with Turborepo
- `npm run build -w apps/brand` – create a production build
- `npm run lint -w apps/brand` – run ESLint

## Dashboard

Visit `/signin` to log in. After signing in, head to `/brands` to search creator personas. Results can be filtered by tone, platform and vibe. Each profile can be saved to your personal shortlist which is stored in your browser. View your selections any time at `/shortlist`.

`/dashboard` and `/personas` remain available for exploring personas without authentication.

You can also try `/intent` for a quick campaign intent form that returns creators sorted by audience and tone fit.
