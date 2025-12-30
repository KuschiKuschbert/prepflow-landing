/**
 * Square OAuth constants.
 */

// Square OAuth endpoints
export const SQUARE_AUTH_BASE_URL = 'https://squareup.com/oauth2/authorize';
export const SQUARE_TOKEN_URL = 'https://connect.squareup.com/oauth2/token';

// Required OAuth scopes for PrepFlow integration
export const REQUIRED_SCOPES = [
  'ORDERS_READ', // Read orders/sales data
  'CATALOG_READ', // Read catalog items
  'CATALOG_WRITE', // Create/update catalog items
  'TEAM_READ', // Read team members/staff
  'TEAM_WRITE', // Create/update team members
];

export interface TokenResponse {
  access_token: string;
  token_type: string;
  expires_at?: string;
  merchant_id: string;
  refresh_token?: string;
  short_lived?: boolean;
}
