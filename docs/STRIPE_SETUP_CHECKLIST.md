# Stripe Setup Checklist

Complete guide to set up all Stripe environment variables for PrepFlow.

## Quick Setup

Run the setup script to check your current status:

```bash
npm run stripe:setup
```

## Required Environment Variables

Add these to your `.env.local` file:

```bash
# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_... # or sk_live_... for production
STRIPE_WEBHOOK_SECRET=whsec_... # Webhook signing secret
STRIPE_PRICE_STARTER_MONTHLY=price_... # Stripe Price ID for Starter tier
STRIPE_PRICE_PRO_MONTHLY=price_... # Stripe Price ID for Pro tier
STRIPE_PRICE_BUSINESS_MONTHLY=price_... # Stripe Price ID for Business tier

# Optional (not used in server-side code, but good to have)
STRIPE_PUBLISHABLE_KEY=pk_test_... # or pk_live_... for production
```

## Step-by-Step Setup Guide

### 1. Get Stripe API Keys

**Location**: https://dashboard.stripe.com/apikeys

1. Log in to your Stripe Dashboard
2. Navigate to **Developers** → **API keys**
3. Copy your **Secret key**:
   - Test mode: `sk_test_...` (starts with `sk_test_`)
   - Live mode: `sk_live_...` (starts with `sk_live_`)
4. Copy your **Publishable key** (optional):
   - Test mode: `pk_test_...` (starts with `pk_test_`)
   - Live mode: `pk_live_...` (starts with `pk_live_`)

**Add to `.env.local`**:

```bash
STRIPE_SECRET_KEY=sk_test_YOUR_SECRET_KEY_HERE
STRIPE_PUBLISHABLE_KEY=pk_test_YOUR_PUBLISHABLE_KEY_HERE
```

---

### 2. Create Products and Prices

**Location**: https://dashboard.stripe.com/products

You need to create **3 products** with monthly recurring prices:

#### Product 1: Starter

1. Click **"Add product"**
2. Fill in:
   - **Name**: `Starter`
   - **Description**: `PrepFlow Starter Plan` (optional)
3. Under **Pricing**, select:
   - **Pricing model**: `Standard pricing`
   - **Price**: Enter your Starter price (e.g., `29.00`)
   - **Billing period**: `Monthly` (recurring)
   - **Currency**: `AUD` (or your preferred currency)
4. Click **"Save product"**
5. **Copy the Price ID** (starts with `price_...`) - this is what you need!

**Add to `.env.local`**:

```bash
STRIPE_PRICE_STARTER_MONTHLY=price_YOUR_STARTER_PRICE_ID_HERE
```

#### Product 2: Pro

1. Click **"Add product"**
2. Fill in:
   - **Name**: `Pro`
   - **Description**: `PrepFlow Pro Plan` (optional)
3. Under **Pricing**, select:
   - **Pricing model**: `Standard pricing`
   - **Price**: Enter your Pro price (e.g., `49.00`)
   - **Billing period**: `Monthly` (recurring)
   - **Currency**: `AUD` (or your preferred currency)
4. Click **"Save product"**
5. **Copy the Price ID** (starts with `price_...`)

**Add to `.env.local`**:

```bash
STRIPE_PRICE_PRO_MONTHLY=price_YOUR_PRO_PRICE_ID_HERE
```

#### Product 3: Business

1. Click **"Add product"**
2. Fill in:
   - **Name**: `Business`
   - **Description**: `PrepFlow Business Plan` (optional)
3. Under **Pricing**, select:
   - **Pricing model**: `Standard pricing`
   - **Price**: Enter your Business price (e.g., `99.00`)
   - **Billing period**: `Monthly` (recurring)
   - **Currency**: `AUD` (or your preferred currency)
4. Click **"Save product"**
5. **Copy the Price ID** (starts with `price_...`)

**Add to `.env.local`**:

```bash
STRIPE_PRICE_BUSINESS_MONTHLY=price_YOUR_BUSINESS_PRICE_ID_HERE
```

**Important**: Make sure you're copying the **Price ID**, not the Product ID. The Price ID starts with `price_` and is found in the pricing section of each product.

---

### 3. Set Up Webhook Endpoint

**Location**: https://dashboard.stripe.com/webhooks

#### For Local Development (Testing)

1. Install Stripe CLI: https://stripe.com/docs/stripe-cli
2. Login: `stripe login`
3. Forward webhooks: `stripe listen --forward-to localhost:3000/api/webhook/stripe`
4. Copy the webhook signing secret (starts with `whsec_...`)

**Add to `.env.local`**:

```bash
STRIPE_WEBHOOK_SECRET=whsec_YOUR_WEBHOOK_SECRET_HERE
```

#### For Production

1. Navigate to **Developers** → **Webhooks**
2. Click **"Add endpoint"**
3. Enter endpoint URL:

   ```

   ```

   Replace `yourdomain.com` with your actual domain (e.g., `prepflow.org`)

4. Select events to listen to:
   - ✅ `checkout.session.completed`
   - ✅ `customer.subscription.created`
   - ✅ `customer.subscription.updated`
   - ✅ `customer.subscription.deleted`
   - ✅ `invoice.payment_succeeded`
   - ✅ `invoice.payment_failed`
5. Click **"Add endpoint"**
6. **Copy the Signing secret** (starts with `whsec_...`)

**Add to `.env.local`**:

```bash
STRIPE_WEBHOOK_SECRET=whsec_YOUR_WEBHOOK_SECRET_HERE
```

**Note**: You'll need different webhook secrets for test mode and live mode. Make sure you're using the correct one for your environment.

---

## Verification

After adding all environment variables, verify your setup:

1. **Run the setup script**:

   ```bash
   npm run stripe:setup
   ```

   All variables should show as "✅ Set"

2. **Test Stripe connection**:

   ```bash
   # Start your dev server
   npm run dev

   # In another terminal, test checkout creation
   curl -X POST http://localhost:3000/api/billing/create-checkout-session \
     -H "Content-Type: application/json" \
     -d '{"tier": "starter"}' \
     -H "Cookie: [your-auth-cookie]"
   ```

3. **Test webhook processing** (local):

   ```bash
   # Terminal 1: Start dev server
   npm run dev

   # Terminal 2: Forward webhooks
   stripe listen --forward-to localhost:3000/api/webhook/stripe

   # Terminal 3: Trigger test event
   stripe trigger checkout.session.completed
   ```

## Environment-Specific Setup

### Development (Test Mode)

Use Stripe **test mode** keys:

- `STRIPE_SECRET_KEY=sk_test_...`
- `STRIPE_PUBLISHABLE_KEY=pk_test_...`
- `STRIPE_WEBHOOK_SECRET=whsec_...` (from Stripe CLI or test webhook)

### Production (Live Mode)

Use Stripe **live mode** keys:

- `STRIPE_SECRET_KEY=sk_live_...`
- `STRIPE_PUBLISHABLE_KEY=pk_live_...`
- `STRIPE_WEBHOOK_SECRET=whsec_...` (from production webhook endpoint)

**Important**:

- Never use live keys in development
- Never commit `.env.local` to git (it's already in `.gitignore`)
- Set production environment variables in Vercel dashboard for deployment

## Troubleshooting

### "Stripe not configured" Error

- Check that `STRIPE_SECRET_KEY` is set in `.env.local`
- Restart your dev server after adding environment variables
- Verify the key starts with `sk_test_` or `sk_live_`

### "Missing webhook secret" Error

- Check that `STRIPE_WEBHOOK_SECRET` is set
- For local development, use Stripe CLI: `stripe listen --forward-to localhost:3000/api/webhook/stripe`
- For production, create webhook endpoint in Stripe Dashboard

### "Invalid price ID" Error

- Verify Price IDs start with `price_`
- Make sure you're using the Price ID, not the Product ID
- Check that prices are set to "Monthly" recurring billing
- Ensure Price IDs match your Stripe account (test vs live mode)

### Webhook Events Not Processing

1. Check webhook endpoint URL is correct
2. Verify webhook secret matches Stripe Dashboard
3. Check `webhook_events` table in database for processing status
4. Review webhook logs in Stripe Dashboard

## Quick Reference Links

- **Stripe Dashboard**: https://dashboard.stripe.com
- **API Keys**: https://dashboard.stripe.com/apikeys
- **Products**: https://dashboard.stripe.com/products
- **Webhooks**: https://dashboard.stripe.com/webhooks
- **Stripe CLI**: https://stripe.com/docs/stripe-cli
- **Stripe Docs**: https://docs.stripe.com

## Security Notes

- ✅ `.env.local` is gitignored - your keys won't be committed
- ✅ Never share your secret keys publicly
- ✅ Use test keys for development, live keys only in production
- ✅ Rotate keys regularly (every 90 days recommended)
- ✅ Use different webhook secrets for test and live modes

## Next Steps

After completing setup:

1. ✅ All environment variables added to `.env.local`
2. ✅ Products and prices created in Stripe
3. ✅ Webhook endpoint configured
4. ✅ Test checkout session creation
5. ✅ Test webhook processing
6. ✅ Deploy to production with live keys in Vercel

For detailed integration documentation, see: [STRIPE_INTEGRATION.md](./STRIPE_INTEGRATION.md)

