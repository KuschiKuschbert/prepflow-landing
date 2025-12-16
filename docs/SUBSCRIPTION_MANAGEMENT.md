# Subscription Management Guide

User and admin guide for managing subscriptions in PrepFlow.

## User Guide

### Viewing Your Subscription

1. Navigate to **Settings → Billing**
2. View your current plan, status, and usage
3. See subscription expiry date and renewal information

### Upgrading Your Subscription

1. Go to **Settings → Billing**
2. Click **"Upgrade to [Tier]"** button on desired tier card
3. Complete checkout in Stripe
4. Subscription activates automatically

### Extending Your Subscription

1. Go to **Settings → Billing**
2. Click **"Extend Subscription"** button
3. Confirm extension (adds 1 month to current subscription)
4. Subscription expiry date updates immediately

### Cancelling Your Subscription

#### Scheduled Cancellation (Recommended)

1. Go to **Settings → Billing**
2. Click **"Cancel Subscription"** button
3. Select **"Cancel at period end"**
4. Confirm cancellation

**Result:**

- Subscription remains active until period end
- You keep access to all features until expiry
- Can reactivate anytime before expiry

#### Immediate Cancellation

1. Go to **Settings → Billing**
2. Click **"Cancel Subscription"** button
3. Select **"Cancel immediately"**
4. Confirm cancellation

**Result:**

- Subscription cancelled immediately
- Access ends right away
- Downgraded to Starter tier
- Can reactivate anytime

### Reactivating Your Subscription

1. Go to **Settings → Billing**
2. Click **"Reactivate Subscription"** button
3. Confirm reactivation

**Result:**

- Subscription restored to active status
- Removes cancellation schedule
- Continues billing normally

### Managing Payment Method

1. Go to **Settings → Billing**
2. Click **"Manage Billing"** button
3. Opens Stripe Customer Portal
4. Update payment method, view invoices, manage billing

## Admin Guide

### Syncing Subscriptions

Sync all subscriptions from Stripe to database:

1. Go to **Admin → Billing**
2. Click **"Sync Subscriptions"** button
3. Review sync report

**Use Cases:**

- Recovery after webhook failures
- Data reconciliation
- Bulk updates

### Checking Subscription Health

Check for mismatches between Stripe and database:

1. Go to **Admin → Billing**
2. Click **"Check Health"** button
3. Review health report

**Report Includes:**

- Users with missing subscriptions
- Subscriptions with missing users
- Status mismatches
- Total counts

### Viewing Webhook Logs

View webhook event processing logs:

1. Go to **Admin → System Health**
2. View **Webhook Events** section
3. Filter by event type, processed status, date

**Information:**

- Event ID and type
- Processing status
- Processing time
- Success/failure
- Error messages

### Retrying Failed Webhooks

Retry processing failed webhook events:

1. Go to **Admin → System Health**
2. Find failed webhook event
3. Click **"Retry"** button

**Note**: Only retry events that failed due to temporary errors (database connection, etc.)

## Subscription Statuses

### Active

- Subscription is active and paid
- User has full access to tier features
- Billing continues normally

### Trial

- User is on trial period
- Full access to tier features
- Converts to active after payment

### Past Due

- Payment failed
- User keeps current tier (not downgraded)
- Access continues (grace period)
- User should update payment method

### Cancelled

- Subscription cancelled
- User downgraded to Starter tier
- Access may end immediately or at period end
- Can be reactivated

## Subscription Tiers

### Starter

- **Price**: $X/month
- **Features**: Basic features
- **Limits**: 50 recipes, 200 ingredients
- **Best For**: Small cafés, getting started

### Pro

- **Price**: $Y/month
- **Features**: All Starter features + AI Specials, Exports, Advanced Analytics
- **Limits**: Unlimited recipes and ingredients
- **Best For**: Growing businesses

### Business

- **Price**: $Z/month
- **Features**: All Pro features + Multi-user, API Access
- **Limits**: Unlimited everything
- **Best For**: Multiple locations, enterprise

## Common Scenarios

### Scenario: Payment Failed

**What Happens:**

1. Payment attempt fails
2. Subscription status changes to `past_due`
3. User receives payment failed notification
4. Access continues (grace period)

**What to Do:**

1. Update payment method in billing portal
2. Stripe automatically retries payment
3. Subscription returns to `active` when payment succeeds

### Scenario: Subscription Expiring Soon

**What Happens:**

1. User receives notification 7 days before expiry
2. Additional notifications at 3 days and 1 day
3. Subscription expires if not renewed

**What to Do:**

1. Extend subscription or upgrade
2. Update payment method if needed
3. Subscription continues automatically

### Scenario: Scheduled Cancellation

**What Happens:**

1. User schedules cancellation
2. Subscription remains active until period end
3. User receives cancellation scheduled notification
4. Subscription cancels automatically at period end

**What to Do:**

1. Reactivate subscription before expiry
2. Or let it cancel and reactivate later

## Troubleshooting

### Issue: Can't Extend Subscription

**Possible Causes:**

- No active subscription
- Subscription already cancelled
- Database connection issue

**Solution:**

- Check subscription status
- Verify subscription is active
- Contact support if issue persists

### Issue: Can't Cancel Subscription

**Possible Causes:**

- Subscription already cancelled
- Database connection issue
- Stripe API error

**Solution:**

- Check subscription status
- Try again in a few minutes
- Contact support if issue persists

### Issue: Status Not Updating

**Possible Causes:**

- Webhook not processed
- Database sync issue
- Cache not cleared

**Solution:**

- Refresh page
- Check webhook logs (admin)
- Run subscription sync (admin)

## Related Documentation

- [Stripe Integration Guide](./STRIPE_INTEGRATION.md)
- [Stripe Testing Guide](./STRIPE_TESTING.md)



