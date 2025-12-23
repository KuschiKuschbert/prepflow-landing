-- Square POS Integration Tables
-- Comprehensive bidirectional sync support with mapping, logging, and configuration

-- 1. Square Mappings Table
-- Links Square IDs to PrepFlow IDs for bidirectional sync
CREATE TABLE IF NOT EXISTS square_mappings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,

  -- Entity type: 'dish', 'recipe', 'ingredient', 'employee', 'location'
  entity_type VARCHAR(50) NOT NULL,

  -- PrepFlow entity ID
  prepflow_id UUID NOT NULL,

  -- Square entity ID
  square_id VARCHAR(255) NOT NULL,

  -- Square location ID (for multi-location businesses)
  square_location_id VARCHAR(255),

  -- Sync direction: 'bidirectional', 'square_to_prepflow', 'prepflow_to_square'
  sync_direction VARCHAR(50) DEFAULT 'bidirectional',

  -- Last sync timestamps
  last_synced_at TIMESTAMP WITH TIME ZONE,
  last_synced_from_square TIMESTAMP WITH TIME ZONE,
  last_synced_to_square TIMESTAMP WITH TIME ZONE,

  -- Sync metadata
  sync_metadata JSONB, -- Stores additional sync info (version, conflicts, etc.)

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  UNIQUE(user_id, entity_type, prepflow_id),
  UNIQUE(user_id, entity_type, square_id, square_location_id)
);

CREATE INDEX IF NOT EXISTS idx_square_mappings_user_entity ON square_mappings(user_id, entity_type);
CREATE INDEX IF NOT EXISTS idx_square_mappings_square_id ON square_mappings(square_id);
CREATE INDEX IF NOT EXISTS idx_square_mappings_prepflow_id ON square_mappings(prepflow_id);

-- Add comments for documentation
COMMENT ON TABLE square_mappings IS 'Links Square IDs to PrepFlow IDs for bidirectional sync';
COMMENT ON COLUMN square_mappings.entity_type IS 'Entity type: dish, recipe, ingredient, employee, location';
COMMENT ON COLUMN square_mappings.sync_direction IS 'Sync direction: bidirectional, square_to_prepflow, prepflow_to_square';
COMMENT ON COLUMN square_mappings.sync_metadata IS 'Additional sync info (version, conflicts, etc.)';

-- 2. Square Sync Log Table
-- Sync operation log for debugging and audit
CREATE TABLE IF NOT EXISTS square_sync_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,

  -- Sync operation type
  operation_type VARCHAR(50) NOT NULL, -- 'sync_catalog', 'sync_orders', 'sync_staff', 'sync_costs', 'initial_sync'

  -- Direction
  direction VARCHAR(50) NOT NULL, -- 'square_to_prepflow', 'prepflow_to_square', 'bidirectional'

  -- Entity info
  entity_type VARCHAR(50),
  entity_id UUID,
  square_id VARCHAR(255),

  -- Status
  status VARCHAR(50) NOT NULL, -- 'success', 'error', 'conflict', 'skipped', 'pending', 'retrying'

  -- Error details
  error_message TEXT,
  error_details JSONB,

  -- Sync metadata
  sync_metadata JSONB,

  -- Retry information
  retry_count INTEGER DEFAULT 0,
  max_retries INTEGER DEFAULT 5,
  next_retry_at TIMESTAMP WITH TIME ZONE,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_square_sync_logs_user ON square_sync_logs(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_square_sync_logs_status ON square_sync_logs(status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_square_sync_logs_operation_type ON square_sync_logs(operation_type, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_square_sync_logs_next_retry ON square_sync_logs(next_retry_at) WHERE next_retry_at IS NOT NULL;

-- Add comments for documentation
COMMENT ON TABLE square_sync_logs IS 'Sync operation log for debugging and audit trail';
COMMENT ON COLUMN square_sync_logs.operation_type IS 'Sync operation type: sync_catalog, sync_orders, sync_staff, sync_costs, initial_sync';
COMMENT ON COLUMN square_sync_logs.status IS 'Status: success, error, conflict, skipped, pending, retrying';
COMMENT ON COLUMN square_sync_logs.error_details IS 'Detailed error information stored as JSONB';

-- 3. Square Configuration Table
-- Per-user Square configuration
CREATE TABLE IF NOT EXISTS square_configurations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE UNIQUE,

  -- Square credentials (encrypted or stored securely)
  square_application_id VARCHAR(255) NOT NULL,
  square_access_token_encrypted TEXT NOT NULL, -- Encrypted token

  -- Environment
  square_environment VARCHAR(50) DEFAULT 'sandbox', -- 'sandbox' or 'production'

  -- Default location ID
  default_location_id VARCHAR(255),

  -- Sync settings
  auto_sync_enabled BOOLEAN DEFAULT true,
  sync_frequency_minutes INTEGER DEFAULT 60, -- How often to auto-sync

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
  initial_sync_error TEXT, -- Error message if initial sync failed

  -- Auto-sync configuration
  auto_sync_direction VARCHAR(50) DEFAULT 'prepflow_to_square', -- 'prepflow_to_square' | 'bidirectional'
  auto_sync_staff BOOLEAN DEFAULT true,
  auto_sync_dishes BOOLEAN DEFAULT true,
  auto_sync_costs BOOLEAN DEFAULT true,
  sync_debounce_ms INTEGER DEFAULT 5000,
  sync_queue_batch_size INTEGER DEFAULT 10,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_square_configurations_user ON square_configurations(user_id);

-- Add function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_square_configurations_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add trigger to automatically update updated_at
DROP TRIGGER IF EXISTS update_square_configurations_updated_at ON square_configurations;
CREATE TRIGGER update_square_configurations_updated_at
  BEFORE UPDATE ON square_configurations
  FOR EACH ROW
  EXECUTE FUNCTION update_square_configurations_updated_at();

-- Add comments for documentation
COMMENT ON TABLE square_configurations IS 'Per-user Square configuration and sync settings';
COMMENT ON COLUMN square_configurations.square_access_token_encrypted IS 'Encrypted Square access token';
COMMENT ON COLUMN square_configurations.initial_sync_status IS 'Initial sync status: pending, in_progress, completed, failed';
COMMENT ON COLUMN square_configurations.auto_sync_direction IS 'Auto-sync direction: prepflow_to_square or bidirectional';




