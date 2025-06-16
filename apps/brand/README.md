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

Visit `/dashboard` in the brand app to search saved creator personas. You can filter by niche, tone and platform. Matches are shown using the `CreatorCard` component.
