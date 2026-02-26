# BILLING & SUBSCRIPTIONS SKILL

## PURPOSE

Load when working on Stripe billing, subscription tiers, feature gating, entitlements, pricing page, or subscription management flows.

## HOW IT WORKS IN THIS CODEBASE

**Billing architecture:**

```
lib/
├── billing/            → Stripe customer helpers
├── billing-sync/       → Subscription sync utilities
├── tier-config-db/     → Tier definitions from DB
├── feature-gate/       → Feature access by tier
└── feature-flags/      → Runtime feature toggles (DB-backed)
```

**Subscription tiers:** Starter, Pro, Business (prices in `STRIPE_PRICE_*` env vars)

**Flow: New subscription**

1. User clicks upgrade on `/webapp/settings/billing`
2. `POST /api/billing/create-checkout-session` → creates Stripe session
3. User completes checkout on Stripe hosted page
4. Stripe webhook fires `checkout.session.completed`
5. `POST /api/webhook/stripe` processes → updates `users.tier` in DB
6. User now has new entitlements

**Flow: Subscription webhook**

1. Stripe event arrives at `POST /api/webhook/stripe`
2. Signature verified with `STRIPE_WEBHOOK_SECRET`
3. Idempotency checked via `webhook_events` table
4. User `tier` and `subscription_status` updated in `users` table
5. Return `200` (success), `400` (don't retry), `500` (retry)

**Feature gating:**

```typescript
import { canAccess } from '@/lib/feature-gate';

const hasAccess = await canAccess(userId, 'advanced_analytics');
if (!hasAccess) return NextResponse.json({ error: 'Upgrade required' }, { status: 403 });
```

## STEP-BY-STEP: Add a new paid feature

1. Add feature to tier config in `lib/tier-config-db/`
2. Add feature flag entry in `feature_flags` table
3. Gate the API route with `canAccess(userId, 'feature-name')`
4. Add upgrade prompt in the UI using `useEntitlements` hook
5. Update pricing page if the feature is a selling point

## STEP-BY-STEP: Handle a Stripe webhook event

See `app/api/webhook/stripe/route.ts` for the full pattern:

1. `stripe.webhooks.constructEvent(body, sig, secret)` — verify first
2. Check `webhook_events` table for duplicate event ID
3. Process the event (update `users` table)
4. Insert event ID into `webhook_events` (idempotency)
5. Return `200`

## GOTCHAS

- **Webhook idempotency is MANDATORY** — Stripe retries failed webhooks. Always check `webhook_events` table.
- **Stripe API version:** `2025-11-17.clover` — pinned in `lib/stripe.ts`. Don't upgrade without reading changelog.
- **Deleted customers:** Check `customer.deleted` flag before using a Stripe customer object.
- **Customer ID caching:** `billing_customers` table caches `user_email → stripe_customer_id` to avoid expensive lookups.
- **Test vs Live keys:** `sk_test_*` for dev/staging, `sk_live_*` for production only. Webhooks use different secrets per environment.
- **Cancel vs pause:** "Cancel" ends subscription at period end. "Pause" is not supported — use cancel + reactivation.

## REFERENCE FILES

- `app/api/webhook/stripe/route.ts` — full webhook handler
- `app/api/billing/create-checkout-session/route.ts` — checkout flow
- `lib/billing/helpers/createStripeCustomer.ts` — customer creation
- `lib/feature-gate/` — feature access checks
- `hooks/useEntitlements.ts` — client-side entitlement hook

## RETROFIT LOG

## LAST UPDATED

2025-02-26
