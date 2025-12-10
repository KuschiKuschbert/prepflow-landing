# Stripe Integration Guide

Complete guide for Stripe integration with PrepFlow, including webhook setup, environment variables, database schema, and troubleshooting.

## Overview

PrepFlow uses Stripe for subscription management, payment processing, and billing. The integration includes:

- Subscription creation and management
- Payment processing
- Webhook event handling
- Subscription status synchronization
- Direct subscription management (extend, cancel, reactivate)

## Environment Variables

### Required Variables

```bash
# Stripe API Keys
STRIPE_SECRET_KEY=sk_live_... # or sk_test_... for testing
STRIPE_WEBHOOK_SECRET=whsec_... # Webhook signing secret

# Stripe Price IDs (Monthly subscriptions)
STRIPE_PRICE_STARTER_MONTHLY=price_...
STRIPE_PRICE_PRO_MONTHLY=price_...
STRIPE_PRICE_BUSINESS_MONTHLY=price_...
```

### Getting Stripe Keys

1. **API Keys**: Go to Stripe Dashboard → Developers → API keys
   - Use test keys for development (`sk_test_...`)
   - Use live keys for production (`sk_live_...`)

2. **Price IDs**: Go to Stripe Dashboard → Products → Select product → Copy Price ID
   - Create products for Starter, Pro, and Business tiers
   - Set up monthly recurring prices

3. **Webhook Secret**: Go to Stripe Dashboard → Developers → Webhooks
   - Create webhook endpoint: `https://yourdomain.com/api/webhook/stripe`
   - Copy signing secret (`whsec_...`)

## Database Schema

### Required Tables

The following tables are required for Stripe integration:

#### `users` Table

```sql
-- Subscription fields
subscription_tier VARCHAR(50) DEFAULT 'starter'
subscription_status VARCHAR(50) DEFAULT 'trial'
subscription_expires TIMESTAMP WITH TIME ZONE
stripe_customer_id VARCHAR(255)
stripe_subscription_id VARCHAR(255)
subscription_cancel_at_period_end BOOLEAN DEFAULT FALSE
subscription_current_period_start TIMESTAMP WITH TIME ZONE
```

#### `billing_customers` Table

```sql
user_email VARCHAR(255) UNIQUE NOT NULL
stripe_customer_id VARCHAR(255) NOT NULL
stripe_subscription_id VARCHAR(255)
subscription_status VARCHAR(50)
last_synced_at TIMESTAMP WITH TIME ZONE
```

#### `webhook_events` Table

```sql
stripe_event_id VARCHAR(255) UNIQUE NOT NULL
event_type VARCHAR(100) NOT NULL
processed BOOLEAN DEFAULT FALSE
processed_at TIMESTAMP WITH TIME ZONE
processing_time_ms INTEGER
success BOOLEAN
error_message TEXT
event_data JSONB
```

#### `user_notifications` Table

```sql
user_email VARCHAR(255) NOT NULL
type VARCHAR(50) NOT NULL
title VARCHAR(255) NOT NULL
message TEXT NOT NULL
action_url VARCHAR(500)
action_label VARCHAR(100)
read BOOLEAN DEFAULT FALSE
dismissed BOOLEAN DEFAULT FALSE
expires_at TIMESTAMP WITH TIME ZONE
metadata JSONB
```

### Running Migrations

Execute the following migration files in order:

1. `migrations/add-subscription-tier.sql` - Adds subscription_tier column
2. `migrations/add-stripe-subscription-fields.sql` - Adds Stripe subscription fields
3. `migrations/enhance-billing-customers.sql` - Enhances billing_customers table
4. `migrations/add-webhook-events-table.sql` - Creates webhook_events table
5. `migrations/add-user-notifications-table.sql` - Creates user_notifications table

## Webhook Setup

### 1. Create Webhook Endpoint in Stripe

1. Go to Stripe Dashboard → Developers → Webhooks
2. Click "Add endpoint"
3. Enter endpoint URL: `https://yourdomain.com/api/webhook/stripe`
4. Select events to listen to:
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`

### 2. Configure Webhook Secret

Copy the webhook signing secret and add it to your environment variables:

```bash
STRIPE_WEBHOOK_SECRET=whsec_...
```

### 3. Test Webhook

Use Stripe CLI to test webhooks locally:

```bash
stripe listen --forward-to localhost:3000/api/webhook/stripe
```

## API Endpoints

### User Endpoints

- `GET /api/user/subscription` - Get current user's subscription details
- `POST /api/billing/create-checkout-session` - Create Stripe checkout session
- `POST /api/billing/create-portal-session` - Create Stripe customer portal session
- `POST /api/billing/extend-subscription` - Extend subscription by 1 month
- `POST /api/billing/cancel-subscription` - Cancel subscription (immediate or scheduled)
- `POST /api/billing/reactivate-subscription` - Reactivate cancelled subscription

### Admin Endpoints

- `POST /api/admin/billing/sync-subscriptions` - Sync all subscriptions from Stripe
- `GET /api/admin/billing/health` - Check subscription health and detect mismatches

### Webhook Endpoint

- `POST /api/webhook/stripe` - Stripe webhook handler (handles all Stripe events)

## Webhook Event Handling

The webhook handler processes the following events:

### `checkout.session.completed`

- Retrieves checkout session with expanded line_items
- Extracts tier from metadata or price ID
- Updates user subscription status to 'active'
- Stores subscription ID in database
- Sends subscription activated notification

### `customer.subscription.created`

- Extracts tier from subscription metadata or price ID
- Updates user subscription with tier, status, and expiry dates
- Stores subscription ID and period information
- Sends subscription activated notification

### `customer.subscription.updated`

- Handles status changes (active, past_due, cancelled, trial)
- Updates cancel_at_period_end flag
- Updates subscription expiry and period dates
- Sends cancellation notification if scheduled
- Sends cancellation notification if immediately cancelled

### `customer.subscription.deleted`

- Sets subscription status to 'cancelled'
- Downgrades user to 'starter' tier
- Clears subscription expiry date
- Sends cancellation notification

### `invoice.payment_succeeded`

- Ensures subscription remains active
- Updates subscription expiry dates
- Sends payment succeeded notification

### `invoice.payment_failed`

- Sets subscription status to 'past_due'
- Keeps current tier (doesn't downgrade)
- Sends payment failed notification

## Email Lookup Fallbacks

The webhook uses multiple fallbacks to find user email from Stripe customer ID:

1. **Database lookup** (`billing_customers` table) - Primary method
2. **Checkout session metadata** (`session.metadata.user_email`) - For checkout events
3. **Stripe customer retrieve** - Fetches email from Stripe API
4. **Invoice customer_email** - For invoice events

When email is found via fallback, it's automatically cached in `billing_customers` table for future lookups.

## Idempotency

Webhook events are tracked in `webhook_events` table to prevent duplicate processing:

- Each Stripe event ID is stored with processing status
- Already processed events are skipped
- Failed events can be retried via admin endpoint
- Processing time and errors are logged for debugging

## Subscription Management

### Extending Subscription

Users can extend their subscription by 1 month:

```typescript
POST /api/billing/extend-subscription
{
  "months": 1 // Optional, defaults to 1
}
```

This adds an additional billing period to the current subscription.

### Cancelling Subscription

Users can cancel immediately or schedule cancellation:

```typescript
POST /api/billing/cancel-subscription
{
  "immediate": false // true for immediate, false for scheduled
}
```

Scheduled cancellations keep subscription active until period end.

### Reactivating Subscription

Users can reactivate cancelled subscriptions:

```typescript
POST / api / billing / reactivate - subscription;
```

Removes `cancel_at_period_end` flag and restores subscription to active status.

## Notifications

Subscription events trigger in-app notifications:

- **Subscription Activated**: When subscription becomes active
- **Payment Succeeded**: When payment is processed
- **Payment Failed**: When payment fails (expires in 7 days)
- **Subscription Cancelled**: When subscription is cancelled
- **Subscription Expiring Soon**: 7 days, 3 days, and 1 day before expiry
- **Subscription Reactivated**: When subscription is reactivated

Notifications are stored in `user_notifications` table and can be displayed in the UI.

## Admin Tools

### Subscription Sync

Sync all subscriptions from Stripe to database:

```bash
POST /api/admin/billing/sync-subscriptions
{
  "limit": 100 // Optional, defaults to 100
}
```

Useful for recovery after webhook failures.

### Health Check

Check subscription health and detect mismatches:

```bash
GET /api/admin/billing/health
```

Returns:

- Users with missing subscriptions
- Subscriptions with missing users
- Mismatched statuses between Stripe and database
- Total counts

## Troubleshooting

### Webhook Events Not Processing

1. **Check webhook secret**: Ensure `STRIPE_WEBHOOK_SECRET` matches Stripe dashboard
2. **Check webhook logs**: View `webhook_events` table for processing status
3. **Check email lookup**: Verify `billing_customers` table has correct mappings
4. **Check database**: Ensure all required tables exist

### Subscription Status Mismatches

1. **Run health check**: `GET /api/admin/billing/health`
2. **Sync subscriptions**: `POST /api/admin/billing/sync-subscriptions`
3. **Check webhook logs**: Review `webhook_events` table for errors

### Email Not Found Errors

1. **Check billing_customers table**: Verify customer ID mappings exist
2. **Run customer sync**: Use `syncCustomerEmails()` utility
3. **Check checkout metadata**: Ensure `user_email` is set in checkout session metadata

### Payment Failures

1. **Check invoice events**: Verify `invoice.payment_failed` events are being processed
2. **Check user status**: Verify status is set to 'past_due'
3. **Check notifications**: Verify payment failed notifications are sent

## Testing

### Test Cards

Use Stripe test cards for testing:

- **Success**: `4242 4242 4242 4242`
- **Decline**: `4000 0000 0000 0002`
- **Requires Authentication**: `4000 0025 0000 3155`

### Test Webhooks Locally

Use Stripe CLI:

```bash
# Install Stripe CLI
brew install stripe/stripe-cli/stripe

# Login
stripe login

# Forward webhooks to local server
stripe listen --forward-to localhost:3000/api/webhook/stripe

# Trigger test events
stripe trigger checkout.session.completed
stripe trigger customer.subscription.created
```

## Security Considerations

1. **Webhook Signing**: Always verify webhook signatures using `STRIPE_WEBHOOK_SECRET`
2. **Idempotency**: Prevent duplicate processing using `webhook_events` table
3. **Error Handling**: Return 200 status for non-retryable errors to prevent infinite retries
4. **Rate Limiting**: Implement rate limiting on webhook endpoint
5. **Admin Access**: Protect admin endpoints with `requireAdmin()` middleware

## Best Practices

1. **Always use metadata**: Set `user_email` and `tier` in checkout session metadata
2. **Cache customer mappings**: Auto-populate `billing_customers` table when email found
3. **Log all events**: Store webhook events in database for debugging
4. **Handle errors gracefully**: Return 200 status even on errors to prevent retries
5. **Sync regularly**: Run subscription sync periodically to catch mismatches
6. **Monitor health**: Check subscription health regularly via admin endpoint

## Related Documentation

- [Subscription Management Guide](./SUBSCRIPTION_MANAGEMENT.md)
- [Stripe Testing Guide](./STRIPE_TESTING.md)
- [Billing API Reference](../app/api/billing/README.md)



