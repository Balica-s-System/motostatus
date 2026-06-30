<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Build & Dev
- Build: `bun next build` (WSL)
- Dev: `bun next dev -p 3000`

## Error Pages
- `/session-expired` — 401 (sessão expirada, renomeado porque `unauthorized` é nome reservado do Next.js)
- `/forbidden` — 403 (sem permissão)
- `/error` — 500 (erro interno)
- Reusable component: `components/general/error-page.tsx`

## Standardized Error Handling
- `lib/api-error.ts`: `AppError` hierarchy (`UnauthorizedError`, `ForbiddenError`, `NotFoundError`, `ConflictError`)
- `apiError(code, msg)` → returns `Response`; `handleApiError(err)` → catch-all
- All API routes use `handleApiError(error)`
- DALs throw `AppError` subclasses (not plain `Error`)
- Client forms redirect on `res.status === 401` → `/session-expired`, `403` → `/forbidden`
- `lib/api-client.ts`: optional `apiFetch<T>()` wrapper with auto-redirect

## Shareable Invite Links
- `ShareableInvite` model in Prisma with UUID token, 10min expiry
- `POST /api/invite/shareable` — creates a shareable invite link (admin only)
- `GET /api/invite/shareable?token=xxx` — validates token (public)
- `POST /api/invite/shareable/accept` — accepts invite, creates member (requires auth)
- `/invite/join/[token]` — public landing page with accept button
- `lib/data/shareable-invite.ts` — DAL: `createShareableInvite`, `validateShareableInvite`, `acceptShareableInvite`
- Email invites (48h) handled separately via better-auth's `createInvitation` (DAL in `lib/data/invite.ts`, API at `/api/dealership/[slug]/invite`)

## Misc
- `verify-request` page now respects `callbackURL` query param for OTP redirect
- Package manager: `bun` (use `bun next build`, `bun next dev`, `bunx prisma`)
