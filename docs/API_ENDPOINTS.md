# API Endpoints Reference

Complete reference for all PrepFlow API endpoints (59 endpoints total).

## Authentication & User

- `GET /api/auth/[...nextauth]` - NextAuth authentication handlers
- `POST /api/auth/logout` - User logout
- `GET /api/me` - Current user information
- `GET /api/entitlements` - User subscription entitlements

## Account Management

- `DELETE /api/account/delete` - Delete user account
- `GET /api/account/export` - Export user data

## Billing

- `POST /api/billing/create-checkout-session` - Create Stripe checkout session
- `POST /api/billing/create-portal-session` - Create Stripe customer portal session
- `POST /api/webhook/stripe` - Stripe webhook handler

**📚 Stripe Implementation:** See [Auth0 & Stripe Reference](AUTH0_STRIPE_REFERENCE.md) (Stripe Configuration, API Endpoints sections) for complete Stripe integration guide, webhook setup, and best practices.

## Ingredients

- `GET /api/ingredients` - List ingredients (paginated)
- `POST /api/ingredients` - Create ingredient
- `PUT /api/ingredients` - Update ingredient
- `DELETE /api/ingredients` - Delete ingredient
- `GET /api/ingredients/exists` - Check if ingredient exists
- `PUT /api/ingredients/bulk-update` - Bulk update multiple ingredients (supplier, storage_location, wastage, etc.)

## Recipes

- `GET /api/recipes` - List recipes
- `POST /api/recipes` - Create recipe
- `PUT /api/recipes` - Update recipe
- `DELETE /api/recipes` - Delete recipe
- `GET /api/recipes/exists` - Check if recipe exists
- `GET /api/recipes/[id]/ingredients` - Get recipe ingredients
- `POST /api/recipes/ingredients/batch` - Batch fetch recipe ingredients
- `POST /api/recipe-share` - Share recipe with user

## Dashboard

- `GET /api/dashboard/stats` - Dashboard statistics

## Performance

- `GET /api/performance` - Performance analysis data

## Temperature

- `GET /api/temperature-logs` - List temperature logs
- `POST /api/temperature-logs` - Create temperature log
- `GET /api/temperature-equipment` - List temperature equipment
- `POST /api/temperature-equipment` - Create temperature equipment
- `PUT /api/temperature-equipment/[id]` - Update equipment
- `DELETE /api/temperature-equipment/[id]` - Delete equipment
- `POST /api/generate-test-temperature-logs` - Generate test logs

## Cleaning

- `GET /api/cleaning-areas` - List cleaning areas
- `GET /api/cleaning-tasks` - List cleaning tasks

## Compliance

- `GET /api/compliance-records` - List compliance records
- `GET /api/compliance-types` - List compliance types

## Suppliers

- `GET /api/suppliers` - List suppliers
- `POST /api/supplier-price-lists` - Create supplier price list

## Operations

- `GET /api/prep-lists` - List prep lists
- `GET /api/order-lists` - List order lists
- `GET /api/order-lists/[id]` - Get order list details
- `POST /api/assign-dish-section` - Assign dish to section
- `POST /api/ai-specials` - Generate AI specials

## Menu & Dishes

- `GET /api/dishes` - List dishes (paginated)
- `POST /api/dishes` - Create dish
- `GET /api/dishes/[id]` - Get dish details
- `PUT /api/dishes/[id]` - Update dish
- `GET /api/dishes/[id]/cost` - Get dish cost calculation
- `GET /api/menus` - List menus
- `POST /api/menus` - Create menu
- `GET /api/menus/[id]` - Get menu details
- `PUT /api/menus/[id]` - Update menu
- `GET /api/menus/[id]/items` - Get menu items
- `POST /api/menus/[id]/items` - Add item to menu
- `PUT /api/menus/[id]/items/[itemId]` - Update menu item
- `DELETE /api/menus/[id]/items/[itemId]` - Remove item from menu
- `POST /api/menus/[id]/reorder` - Reorder menu items
- `GET /api/menus/[id]/statistics` - Get menu statistics

## Equipment

- `GET /api/equipment/[id]/qr-code` - Generate QR code for equipment

## Utilities

- `GET /api/detect-country` - Detect user country
- `POST /api/setup-menu-builder` - Setup menu builder tables

## Database Management (Dev Only)

- `POST /api/db/reset` - Reset all domain tables
- `POST /api/db/reset-self` - Reset current user's data
- `POST /api/db/integrity` - Check database integrity
- `POST /api/setup-database` - Setup database tables
- `POST /api/populate-clean-test-data` - Populate clean test data
- `POST /api/populate-recipes` - Populate recipe data
- `POST /api/cleanup-test-data` - Cleanup test data
- `POST /api/dedupe/preview` - Preview deduplication
- `POST /api/dedupe/execute` - Execute deduplication

**Note:** Database management endpoints require header `X-Admin-Key: $SEED_ADMIN_KEY` and are blocked in production.

## Lead Generation

- `POST /api/leads` - Submit lead form

## API Response Standards

### Success Response

```typescript
{
  success: true,
  message: "Operation completed successfully",
  data: resultData
}
```

### Error Response

```typescript
{
  error: "Error description",
  message: "User-friendly message",
  details?: errorDetails
}
```

## See Also

- [Project Architecture](PROJECT_ARCHITECTURE.md) - Technical architecture overview
- [Feature Implementation Guide](FEATURE_IMPLEMENTATION.md) - Implementation patterns
- [Auth & Billing Setup](AUTH0_STRIPE_REFERENCE.md) - Authentication and billing configuration
- [Development Standards](.cursor/rules/development.mdc) - Development guidelines
- [Implementation Patterns](.cursor/rules/implementation.mdc) - API implementation patterns


