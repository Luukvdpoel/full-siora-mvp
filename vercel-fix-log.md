# Vercel Deployment Fix Log

## Summary of Fixes
- Updated `vercel.json` to run the web build via Turborepo filter.
- Added Node engine requirement in `package.json`.
- Simplified `apps/web` build script and added a 404 page.
- Enabled standalone output in `apps/web/next.config.ts`.
- Fixed syntax error in `apps/web/app/matches/page.tsx`.
- Verified Prisma generate runs in postinstall.
- Ran `pnpm install` and `pnpm build --filter=web` to ensure `next build` succeeds.
- Attempted `vercel link` which failed due to missing credentials.

## Test Commands
```
pnpm install
pnpm build --filter=web
pnpm lint (failed: brand lint config prompt)
```
