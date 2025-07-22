# Vercel Deployment Guide

This document summarizes the steps required to deploy **apps/web** in this repository on Vercel.

## Build and Deploy
1. Ensure dependencies are installed:
   ```bash
   pnpm install
   ```
2. Build the web app:
   ```bash
   pnpm build --filter=web
   ```
   The build should complete without errors, producing output in `apps/web/.next`.

3. In the Vercel dashboard, configure the project to use the following settings:
   - **Root Directory**: `apps/web`
   - **Install Command**: `pnpm install --frozen-lockfile --strict-peer-dependencies`
   - **Build Command**: `pnpm run build --filter=web`
   - **Output Directory**: `apps/web/.next`

## Environment Variables
Copy the values from `apps/web/.env.example` into the Vercel dashboard and adjust them as needed for production. Key variables include:
- `DATABASE_URL`
- `NEXTAUTH_URL`
- `NEXTAUTH_SECRET`
- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
- `OPENAI_API_KEY`
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
- `NEXT_PUBLIC_POSTHOG_KEY`
- `NEXT_PUBLIC_POSTHOG_HOST`

## Monitoring
After deploying, monitor the Vercel build and runtime logs for errors. If the build fails, check that all environment variables are set correctly and that `pnpm build --filter=web` works locally.
