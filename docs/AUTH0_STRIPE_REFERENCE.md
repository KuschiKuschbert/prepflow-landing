# Auth0 & Stripe Complete Reference Guide

**Last Updated:** December 2025
**Purpose:** Complete reference for all Auth0 and Stripe configuration, implementation, and troubleshooting

---

## 📋 Table of Contents

1. [Environment Variables](#environment-variables)
2. [Auth0 Configuration](#auth0-configuration)
3. [Stripe Configuration](#stripe-configuration)
4. [Database Schema](#database-schema)
5. [API Endpoints](#api-endpoints)
6. [Implementation Files](#implementation-files)
7. [Setup Procedures](#setup-procedures)
8. [Testing](#testing)
9. [Troubleshooting](#troubleshooting)
10. [Best Practices](#best-practices)

---

## 🔐 Environment Variables

### Required Variables

```bash
# Auth0 Configuration
AUTH0_ISSUER_BASE_URL=https://dev-7myakdl4itf644km.us.auth0.com
AUTH0_CLIENT_ID=CO3Vl37SuZ4e9wke1PitgWvAUyMR2HfL
AUTH0_CLIENT_SECRET=zlbcaViOHPG27NhE1KwcQjUp8aiOTILCgVAX0kR1IzSM0bxs1BVpv8KL9uIeqgX_

# NextAuth Configuration
NEXTAUTH_SECRET=dev-secret-change-me  # Generate with: openssl rand -base64 32
NEXTAUTH_URL=http://localhost:3000  # Production: https://yourdomain.com
NEXTAUTH_SESSION_MAX_AGE=14400  # 4 hours in seconds (default)

# Stripe Configuration
STRIPE_SECRET_KEY=sk_live_...  # or sk_test_... for development
STRIPE_PUBLISHABLE_KEY=pk_live_...  # or pk_test_... (optional, not used server-side)
STRIPE_WEBHOOK_SECRET=whsec_...  # Webhook signing secret
STRIPE_WEBHOOK_SECRET_DEV=whsec_...  # Optional: Dev-specific webhook secret
STRIPE_WEBHOOK_SECRET_PROD=whsec_...  # Optional: Prod-specific webhook secret

# Stripe Price IDs (Monthly subscriptions)
STRIPE_PRICE_STARTER_MONTHLY=price_1Sc7O9IO9rOgEAAGKFdJMbiZ
STRIPE_PRICE_PRO_MONTHLY=price_1Sc7PSIO9rOgEAAGkAqmDujD
STRIPE_PRICE_BUSINESS_MONTHLY=price_1Sc7PxIO9rOgEAAGia7pvunW

# Access Control
ALLOWED_EMAILS=derkusch@gmail.com  # Comma-separated list
DISABLE_ALLOWLIST=true  # Optional: Allow all authenticated users
```

### Secret Generation

```bash
# Generate NEXTAUTH_SECRET
openssl rand -base64 32

# Generate AUTH0_SECRET (if needed)
openssl rand -hex 32
```

---

## 🔑 Auth0 Configuration

### Dashboard Setup

**Location:** https://manage.auth0.com

#### 1. Application Settings

**Allowed Callback URLs:**

```
http://localhost:3000/api/auth/callback/auth0
http://localhost:3001/api/auth/callback/auth0
https://yourdomain.com/api/auth/callback/auth0
```

**Allowed Logout URLs:**

```
http://localhost:3000
http://localhost:3000/
http://localhost:3001
http://localhost:3001/
https://yourdomain.com
```

**⚠️ CRITICAL:** Logout URLs MUST be added or logout will fail with `redirect_uri_mismatch` error.

**Allowed Web Origins:**

```
http://localhost:3000
http://localhost:3001
https://yourdomain.com
```

#### 2. Connection Configuration

- **Database Connection:** Username-Password-Authentication (default)
- **Social Connections:** Google, GitHub, etc. (optional)
- **Email Verification:** Configured in Auth0 dashboard

### Implementation Details

**Configuration File:** `lib/auth-options.ts`

**Key Features:**

- ✅ Conditional provider loading (only loads if env vars present)
- ✅ JWT session strategy (stateless)
- ✅ 4-hour session timeout
- ✅ User sync on first login
- ✅ Role extraction (token + Management API fallback)
- ✅ Email verification sync

**Session Configuration:**

- **Strategy:** JWT (stateless)
- **Max Age:** 4 hours (14400 seconds)
- **Refresh:** Automatic via NextAuth

**User Sync:**

- **File:** `lib/auth-user-sync.ts`
- **Trigger:** On first login via JWT callback
- **Actions:**
  - Creates user record if doesn't exist
  - Updates `last_login` timestamp
  - Syncs `email_verified` status

**Role Extraction:**

- **File:** `lib/auth0-management.ts`
- **Sources (in order):**
  1. Token `roles` claim
  2. Token `custom.roles`
  3. Token `id_token` roles
  4. Management API (fallback)

### Auth0 Management API

**Purpose:** Fetch user roles when not included in token

**Configuration:**

- Uses same `AUTH0_ISSUER_BASE_URL`, `AUTH0_CLIENT_ID`, `AUTH0_CLIENT_SECRET`
- Extracts domain from issuer URL automatically
- Caches client instance

**Usage:**

```typescript
import { getUserRoles } from '@/lib/auth0-management';

const roles = await getUserRoles('google-oauth2|102050647966509234700');
```

---

## 💳 Stripe Configuration

### Dashboard Setup

**Location:** https://dashboard.stripe.com

#### 1. API Keys

**Location:** Developers → API keys

- **Secret Key:** `sk_test_...` (test) or `sk_live_...` (production)
- **Publishable Key:** `pk_test_...` (test) or `pk_live_...` (production)

#### 2. Products & Prices

**Location:** Products → Add product

**Required Products:**

1. **Starter** - Monthly recurring, AUD
2. **Pro** - Monthly recurring, AUD
3. **Business** - Monthly recurring, AUD

**Current Price IDs:**

- Starter: `price_1Sc7O9IO9rOgEAAGKFdJMbiZ` ($69 AUD/month)
- Pro: `price_1Sc7PSIO9rOgEAAGkAqmDujD` ($129 AUD/month)
- Business: `price_1Sc7PxIO9rOgEAAGia7pvunW` ($199 AUD/month)

**⚠️ Important:** Copy the **Price ID** (starts with `price_`), not the Product ID.

#### 3. Webhook Endpoint

**Location:** Developers → Webhooks

**Endpoint URL:**

```
https://yourdomain.com/api/webhook/stripe
```

**Events to Listen:**

- ✅ `checkout.session.completed`
- ✅ `customer.subscription.created`
- ✅ `customer.subscription.updated`
- ✅ `customer.subscription.deleted`
- ✅ `invoice.payment_succeeded`
- ✅ `invoice.payment_failed`

**Webhook Secret:**

- Copy signing secret (starts with `whsec_...`)
- Use different secrets for test and live modes

**Local Development:**

```bash
# Install Stripe CLI
stripe login

# Forward webhooks to local server
stripe listen --forward-to localhost:3000/api/webhook/stripe

# Copy webhook secret from CLI output
```

### Implementation Details

**Stripe Client:** `lib/stripe.ts`

**Key Features:**

- ✅ Singleton pattern (cached client instance)
- ✅ API version: `2025-11-17.clover`
- ✅ Null-safe (returns null if not configured)

**Webhook Handler:** `app/api/webhook/stripe/route.ts`

**Key Features:**

- ✅ Signature verification
- ✅ Idempotency checking (via `webhook_events` table)
- ✅ Environment-specific secrets (DEV/PROD)
- ✅ Expand parameters to reduce API calls
- ✅ Deleted customer handling
- ✅ Comprehensive error handling

**Checkout Session:** `app/api/billing/create-checkout-session/route.ts`

**Key Features:**

- ✅ Customer ID caching (via `billing_customers` table)
- ✅ Metadata inclusion (tier, user_email)
- ✅ Subscription metadata
- ✅ Promotion codes enabled
- ✅ Automatic tax (configurable)

---

## 🗄️ Database Schema

### Required Tables

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
subscription_current_period_end TIMESTAMP WITH TIME ZONE

-- Auth fields
email VARCHAR(255) UNIQUE NOT NULL
email_verified BOOLEAN DEFAULT FALSE
last_login TIMESTAMP WITH TIME ZONE
```

#### `billing_customers` Table

```sql
user_email VARCHAR(255) UNIQUE NOT NULL
stripe_customer_id VARCHAR(255) NOT NULL
stripe_subscription_id VARCHAR(255)
created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
```

#### `webhook_events` Table

```sql
id SERIAL PRIMARY KEY
event_id VARCHAR(255) UNIQUE NOT NULL
event_type VARCHAR(100) NOT NULL
processed BOOLEAN DEFAULT FALSE
processed_at TIMESTAMP WITH TIME ZONE
error_message TEXT
created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
```

#### `user_notifications` Table

```sql
id SERIAL PRIMARY KEY
user_email VARCHAR(255) NOT NULL
notification_type VARCHAR(100) NOT NULL
title VARCHAR(255)
message TEXT
read BOOLEAN DEFAULT FALSE
created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
```

### Migrations

**Location:** `migrations/`

**Required Migrations:**

1. `add-stripe-subscription-fields.sql` - Adds subscription fields to users table
2. `enhance-billing-customers.sql` - Creates billing_customers table
3. `add-webhook-events-table.sql` - Creates webhook_events table for idempotency
4. `add-user-notifications-table.sql` - Creates user_notifications table
5. `add-subscription-tier.sql` - Adds subscription_tier field

---

## 🔌 API Endpoints

### Auth0 Endpoints

**NextAuth Routes (automatic):**

- `GET /api/auth/signin` - Sign in page
- `GET /api/auth/callback/auth0` - Auth0 callback
- `GET /api/auth/session` - Get current session
- `GET /api/auth/providers` - List providers
- `POST /api/auth/signout` - Sign out

**Custom Routes:**

- `GET /api/me` - Current user information
- `GET /api/entitlements` - User subscription entitlements

### Stripe Endpoints

**Billing:**

- `POST /api/billing/create-checkout-session` - Create Stripe checkout session
- `POST /api/billing/create-portal-session` - Create Stripe customer portal session

**Webhooks:**

- `POST /api/webhook/stripe` - Stripe webhook handler

**Protection:**

- ✅ Checkout session: Requires NextAuth session
- ✅ Portal session: Requires NextAuth session
- ✅ Webhook: Requires Stripe signature verification

---

## 📁 Implementation Files

### Auth0 Files

```
lib/
├── auth-options.ts          # NextAuth configuration
├── auth-user-sync.ts        # User sync on login
└── auth0-management.ts      # Management API client

app/api/auth/
└── [...nextauth]/
    └── route.ts             # NextAuth route handler

middleware.ts                # Allowlist enforcement
```

### Stripe Files

```
lib/
├── stripe.ts                # Stripe client singleton
├── tier-config.ts           # Subscription tier configuration
├── entitlements.ts          # Entitlement checking
├── feature-gate.ts         # Feature gating
├── webhook-helpers.ts      # Webhook utility functions
└── subscription-notifications.ts  # Notification sending

app/api/
├── billing/
│   ├── create-checkout-session/
│   │   └── route.ts        # Checkout session creation
│   └── create-portal-session/
│       └── route.ts         # Customer portal creation
└── webhook/
    └── stripe/
        └── route.ts        # Webhook handler
```

---

## 🚀 Setup Procedures

### Initial Setup

#### 1. Auth0 Setup

1. **Create Auth0 Application:**
   - Go to https://manage.auth0.com
   - Applications → Create Application
   - Choose "Regular Web Application"
   - Copy Client ID and Secret

2. **Configure URLs:**
   - Add callback URLs (see [Auth0 Configuration](#auth0-configuration))
   - Add logout URLs (CRITICAL)
   - Add web origins

3. **Set Environment Variables:**
   ```bash
   AUTH0_ISSUER_BASE_URL=https://your-tenant.auth0.com
   AUTH0_CLIENT_ID=your-client-id
   AUTH0_CLIENT_SECRET=your-client-secret
   NEXTAUTH_SECRET=$(openssl rand -base64 32)
   NEXTAUTH_URL=http://localhost:3000
   ```

#### 2. Stripe Setup

1. **Get API Keys:**
   - Go to https://dashboard.stripe.com/apikeys
   - Copy Secret Key and Publishable Key

2. **Create Products:**
   - Products → Add product
   - Create Starter, Pro, Business
   - Set monthly recurring prices
   - Copy Price IDs

3. **Set Up Webhook:**
   - Developers → Webhooks → Add endpoint
   - URL: `https://yourdomain.com/api/webhook/stripe`
   - Select events (see [Stripe Configuration](#stripe-configuration))
   - Copy webhook secret

4. **Set Environment Variables:**
   ```bash
   STRIPE_SECRET_KEY=sk_test_...
   STRIPE_WEBHOOK_SECRET=whsec_...
   STRIPE_PRICE_STARTER_MONTHLY=price_...
   STRIPE_PRICE_PRO_MONTHLY=price_...
   STRIPE_PRICE_BUSINESS_MONTHLY=price_...
   ```

#### 3. Database Setup

1. **Run Migrations:**

   ```bash
   # Apply all migrations
   psql $DATABASE_URL -f migrations/add-stripe-subscription-fields.sql
   psql $DATABASE_URL -f migrations/enhance-billing-customers.sql
   psql $DATABASE_URL -f migrations/add-webhook-events-table.sql
   psql $DATABASE_URL -f migrations/add-user-notifications-table.sql
   ```

2. **Verify Tables:**
   ```sql
   SELECT table_name FROM information_schema.tables
   WHERE table_schema = 'public'
   AND table_name IN ('users', 'billing_customers', 'webhook_events', 'user_notifications');
   ```

---

## 🧪 Testing

### Auth0 Testing

**Automated Test:**

```bash
npm run test:auth0
```

**Manual Testing:**

1. Navigate to `/api/auth/signin`
2. Complete Auth0 authentication
3. Verify redirect to `/webapp`
4. Check user record created in database
5. Verify `last_login` timestamp updated

**Logout Testing:**

1. Navigate to `/not-authorized` (or any protected page)
2. Click "Logout" button
3. Verify redirect to landing page
4. Verify session cleared
5. Next login shows fresh login screen

### Stripe Testing

**Automated Test:**

```bash
npm run test:stripe
npm run test:integration  # Full Auth0 + Stripe test
```

**Checkout Flow Testing:**

1. Navigate to `/webapp/settings/billing` (requires auth)
2. Click "Upgrade" button
3. Complete Stripe checkout
4. Verify webhook processes `checkout.session.completed`
5. Check subscription status updated in database

**Webhook Testing (Local):**

```bash
# Terminal 1: Start dev server
npm run dev

# Terminal 2: Forward webhooks
stripe listen --forward-to localhost:3000/api/webhook/stripe

# Terminal 3: Trigger test event
stripe trigger checkout.session.completed
```

**Customer Portal Testing:**

1. Click "Manage Billing" button
2. Verify Stripe customer portal opens
3. Test payment method update
4. Verify webhook processes subscription updates

### Integration Testing

**Full Flow Test:**

```bash
npm run test:integration
```

**Test Script:** `scripts/test-auth0-stripe-integration.js`

**What It Tests:**

- ✅ Environment variables configured
- ✅ Server running
- ✅ Auth0 endpoints accessible
- ✅ Stripe API connection
- ✅ Price IDs valid
- ✅ Webhook endpoint protected

---

## 🔧 Troubleshooting

### Auth0 Issues

#### "redirect_uri_mismatch" Error

**Cause:** Logout URL not in allowed list

**Solution:**

1. Go to Auth0 Dashboard → Applications → Settings
2. Add exact logout URL to "Allowed Logout URLs"
3. Include trailing slash variants: `http://localhost:3000` and `http://localhost:3000/`

#### "User not found" After Login

**Cause:** User sync failed

**Solution:**

1. Check `lib/auth-user-sync.ts` logs
2. Verify database connection
3. Check `users` table exists
4. Verify email format matches

#### Roles Not Appearing

**Cause:** Roles not in token or Management API

**Solution:**

1. Check Auth0 Dashboard → Users → Roles
2. Assign roles to user
3. Check token claims in JWT callback
4. Verify Management API credentials

### Stripe Issues

#### "Stripe not configured" Error

**Cause:** `STRIPE_SECRET_KEY` not set

**Solution:**

1. Check `.env.local` has `STRIPE_SECRET_KEY`
2. Restart dev server after adding env vars
3. Verify key starts with `sk_test_` or `sk_live_`

#### "Missing webhook secret" Error

**Cause:** `STRIPE_WEBHOOK_SECRET` not set

**Solution:**

1. For local: Use Stripe CLI `stripe listen`
2. For production: Create webhook endpoint in Stripe Dashboard
3. Copy signing secret to `.env.local`

#### "Invalid price ID" Error

**Cause:** Price ID doesn't exist or wrong mode

**Solution:**

1. Verify Price ID starts with `price_`
2. Check you're using Price ID, not Product ID
3. Ensure prices are monthly recurring
4. Match test/live mode with API keys

#### Webhook Events Not Processing

**Cause:** Signature verification failed or idempotency

**Solution:**

1. Check webhook secret matches Stripe Dashboard
2. Verify endpoint URL is correct
3. Check `webhook_events` table for processing status
4. Review webhook logs in Stripe Dashboard

#### Customer Not Found

**Cause:** Customer ID not cached or deleted

**Solution:**

1. Check `billing_customers` table
2. Verify customer exists in Stripe Dashboard
3. Check webhook handler fallback logic
4. Verify email extraction from metadata

---

## ✅ Best Practices

### Auth0 Best Practices

✅ **User Creation on First Login**

- Implemented in `lib/auth-user-sync.ts`
- Creates user record automatically
- Updates `last_login` on every login

✅ **Proper Scope Configuration**

- Uses minimal scopes: `openid profile email`
- No unnecessary permissions requested

✅ **JWT Session Strategy**

- Stateless authentication
- 4-hour session timeout
- Automatic token refresh

✅ **Role Extraction**

- Multiple fallback sources
- Token → Management API
- Graceful degradation

✅ **Email Verification Sync**

- Syncs `email_verified` from Auth0
- Updates on every login
- Never downgrades verification status

### Stripe Best Practices

✅ **Environment-Specific Webhook Secrets**

- Supports `STRIPE_WEBHOOK_SECRET_DEV` and `STRIPE_WEBHOOK_SECRET_PROD`
- Fallback to `STRIPE_WEBHOOK_SECRET`
- Prevents cross-environment events

✅ **Webhook Idempotency**

- Uses `webhook_events` table
- Prevents duplicate processing
- Tracks processing status

✅ **Webhook Signature Verification**

- Verifies all webhook requests
- Returns 400 for invalid signatures
- Proper error handling

✅ **Expand Parameters**

- Uses `expand` to reduce API calls
- Expands `line_items`, `customer`, `subscription`
- Single API call for all needed data

✅ **Customer ID Caching**

- Uses `billing_customers` table
- Reduces Stripe API calls
- Auto-populates on lookup

✅ **Metadata Usage**

- Includes `tier` and `user_email` in checkout sessions
- Includes metadata in subscriptions
- Enables webhook processing without extra API calls

✅ **Deleted Customer Handling**

- Gracefully handles deleted customers
- Checks `customer.deleted` flag
- Falls back to email lookup

✅ **Proper Error Handling**

- Returns correct HTTP status codes
- 200 for successful processing
- 400 for invalid requests (retryable)
- 500 for server errors (retryable)

✅ **Notification System**

- Sends notifications for subscription events
- Uses `user_notifications` table
- Supports multiple notification types

---

## 📚 Related Documentation

- [AUTH0_LOCALHOST_SETUP.md](../AUTH0_LOCALHOST_SETUP.md) - Localhost configuration
- [AUTH0_LOGOUT_SETUP.md](AUTH0_LOGOUT_SETUP.md) - Logout configuration
- [STRIPE_SETUP_CHECKLIST.md](STRIPE_SETUP_CHECKLIST.md) - Step-by-step Stripe setup
- [STRIPE_INTEGRATION.md](STRIPE_INTEGRATION.md) - Detailed Stripe integration guide
- [AUTH0_STRIPE_TEST_REPORT.md](AUTH0_STRIPE_TEST_REPORT.md) - Test results
- [STRIPE_AUTH0_BEST_PRACTICES.md](STRIPE_AUTH0_BEST_PRACTICES.md) - Best practices

---

## 🔄 Quick Reference

### Environment Variables Checklist

```bash
# Auth0
✅ AUTH0_ISSUER_BASE_URL
✅ AUTH0_CLIENT_ID
✅ AUTH0_CLIENT_SECRET
✅ NEXTAUTH_SECRET
✅ NEXTAUTH_URL

# Stripe
✅ STRIPE_SECRET_KEY
✅ STRIPE_WEBHOOK_SECRET
✅ STRIPE_PRICE_STARTER_MONTHLY
✅ STRIPE_PRICE_PRO_MONTHLY
✅ STRIPE_PRICE_BUSINESS_MONTHLY
```

### Test Commands

```bash
# Test Auth0
npm run test:auth0

# Test Stripe
npm run test:stripe

# Test Integration
npm run test:integration

# Stripe Setup Check
npm run stripe:setup
```

### Dashboard Links

- **Auth0 Dashboard:** https://manage.auth0.com
- **Stripe Dashboard:** https://dashboard.stripe.com
- **Stripe API Keys:** https://dashboard.stripe.com/apikeys
- **Stripe Products:** https://dashboard.stripe.com/products
- **Stripe Webhooks:** https://dashboard.stripe.com/webhooks

---

**Last Updated:** December 2025
**Maintained By:** PrepFlow Development Team
