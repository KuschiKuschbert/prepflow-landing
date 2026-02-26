# CURBOS SKILL

## PURPOSE
Load when intentionally working on CurbOS integration code. **Normally, do not modify this area.** CurbOS is a protected area that requires explicit bypass.

## PROTECTED AREA WARNING

`app/curbos/` is protected by the pre-commit hook. Any staged changes to this directory will block the commit unless `ALLOW_CURBOS_MODIFY=1` is set.

**Before modifying anything here:**
1. Get explicit user instruction to modify CurbOS
2. Use `ALLOW_CURBOS_MODIFY=1 git commit ...`
3. Test thoroughly before committing
4. Do NOT run automated cleanup tools on CurbOS files

## HOW IT WORKS IN THIS CODEBASE

**CurbOS** is a separate product integrated into PrepFlow. It has its own Supabase project (`NEXT_PUBLIC_CURBOS_SUPABASE_URL`) and uses PrepFlow as a hosting platform.

**Key CurbOS files (DO NOT modify without instruction):**
- `app/curbos/components/LatestVersionBadge.tsx` — shows latest CurbOS version
- `app/curbos/components/passport/PassportIdPage.tsx` — CurbOS passport ID page
- `app/curbos-import/lib/check-subscription.ts` — checks CurbOS subscription
- `app/webapp/cogs/components/COGSRecipeGroupRow.tsx` — has CurbOS integration

**CurbOS API routes:**
- `POST /api/curbos/auth/exchange-token`
- `GET /api/curbos/check-access`
- `POST /api/curbos/public-token`
- `GET /api/curbos/public/validate`
- `POST /api/curbos/setup-public-tokens`

**CurbOS auth flow:**
1. CurbOS user authenticates separately
2. Token exchanged at `/api/curbos/auth/exchange-token`
3. Access validated at `/api/curbos/check-access`
4. Public tokens for anonymous passport access

## GOTCHAS

- **Pre-commit hook WILL block commits** to this directory
- **Tooling exclusions:** ESLint, TypeScript, Prettier, cleanup scripts all skip `app/curbos/`
- **`app/nachotaco/`** is related but even more protected — excluded from git diff in audits

## REFERENCE FILES

- `app/curbos/components/LatestVersionBadge.tsx` — version badge
- `app/api/curbos/check-access/route.ts` — access check
- `app/curbos-import/lib/check-subscription.ts` — subscription check

## RETROFIT LOG
(No retrofitting — protected area)

## LAST UPDATED
2025-02-26
