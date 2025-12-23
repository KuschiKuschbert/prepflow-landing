# Square POS API Complete Reference Guide

**Last Updated:** January 2025
**Purpose:** Complete reference for Square POS integration configuration, implementation, and troubleshooting

**📚 See Also:**
- `docs/AUTH0_STRIPE_REFERENCE.md` - Auth0 and Stripe configuration guide
- `docs/SQUARE_OAUTH_SIMPLIFICATION.md` - **OAuth Simplification Implementation Notes** - Complete documentation of the simplified OAuth flow
- `.cursor/rules/implementation.mdc` - API and database patterns
- `.cursor/rules/security.mdc` - Security practices for API integrations

---

## 📋 Table of Contents

1. [Environment Variables](#environment-variables)
2. [Square Dashboard Configuration](#square-dashboard-configuration)
3. [Database Schema](#database-schema)
4. [API Endpoints](#api-endpoints)
5. [Implementation Files](#implementation-files)
6. [Setup Procedures](#setup-procedures)
7. [Usage Examples](#usage-examples)
8. [Sync Operations](#sync-operations)
9. [Testing](#testing)
10. [Troubleshooting](#troubleshooting)
11. [Best Practices](#best-practices)

---

## 🔐 Environment Variables

### Required Variables

```bash
# Square OAuth Application (PrepFlow's app - one for all users)
# Get these from Square Developer Dashboard after creating ONE Square Application for PrepFlow
SQUARE_APPLICATION_ID=your-square-application-id
SQUARE_APPLICATION_SECRET=your-square-application-secret

# Square Token Encryption Key (MANDATORY)
# Generate with: openssl rand -hex 32
SQUARE_TOKEN_ENCRYPTION_KEY=your-64-character-hex-key-here

# Square Webhook Secret (Optional - for webhook signature verification)
SQUARE_WEBHOOK_SECRET=your-webhook-secret-from-square-dashboard
```

**⚠️ IMPORTANT:**
- PrepFlow has **ONE Square Application** that all users connect through
- Users don't need to create their own Square applications
- Users just click "Connect with Square" and login - no credential entry needed
- Each user gets access tokens for **their own Square account** (not PrepFlow's account)

### Secret Generation

```bash
# Generate Square token encryption key (64 hex characters = 32 bytes)
openssl rand -hex 32

# Example output:
# a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8c9d0e1f2
```

**⚠️ CRITICAL:** The encryption key must be:
- Exactly 64 hex characters (32 bytes)
- Stored securely (never commit to git)
- Different for each environment (dev/staging/production)
- Backed up securely (if lost, all encrypted tokens become unusable)

---

## 🏪 Square Dashboard Configuration

### Dashboard Access

**Location:** https://developer.squareup.com/apps

### 1. Create Application

1. Go to **Applications** → **Create Application**
2. Fill in application details:
   - **Application Name:** PrepFlow Integration
   - **Description:** Restaurant profitability platform integration
   - **Website:** https://www.prepflow.org
3. Click **Create Application**

### 2. Get Application Credentials

**Location:** Application → **Credentials**

**Required Credentials:**

- **Application ID:** `sq0idp-...` (starts with `sq0idp-`) - **Note:** PrepFlow has ONE Square Application for all users. Users don't need to create their own application.
- **Access Token:** `EAA...` (starts with `EAA`)
  - **Sandbox:** Use sandbox access token for testing
  - **Production:** Use production access token for live integration

**⚠️ IMPORTANT:**
- Access tokens are sensitive and must be encrypted before storage
- Never commit access tokens to git
- Use different tokens for sandbox and production environments

### 3. Configure OAuth (Required)

**⚠️ IMPORTANT:** PrepFlow uses OAuth 2.0 for secure, automatic token management. **PrepFlow has ONE Square Application** that all users connect through - you don't need to create your own Square application.

**For PrepFlow Developers (One-Time Setup):**

1. **Create Square Application:**
   - Go to [Square Developer Dashboard](https://developer.squareup.com/apps)
   - Create ONE Square Application for PrepFlow
   - Get **Application ID** (`sq0idp-...`) and **Application Secret** (`sq0csb-...`)

2. **Configure Environment Variables:**
   - Add `SQUARE_APPLICATION_ID` and `SQUARE_APPLICATION_SECRET` to environment variables
   - See `env.example` for configuration

3. **Configure Redirect URL:**
   - **Development:** `http://localhost:3000/api/square/callback`
   - **Production:** `https://www.prepflow.org/api/square/callback`
   - Add both URLs in Square Dashboard → Your App → OAuth → Redirect URLs

4. **Required Scopes:**
   - `ORDERS_READ` - Read orders/sales data
   - `CATALOG_READ` - Read catalog items
   - `CATALOG_WRITE` - Create/update catalog items
   - `TEAM_READ` - Read team members/staff
   - `TEAM_WRITE` - Create/update team members

**For Users (Simple Connection):**

1. **Click "Connect with Square"** in PrepFlow
2. **Login with your Square account** on Square's website
3. **Authorize PrepFlow** - Square will ask you to authorize PrepFlow's app to access YOUR Square account
4. **Done!** - PrepFlow automatically retrieves and stores your access token

**OAuth Flow:**

```
User clicks "Connect with Square"
    ↓
PrepFlow redirects to Square OAuth (using PrepFlow's Application ID)
    ↓
User logs into Square (their own account)
    ↓
Square shows: "Authorize PrepFlow to access YOUR Square account?"
    ↓
User authorizes
    ↓
Square gives PrepFlow access token for USER's Square account ✅
    ↓
PrepFlow stores user's access token (encrypted)
    ↓
User can now sync data between Square and PrepFlow
```

**Key Points:**

- ✅ **PrepFlow has ONE Square Application** - All users connect through the same app
- ✅ **Users get access to THEIR own Square accounts** - Not PrepFlow's account
- ✅ **No credential entry needed** - Users just click "Connect" and login
- ✅ **Automatic token refresh** - Access tokens refresh automatically using refresh tokens
- ✅ **Secure** - All tokens encrypted before storage

### Automatic Credential Retrieval

**How It Works:**

When you connect your Square account through PrepFlow:

1. **You click "Connect with Square"** - No credentials needed
2. **You login with your Square account** - On Square's website
3. **You authorize PrepFlow** - Square asks you to authorize PrepFlow's app to access YOUR Square account
4. **Square redirects back** - Square sends an authorization code to PrepFlow
5. **PrepFlow automatically exchanges the code** - PrepFlow uses PrepFlow's Application ID/Secret (from env vars) to exchange the code for YOUR access token
6. **Your access token is stored** - PrepFlow encrypts and stores YOUR access token (for YOUR Square account) securely
7. **You're done!** - No manual credential entry, no token copying, no manual updates

**What This Means:**

- ✅ **No credential entry** - You never need to enter Application ID or Secret
- ✅ **No manual token entry** - You never need to copy/paste your Square access token
- ✅ **Access to YOUR account** - You get access tokens for YOUR own Square account (not PrepFlow's account)
- ✅ **Automatic token refresh** - When your access token expires, PrepFlow automatically refreshes it
- ✅ **Seamless experience** - Once connected, your Square integration works continuously
- ✅ **Secure storage** - All tokens are encrypted before storage using AES-256-GCM encryption

**Important:** This is standard OAuth behavior - like when you connect Google Drive, you authorize Google's app to access YOUR Google Drive account, not Google's account. Same with Square - you authorize PrepFlow's app to access YOUR Square account.
  - `TEAM_READ` - Read team members/staff
  - `TEAM_WRITE` - Create/update team members (if needed)
  - `LABOR_READ` - Read labor data (if needed)

### 4. Configure Webhooks (Optional)

**Location:** Application → **Webhooks**

**Webhook Endpoint URL:**

```
https://yourdomain.com/api/webhook/square
```

**Webhook Events:**

- `catalog.version.updated` - Catalog item changes
- `order.created` - New order placed
- `order.updated` - Order updated
- `team_member.created` - New team member added
- `team_member.updated` - Team member updated

**Webhook Secret:**

- Copy the webhook signing secret from Square dashboard
- Store in `SQUARE_WEBHOOK_SECRET` environment variable

### 5. Get Location ID

**Location:** Square Dashboard → **Locations**

- Copy the **Location ID** for your primary location
- Use this as `default_location_id` in configuration
- For multi-location businesses, you can sync multiple locations

---

## 🗄️ Database Schema

### Tables

#### `square_configurations`

Stores user-specific Square configuration and credentials.

```sql
CREATE TABLE square_configurations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE UNIQUE,

  -- Square credentials (encrypted)
  square_application_id VARCHAR(255) NOT NULL,
  square_access_token_encrypted TEXT NOT NULL, -- AES-256-GCM encrypted
  refresh_token_encrypted TEXT, -- OAuth refresh token (encrypted, optional - only for OAuth)
  square_application_secret_encrypted TEXT, -- Application Secret (encrypted, for OAuth token refresh)

  -- Environment
  square_environment VARCHAR(50) DEFAULT 'sandbox', -- 'sandbox' or 'production'
  default_location_id VARCHAR(255),

  -- Sync settings
  auto_sync_enabled BOOLEAN DEFAULT true,
  sync_frequency_minutes INTEGER DEFAULT 60,

  -- Sync preferences
  sync_menu_items BOOLEAN DEFAULT true,
  sync_staff BOOLEAN DEFAULT true,
  sync_sales_data BOOLEAN DEFAULT true,
  sync_food_costs BOOLEAN DEFAULT true,

  -- Webhook settings
  webhook_enabled BOOLEAN DEFAULT false,
  webhook_url VARCHAR(500),
  webhook_secret VARCHAR(255),

  -- Last sync timestamps
  last_full_sync_at TIMESTAMP WITH TIME ZONE,
  last_menu_sync_at TIMESTAMP WITH TIME ZONE,
  last_staff_sync_at TIMESTAMP WITH TIME ZONE,
  last_sales_sync_at TIMESTAMP WITH TIME ZONE,

  -- Initial sync tracking
  initial_sync_completed BOOLEAN DEFAULT false,
  initial_sync_started_at TIMESTAMP WITH TIME ZONE,
  initial_sync_completed_at TIMESTAMP WITH TIME ZONE,
  initial_sync_status VARCHAR(50), -- 'pending', 'in_progress', 'completed', 'failed'
  initial_sync_error TEXT,

  -- Auto-sync configuration
  auto_sync_direction VARCHAR(50) DEFAULT 'prepflow_to_square',
  auto_sync_staff BOOLEAN DEFAULT true,
  auto_sync_dishes BOOLEAN DEFAULT true,
  auto_sync_costs BOOLEAN DEFAULT true,
  sync_debounce_ms INTEGER DEFAULT 5000,
  sync_queue_batch_size INTEGER DEFAULT 10,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### `square_mappings`

Maps Square entity IDs to PrepFlow entity IDs for bidirectional sync.

```sql
CREATE TABLE square_mappings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,

  -- Entity type: 'dish', 'recipe', 'ingredient', 'employee', 'location'
  entity_type VARCHAR(50) NOT NULL,

  -- PrepFlow entity ID (UUID)
  prepflow_id UUID NOT NULL,

  -- Square entity ID (string)
  square_id VARCHAR(255) NOT NULL,
  square_location_id VARCHAR(255),

  -- Sync direction
  sync_direction VARCHAR(50) DEFAULT 'bidirectional',

  -- Last sync timestamps
  last_synced_at TIMESTAMP WITH TIME ZONE,
  last_synced_from_square TIMESTAMP WITH TIME ZONE,
  last_synced_to_square TIMESTAMP WITH TIME ZONE,

  -- Sync metadata
  sync_metadata JSONB,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  UNIQUE(user_id, entity_type, prepflow_id),
  UNIQUE(user_id, entity_type, square_id, square_location_id)
);
```

#### `square_sync_logs`

Logs all sync operations for debugging and audit trail.

```sql
CREATE TABLE square_sync_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,

  -- Sync operation type
  operation_type VARCHAR(50) NOT NULL, -- 'sync_catalog', 'sync_orders', 'sync_staff', 'sync_costs', 'initial_sync', 'auto_sync'

  -- Direction
  direction VARCHAR(50) NOT NULL, -- 'square_to_prepflow', 'prepflow_to_square', 'bidirectional'

  -- Entity info
  entity_type VARCHAR(50),
  entity_id UUID,
  square_id VARCHAR(255),

  -- Status
  status VARCHAR(50) NOT NULL, -- 'success', 'error', 'conflict', 'skipped', 'in_progress'

  -- Error details
  error_message TEXT,
  error_details JSONB,

  -- Sync metadata
  sync_metadata JSONB,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Indexes

```sql
CREATE INDEX idx_square_configurations_user ON square_configurations(user_id);
CREATE INDEX idx_square_mappings_user_entity ON square_mappings(user_id, entity_type);
CREATE INDEX idx_square_mappings_square_id ON square_mappings(square_id);
CREATE INDEX idx_square_mappings_prepflow_id ON square_mappings(prepflow_id);
CREATE INDEX idx_square_sync_logs_user ON square_sync_logs(user_id, created_at DESC);
CREATE INDEX idx_square_sync_logs_status ON square_sync_logs(status, created_at DESC);
```

---

## 🔌 API Endpoints

### Configuration Endpoints

#### `GET /api/square/config`

Get Square configuration for current user.

**Authentication:** Required

**Response:**

```json
{
  "success": true,
  "config": {
    "square_application_id": "sq0idp-...",
    "square_environment": "sandbox",
    "default_location_id": "location-id",
    "auto_sync_enabled": true,
    "sync_menu_items": true,
    "sync_staff": true,
    "sync_sales_data": true,
    "sync_food_costs": true,
    "webhook_enabled": false,
    "last_full_sync_at": "2025-01-15T10:30:00Z",
    "initial_sync_completed": false
  }
}
```

**Error Responses:**

- `401 Unauthorized` - User not authenticated
- `403 Forbidden` - Square POS feature not enabled
- `404 Not Found` - Configuration not found

#### `POST /api/square/config`

Save Square configuration for current user.

**Authentication:** Required

**Request Body:**

```json
{
  "square_application_id": "sq0idp-...",
  "square_access_token": "EAA...", // Plain text - will be encrypted
  "square_environment": "sandbox",
  "default_location_id": "location-id",
  "auto_sync_enabled": true,
  "sync_menu_items": true,
  "sync_staff": true,
  "sync_sales_data": true,
  "sync_food_costs": true,
  "webhook_enabled": false,
  "webhook_url": "https://yourdomain.com/api/webhook/square",
  "webhook_secret": "webhook-secret"
}
```

**Response:**

```json
{
  "success": true,
  "config": {
    "square_application_id": "sq0idp-...",
    "square_environment": "sandbox",
    "auto_sync_enabled": true
  }
}
```

**Error Responses:**

- `400 Bad Request` - Invalid request data
- `401 Unauthorized` - User not authenticated
- `403 Forbidden` - Square POS feature not enabled
- `500 Internal Server Error` - Failed to save configuration

#### `DELETE /api/square/config`

Delete Square configuration for current user.

**Authentication:** Required

**Response:**

```json
{
  "success": true,
  "message": "Square configuration deleted"
}
```

### Sync Endpoints

#### `POST /api/square/sync`

Trigger manual sync operation.

**Authentication:** Required

**Request Body:**

```json
{
  "operation": "catalog", // 'catalog', 'orders', 'staff', 'costs', 'initial_sync'
  "direction": "bidirectional", // 'from_square', 'to_square', 'bidirectional'
  "options": {
    "locationId": "location-id", // Optional
    "dishIds": ["dish-id-1", "dish-id-2"], // Optional - for selective sync
    "employeeIds": ["employee-id-1"], // Optional - for selective sync
    "startDate": "2025-01-01T00:00:00Z", // For orders sync
    "endDate": "2025-01-31T23:59:59Z", // For orders sync
    "days": 30 // For recent orders sync
  }
}
```

**Response:**

```json
{
  "success": true,
  "message": "Catalog sync to Square completed.",
  "details": {
    "success": true,
    "synced": 15,
    "created": 5,
    "updated": 10,
    "errors": 0,
    "errorMessages": []
  }
}
```

**Error Responses:**

- `400 Bad Request` - Invalid operation or options
- `401 Unauthorized` - User not authenticated
- `403 Forbidden` - Square POS feature not enabled
- `500 Internal Server Error` - Sync operation failed

### Status Endpoints

#### `GET /api/square/status`

Get Square integration status and statistics.

**Authentication:** Required

**Response:**

```json
{
  "success": true,
  "status": {
    "configured": true,
    "credentialsValid": true,
    "config": {
      "square_environment": "sandbox",
      "auto_sync_enabled": true,
      "initial_sync_completed": false,
      "initial_sync_status": "pending",
      "last_full_sync_at": "2025-01-15T10:30:00Z",
      "last_menu_sync_at": "2025-01-15T10:30:00Z",
      "last_staff_sync_at": "2025-01-15T10:30:00Z",
      "last_sales_sync_at": "2025-01-15T10:30:00Z"
    },
    "recentSyncs": [
      {
        "id": "sync-id",
        "operation_type": "sync_catalog",
        "direction": "prepflow_to_square",
        "status": "success",
        "created_at": "2025-01-15T10:30:00Z"
      }
    ],
    "recentErrors": [],
    "errorCount": 0
  }
}
```

### Webhook Endpoints

#### `POST /api/webhook/square`

Handle Square webhook events.

**Authentication:** Not required (uses signature verification)

**Headers:**

```
X-Square-Signature: signature-here
```

**Request Body:**

Square webhook event payload (varies by event type).

**Response:**

```json
{
  "received": true,
  "type": "catalog.version.updated",
  "eventId": "event-id"
}
```

**Error Responses:**

- `400 Bad Request` - Invalid signature or payload
- `501 Not Implemented` - Webhook secret not configured

---

## 📁 Implementation Files

### Core Library Files

#### `lib/square/client.ts`

Square API client singleton with caching and error handling.

**Key Functions:**

- `getSquareClient(userId: string): Promise<SquareClient | null>` - Get cached Square client instance
- `isSquareConfigured(userId: string): Promise<boolean>` - Check if user has Square configuration
- `validateSquareCredentials(userId: string): Promise<boolean>` - Validate Square credentials
- `clearSquareClientCache(userId: string): void` - Clear client cache for user
- `clearAllSquareClientCache(): void` - Clear all client caches

**Usage:**

```typescript
import { getSquareClient } from '@/lib/square/client';

const client = await getSquareClient(userId);
if (!client) {
  // User not configured
  return;
}

const { result } = await client.catalogApi.listCatalog();
```

#### `lib/square/config.ts`

Square configuration service for CRUD operations.

**Key Functions:**

- `getSquareConfig(userId: string): Promise<SquareConfig | null>` - Get user's Square configuration
- `saveSquareConfig(userId: string, config: Partial<SquareConfig>): Promise<SquareConfig | null>` - Save configuration (encrypts token)
- `deleteSquareConfig(userId: string): Promise<boolean>` - Delete configuration

**Usage:**

```typescript
import { getSquareConfig, saveSquareConfig } from '@/lib/square/config';

const config = await getSquareConfig(userId);
if (config) {
  // User has Square configured
}

await saveSquareConfig(userId, {
  square_application_id: 'sq0idp-...',
  square_access_token: 'EAA...', // Will be encrypted automatically
  square_environment: 'sandbox',
});
```

#### `lib/square/token-encryption.ts`

AES-256-GCM encryption for Square access tokens.

**Key Functions:**

- `encryptSquareToken(token: string): Promise<string>` - Encrypt token (base64 encoded)
- `decryptSquareToken(encryptedToken: string): Promise<string>` - Decrypt token

**⚠️ SECURITY:**
- Uses AES-256-GCM encryption
- Requires `SQUARE_TOKEN_ENCRYPTION_KEY` environment variable
- Never log decrypted tokens
- Tokens are encrypted before database storage

#### `lib/square/mappings.ts`

ID mapping service for bidirectional sync.

**Key Functions:**

- `createMapping(mapping: SquareMapping): Promise<SquareMapping | null>` - Create new mapping
- `getMappingBySquareId(squareId: string, entityType: string, userId: string): Promise<SquareMapping | null>` - Get mapping by Square ID
- `getMappingByPrepFlowId(prepflowId: string, entityType: string, userId: string): Promise<SquareMapping | null>` - Get mapping by PrepFlow ID
- `findOrCreateMapping(prepflowId: string, squareId: string, entityType: string, userId: string): Promise<SquareMapping | null>` - Find or create mapping

**Usage:**

```typescript
import { findOrCreateMapping } from '@/lib/square/mappings';

// Create mapping when syncing dish
const mapping = await findOrCreateMapping(
  dishId, // PrepFlow dish ID
  squareItemId, // Square catalog item ID
  'dish', // Entity type
  userId
);
```

#### `lib/square/sync-log.ts`

Sync operation logging service.

**Key Functions:**

- `logSyncOperation(operation: SyncOperation): Promise<SyncLog | null>` - Log sync operation
- `getSyncHistory(userId: string, limit?: number): Promise<SyncLog[]>` - Get sync history
- `getSyncErrors(userId: string, days?: number): Promise<SyncLog[]>` - Get recent errors

**Usage:**

```typescript
import { logSyncOperation } from '@/lib/square/sync-log';

await logSyncOperation({
  user_id: userId,
  operation_type: 'sync_catalog',
  direction: 'prepflow_to_square',
  entity_type: 'dish',
  entity_id: dishId,
  square_id: squareItemId,
  status: 'success',
  sync_metadata: { syncedCount: 10 },
});
```

### Sync Service Files

#### `lib/square/sync/catalog.ts`

Catalog/Menu Items bidirectional sync.

**Key Functions:**

- `syncCatalogFromSquare(userId: string, locationId?: string): Promise<SyncResult>` - Sync from Square to PrepFlow
- `syncCatalogToSquare(userId: string, dishIds?: string[]): Promise<SyncResult>` - Sync from PrepFlow to Square
- `syncCatalogBidirectional(userId: string, locationId?: string): Promise<SyncResult>` - Bidirectional sync

**Usage:**

```typescript
import { syncCatalogFromSquare, syncCatalogToSquare } from '@/lib/square/sync/catalog';

// Pull menu items from Square
const result = await syncCatalogFromSquare(userId, locationId);

// Push menu items to Square
const result = await syncCatalogToSquare(userId, ['dish-id-1', 'dish-id-2']);
```

#### `lib/square/sync/orders.ts`

Orders/Sales Data one-way sync (Square → PrepFlow).

**Key Functions:**

- `syncOrdersFromSquare(userId: string, startDate: string, endDate: string, locationId?: string): Promise<SyncResult>` - Sync orders for date range
- `syncRecentOrdersFromSquare(userId: string, days?: number): Promise<SyncResult>` - Sync recent orders

**Usage:**

```typescript
import { syncOrdersFromSquare, syncRecentOrdersFromSquare } from '@/lib/square/sync/orders';

// Sync orders for date range
const result = await syncOrdersFromSquare(
  userId,
  '2025-01-01T00:00:00Z',
  '2025-01-31T23:59:59Z',
  locationId
);

// Sync last 30 days
const result = await syncRecentOrdersFromSquare(userId, 30);
```

#### `lib/square/sync/staff.ts`

Staff/Employees bidirectional sync.

**Key Functions:**

- `syncStaffFromSquare(userId: string): Promise<SyncResult>` - Sync from Square to PrepFlow
- `syncStaffToSquare(userId: string, employeeIds?: string[]): Promise<SyncResult>` - Sync from PrepFlow to Square
- `syncStaffBidirectional(userId: string): Promise<SyncResult>` - Bidirectional sync

**Usage:**

```typescript
import { syncStaffFromSquare, syncStaffToSquare } from '@/lib/square/sync/staff';

// Pull staff from Square
const result = await syncStaffFromSquare(userId);

// Push staff to Square
const result = await syncStaffToSquare(userId, ['employee-id-1', 'employee-id-2']);
```

#### `lib/square/sync/costs.ts`

Food Cost one-way sync (PrepFlow → Square).

**Key Functions:**

- `syncCostsToSquare(userId: string, dishIds?: string[]): Promise<SyncResult>` - Sync food costs to Square catalog items

**Usage:**

```typescript
import { syncCostsToSquare } from '@/lib/square/sync/costs';

// Sync food costs for all dishes
const result = await syncCostsToSquare(userId);

// Sync food costs for specific dishes
const result = await syncCostsToSquare(userId, ['dish-id-1', 'dish-id-2']);
```

#### `lib/square/sync/initial-sync.ts`

Initial sync service for first-time connection.

**Key Functions:**

- `performInitialSync(userId: string): Promise<SyncResult>` - Perform complete initial sync

**Usage:**

```typescript
import { performInitialSync } from '@/lib/square/sync/initial-sync';

// Perform initial sync (syncs all existing data)
const result = await performInitialSync(userId);
```

### Feature Flag Integration

#### `lib/square/feature-flags.ts`

Feature flag wrapper for Square POS integration.

**Key Functions:**

- `isSquarePOSEnabled(userId?: string, userEmail?: string): Promise<boolean>` - Check if Square POS is enabled
- `checkSquareFeatureAccess(featureKey: string, userId?: string, userEmail?: string): Promise<boolean>` - Check feature access

**Usage:**

```typescript
import { isSquarePOSEnabled } from '@/lib/square/feature-flags';

const enabled = await isSquarePOSEnabled(userId, userEmail);
if (!enabled) {
  return NextResponse.json({ error: 'Square POS not enabled' }, { status: 403 });
}
```

---

## 🚀 Setup Procedures

### Initial Setup

1. **Enable Feature Flag**
   - Go to Settings → Feature Flags (`/webapp/settings#feature-flags`)
   - Click "Seed Flags" if no flags exist
   - Enable `square_pos_integration` flag

2. **Connect Your Square Account**
   - Go to Square POS page (`/webapp/square`)
   - Navigate to Configuration section
   - Choose environment (sandbox or production)
   - Click "Connect with Square"
   - Login with your Square account on Square's website
   - Authorize PrepFlow to access your Square account
   - PrepFlow automatically retrieves and stores your access token

3. **Configure Integration**
   - After connecting, configure sync preferences:
     - Default Location ID (optional)
     - Sync preferences (menu items, staff, sales data, food costs)
     - Webhook settings (optional)
   - Click "Save Configuration"

4. **Run Initial Sync**
   - Go to Sync section
   - Click "Sync" on "Initial Sync (All Data)"
   - Wait for sync to complete
   - Check sync history for any errors

### Environment Setup

#### Development

```bash
# .env.local
# Square OAuth Application (PrepFlow's app - one for all users)
SQUARE_APPLICATION_ID=your-square-application-id
SQUARE_APPLICATION_SECRET=your-square-application-secret
# Square Token Encryption Key (MANDATORY - 64 hex characters)
SQUARE_TOKEN_ENCRYPTION_KEY=your-dev-encryption-key-64-hex-chars
SQUARE_WEBHOOK_SECRET=your-dev-webhook-secret  # Optional
```

#### Production

```bash
# Vercel Environment Variables
# Square OAuth Application (PrepFlow's app - one for all users)
SQUARE_APPLICATION_ID=your-square-application-id
SQUARE_APPLICATION_SECRET=your-square-application-secret
# Square Token Encryption Key (MANDATORY - 64 hex characters)
SQUARE_TOKEN_ENCRYPTION_KEY=your-prod-encryption-key-64-hex-chars
SQUARE_WEBHOOK_SECRET=your-prod-webhook-secret  # Optional
```

**⚠️ IMPORTANT:** Use different encryption keys for dev and production. If you lose the encryption key, all encrypted tokens become unusable.

---

## 💡 Usage Examples

### Example 1: Get Square Client and List Catalog Items

```typescript
import { getSquareClient } from '@/lib/square/client';

const client = await getSquareClient(userId);
if (!client) {
  throw new Error('Square not configured');
}

// List catalog items
const { result } = await client.catalogApi.listCatalog(undefined, 'ITEM');
const items = result.objects || [];

for (const item of items) {
  console.log(`Item: ${item.itemData?.name}, ID: ${item.id}`);
}
```

### Example 2: Create Catalog Item in Square

```typescript
import { getSquareClient } from '@/lib/square/client';
import { findOrCreateMapping } from '@/lib/square/mappings';

const client = await getSquareClient(userId);
if (!client) {
  throw new Error('Square not configured');
}

// Create catalog item
const { result } = await client.catalogApi.upsertCatalogObject({
  idempotencyKey: `dish-${dishId}-${Date.now()}`,
  object: {
    type: 'ITEM',
    itemData: {
      name: dish.dish_name,
      description: dish.description,
      variations: [
        {
          type: 'ITEM_VARIATION',
          itemVariationData: {
            name: 'Regular',
            pricingType: 'FIXED_PRICING',
            priceMoney: {
              amount: Math.round(dish.selling_price * 100), // Convert to cents
              currency: 'AUD',
            },
          },
        },
      ],
    },
  },
});

const squareItemId = result.catalogObject?.id;
if (squareItemId) {
  // Create mapping
  await findOrCreateMapping(dishId, squareItemId, 'dish', userId);
}
```

### Example 3: Sync Orders and Calculate Popularity

```typescript
import { syncOrdersFromSquare } from '@/lib/square/sync/orders';

// Sync orders for last 30 days
const result = await syncRecentOrdersFromSquare(userId, 30);

if (result.success) {
  console.log(`Synced ${result.synced} sales records`);
  console.log(`Created ${result.created} new records`);
  console.log(`Updated ${result.updated} existing records`);
} else {
  console.error('Sync failed:', result.errorMessages);
}
```

### Example 4: Manual Sync with Error Handling

```typescript
import { syncCatalogBidirectional } from '@/lib/square/sync/catalog';
import { logSyncOperation } from '@/lib/square/sync-log';

try {
  const result = await syncCatalogBidirectional(userId, locationId);

  if (result.success) {
    console.log(`Sync completed: ${result.synced} items synced`);
  } else {
    console.error(`Sync failed: ${result.errors} errors`);
    console.error('Error messages:', result.errorMessages);
  }
} catch (error) {
  await logSyncOperation({
    user_id: userId,
    operation_type: 'sync_catalog',
    direction: 'bidirectional',
    status: 'error',
    error_message: error instanceof Error ? error.message : String(error),
  });
  throw error;
}
```

---

## 🔄 Sync Operations

### Sync Directions

#### `from_square` (Square → PrepFlow)

Pulls data from Square and creates/updates PrepFlow entities.

**Use Cases:**
- Initial data import from Square
- Syncing menu items from Square POS
- Syncing staff from Square Team API
- Syncing sales data from Square Orders

#### `to_square` (PrepFlow → Square)

Pushes data from PrepFlow to Square.

**Use Cases:**
- Syncing menu items to Square POS
- Syncing staff to Square Team API
- Syncing food costs to Square catalog items

#### `bidirectional` (Both Directions)

Syncs in both directions, handling conflicts.

**Use Cases:**
- Full catalog sync (menu items)
- Full staff sync (employees)
- Initial sync (all data)

### Sync Types

#### Catalog Sync

**From Square:**
- Fetches Square catalog items
- Maps to PrepFlow dishes
- Creates/updates dishes based on mappings
- Creates mappings for new items

**To Square:**
- Fetches PrepFlow dishes
- Maps to Square catalog items
- Creates/updates Square items based on mappings
- Creates mappings for new items

#### Orders Sync

**Direction:** Square → PrepFlow only

- Fetches Square orders for date range
- Maps order line items to PrepFlow dishes
- Creates/updates `sales_data` records
- Calculates popularity percentages

#### Staff Sync

**From Square:**
- Fetches Square team members
- Maps to PrepFlow employees
- Creates/updates employees based on mappings

**To Square:**
- Fetches PrepFlow employees
- Maps to Square team members
- Creates/updates Square team members based on mappings

#### Cost Sync

**Direction:** PrepFlow → Square only

- Calculates food costs for PrepFlow dishes
- Updates Square catalog items with custom attributes
- Stores cost data in Square item metadata

---

## 🧪 Testing

### Manual Testing

#### Test Configuration

1. Go to `/webapp/square#configuration`
2. Enter sandbox credentials
3. Click "Save Configuration"
4. Verify status shows "Connected"

#### Test Sync Operations

1. Go to `/webapp/square#sync`
2. Click "Sync" on each operation:
   - Initial Sync
   - Catalog Sync
   - Orders Sync
   - Staff Sync
   - Cost Sync
3. Check sync results in History section
4. Verify data in PrepFlow (dishes, employees, sales data)

#### Test Webhooks

1. Configure webhook in Square dashboard
2. Make changes in Square POS (create order, update item)
3. Check webhook logs in `/webapp/square#webhooks`
4. Verify data synced automatically

### API Testing

#### Test Configuration Endpoint

```bash
# Get configuration
curl -X GET https://yourdomain.com/api/square/config \
  -H "Cookie: your-session-cookie"

# Save configuration
curl -X POST https://yourdomain.com/api/square/config \
  -H "Content-Type: application/json" \
  -H "Cookie: your-session-cookie" \
  -d '{
    "square_application_id": "sq0idp-...",
    "square_access_token": "EAA...",
    "square_environment": "sandbox"
  }'
```

#### Test Sync Endpoint

```bash
# Sync catalog
curl -X POST https://yourdomain.com/api/square/sync \
  -H "Content-Type: application/json" \
  -H "Cookie: your-session-cookie" \
  -d '{
    "operation": "catalog",
    "direction": "bidirectional"
  }'
```

---

## 🔧 Troubleshooting

### Common Issues

#### "Square client not initialized"

**Cause:** User doesn't have Square configuration saved.

**Solution:**
1. Go to Configuration section
2. Enter Square credentials
3. Click "Save Configuration"
4. Retry sync operation

#### "Failed to decrypt Square access token"

**Cause:** Encryption key mismatch or token corrupted.

**Solution:**
1. Verify `SQUARE_TOKEN_ENCRYPTION_KEY` is set correctly
2. Re-enter Square access token in Configuration
3. Save configuration (token will be re-encrypted)

#### "Invalid Square credentials"

**Cause:** Access token expired or invalid.

**Solution:**
1. Go to Square Developer Dashboard
2. Generate new access token
3. Update configuration with new token
4. Retry sync operation

#### "Sync operation failed"

**Cause:** Various (API rate limits, network errors, invalid data).

**Solution:**
1. Check sync history for error details
2. Verify Square API status
3. Check network connectivity
4. Review error messages in sync logs
5. Retry sync operation

#### "No mappings found"

**Cause:** Entities haven't been synced yet.

**Solution:**
1. Run initial sync first
2. Mappings are created automatically during sync
3. Check Mappings section after sync completes

### Debugging

#### Enable Debug Logging

```typescript
import { logger } from '@/lib/logger';

// Log Square API calls
logger.dev('[Square API] Calling catalogApi.listCatalog', { userId, locationId });

// Log sync operations
logger.dev('[Square Sync] Starting catalog sync', { userId, direction });
```

#### Check Sync Logs

```typescript
import { getSyncHistory, getSyncErrors } from '@/lib/square/sync-log';

// Get recent sync history
const history = await getSyncHistory(userId, 50);

// Get recent errors
const errors = await getSyncErrors(userId, 7);
```

#### Verify Configuration

```typescript
import { getSquareConfig, validateSquareCredentials } from '@/lib/square/client';

// Get configuration
const config = await getSquareConfig(userId);
console.log('Config:', config);

// Validate credentials
const valid = await validateSquareCredentials(userId);
console.log('Credentials valid:', valid);
```

---

## ✅ Best Practices

### Security

1. **Encrypt Access Tokens**
   - Always encrypt tokens before database storage
   - Use AES-256-GCM encryption
   - Never log decrypted tokens
   - Rotate encryption keys periodically

2. **Webhook Signature Verification**
   - Always verify webhook signatures
   - Use webhook secret from Square dashboard
   - Reject unsigned webhooks

3. **Environment Separation**
   - Use different credentials for sandbox and production
   - Use different encryption keys per environment
   - Never use production credentials in development

### Performance

1. **Client Caching**
   - Square client instances are cached per user (5-minute TTL)
   - Cache is cleared automatically on configuration changes
   - Manual cache clearing available via `clearSquareClientCache()`

2. **Batch Operations**
   - Use batch sync operations when possible
   - Sync multiple items in single API call
   - Use sync queue for rate limit management

3. **Selective Sync**
   - Use `dishIds` or `employeeIds` options for selective sync
   - Only sync changed entities when possible
   - Use date ranges for orders sync

### Error Handling

1. **Always Log Errors**
   - Use `logSyncOperation()` for all sync operations
   - Include error details in sync logs
   - Log to both database and application logs

2. **Graceful Degradation**
   - Continue sync even if individual items fail
   - Return partial success results
   - Provide detailed error messages

3. **Retry Logic**
   - Implement retry for transient errors
   - Use exponential backoff
   - Set maximum retry attempts

### Data Integrity

1. **Mapping Management**
   - Always create mappings when syncing entities
   - Verify mappings exist before sync operations
   - Handle mapping conflicts gracefully

2. **Idempotency**
   - Use idempotency keys for Square API calls
   - Use dish/employee IDs as idempotency keys
   - Handle duplicate requests gracefully

3. **Conflict Resolution**
   - Detect conflicts (same entity modified in both systems)
   - Log conflicts for manual resolution
   - Provide conflict resolution UI

### Monitoring

1. **Sync History**
   - Review sync history regularly
   - Monitor error rates
   - Track sync performance

2. **Error Alerts**
   - Set up alerts for sync failures
   - Monitor error logs
   - Notify administrators of critical errors

3. **Performance Metrics**
   - Track sync operation duration
   - Monitor API rate limit usage
   - Measure sync success rates

---

## 📚 Additional Resources

### Square API Documentation

- **Square Developer Portal:** https://developer.squareup.com
- **Square API Reference:** https://developer.squareup.com/reference/square
- **Square SDK Documentation:** https://github.com/square/square-nodejs-sdk

### PrepFlow Documentation

- **Feature Flags:** See Settings → Feature Flags section
- **API Patterns:** See `.cursor/rules/implementation.mdc`
- **Security Practices:** See `.cursor/rules/security.mdc`

### Support

- **Square Support:** https://developer.squareup.com/support
- **PrepFlow Support:** Contact via Settings → Help & Support

---

**Last Updated:** January 2025
**Maintained By:** PrepFlow Development Team
