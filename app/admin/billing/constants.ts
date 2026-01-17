export const BILLING_API = {
  OVERVIEW: '/api/admin/billing/overview',
  SYNC_SUBSCRIPTIONS: '/api/admin/billing/sync-subscriptions',
  HEALTH: '/api/admin/billing/health',
} as const;

export const SYNC_CONFIG = {
  BATCH_LIMIT: 100,
} as const;

export const UI_MESSAGES = {
  SYNC_TITLE: 'Sync Subscriptions',
  SYNC_CONFIRM:
    'Sync all subscriptions from Stripe? This&apos;ll update subscription statuses and reconcile any mismatches. This may take a few moments.',
  SYNC_SUCCESS: (synced: number, errors: number) =>
    `Synced ${synced} subscriptions with ${errors} errors`,
  SYNC_ERROR: 'Failed to sync subscriptions',
  HEALTH_SUCCESS: 'Billing health check passed - no issues found',
  HEALTH_ERROR: 'Failed to check billing health',
  HEALTH_ISSUES_PREFIX: 'Billing health check found issues: ',
} as const;

export const COLORS = {
  BG_DARK: '#1f1f1f',
  BORDER_DARK: '#2a2a2a',
  HOVER_DARK: '#2a2a2a/60',
  BUTTON_BG: '#2a2a2a/40',
} as const;

export const LABELS = {
  CHECK_HEALTH: 'Check Health',
  CHECKING: 'Checking...',
  SYNC: 'Sync Subscriptions',
  SYNC_ACTION: 'Sync',
  SYNCING: 'Syncing...',
  CANCEL: 'Cancel',
} as const;
