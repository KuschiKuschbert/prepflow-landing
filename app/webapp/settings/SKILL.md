# SETTINGS SKILL

## PURPOSE

Load when working on the settings pages: backup settings, billing/subscription, user profile, notification preferences, or feature configuration.

## HOW IT WORKS IN THIS CODEBASE

**Settings structure:**

```
app/webapp/settings/
├── page.tsx         ← Settings hub (links to sub-sections)
├── backup/
│   ├── page.tsx     ← Backup settings
│   └── components/
│       ├── GoogleDriveConnection.tsx   ← Connect/disconnect Google Drive
│       └── ...
└── billing/
    └── page.tsx     ← Billing / subscription management
```

**Key pages:**

- `/webapp/settings` — hub with links to all settings
- `/webapp/settings/backup` — Google Drive backup management
- `/webapp/settings/billing` — Stripe subscription management

**GoogleDriveConnection component:**
`app/webapp/settings/backup/components/GoogleDriveConnection.tsx`

**Anti-pattern found (TECH DEBT):**
This file uses native `confirm()` dialog (line 50) which violates the dialog standards. Should be replaced with `useConfirm` hook.

**Billing page:**
`app/webapp/settings/billing/page.tsx` — shows current plan, upgrade options, manage subscription button (opens Stripe portal).

## STEP-BY-STEP: Add a new settings section

1. Create `app/webapp/settings/my-section/page.tsx`
2. Add a link on `app/webapp/settings/page.tsx`
3. Add API routes at `app/api/user/my-setting/route.ts` if needed
4. Use Cyber Carrot design system components

## GOTCHAS

- **`GoogleDriveConnection.tsx` has native `confirm()` call** — this is a known tech debt item. Replace with `useConfirm` when modifying this file.
- **Billing page** shows Stripe data — test with Stripe test mode keys in development

## REFERENCE FILES

- `app/webapp/settings/backup/components/GoogleDriveConnection.tsx` — Google Drive connection
- `app/webapp/settings/billing/page.tsx` — billing/subscription page

## RETROFIT LOG

## LAST UPDATED

2025-02-26
