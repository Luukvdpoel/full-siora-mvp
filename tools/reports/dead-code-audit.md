# Dead Code & Hidden Features Audit

## Orphan Routes
Routes present under `apps/web/app` but not referenced via `Link` or router navigation. Total detected: 89. Sample:

- /(auth)/instagram/callback
- /(auth)/instagram/login
- /admin/invite
- /analytics
- /billing
- /brand
- /brands/[id]
- /campaign/new
- /campaigns/[id]/applications
- /campaigns/[id]/messages/[creatorId]
- /creator/analyze
- /creator/applications
- /creator/brand-discovery/[id]
- /creator/brand-discovery
- /contract

## Unused Components
Components with no imports in the codebase:

- apps/web/components/ChatSidebar.tsx
- apps/web/components/CampaignBriefForm.tsx
- apps/web/components/SavedCreatorCard.tsx
- apps/web/components/CreatorPreview.tsx
- apps/web/components/CollabRequestModal.tsx

## Unused Hooks/Utils
Helpers and utilities that are never imported:

- apps/web/lib/trpcClient.ts
- apps/web/utils/instagram.ts
- packages/shared-ui/src/components/ThemeToggle 2.tsx
- packages/shared-ui/src/components/NavLink 2.tsx
- packages/shared-ui/src/components/Nav 2.tsx
- packages/shared-ui/src/components/PageTransition 2.tsx

## Hidden GPT features
Code invoking GPT/OpenAI not surfaced in UI:

- packages/shared-utils/src/generateSmartPitch.ts

## Buttons with no handlers
Buttons rendered without click handlers or meaningful action:

- apps/web/app/admin/invite/page.tsx line 33
- apps/web/app/feedback/[id]/page.tsx line 110
- apps/web/app/home/preview/page.tsx line 23
- apps/web/app/creator/performance/page.tsx line 89
- apps/web/app/creator/campaigns/[id]/apply/page.tsx line 94
- apps/web/app/creator/contracts/new/page.tsx line 151
- apps/web/app/creator/contracts/review/page.tsx line 43

## Localhost references
No hardcoded `localhost` endpoints were detected.

## Suggestions
- Review orphan routes to determine if they should be surfaced or removed.
- Remove or refactor unused components and utilities.
- Expose hidden GPT-powered utilities where appropriate.
- Add handlers to inert buttons or replace them with semantic elements.
