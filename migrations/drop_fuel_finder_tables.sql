-- Drop Fuel Finder Database Objects
-- This migration removes all fuel finder related database objects

-- Drop triggers first (they depend on tables)
DROP TRIGGER IF EXISTS update_fuel_prices_updated_at ON fuel_prices;
DROP TRIGGER IF EXISTS update_fuel_stations_updated_at ON fuel_stations;

-- Drop indexes
DROP INDEX IF EXISTS idx_fuel_prices_station_fuel;
DROP INDEX IF EXISTS idx_fuel_prices_date;
DROP INDEX IF EXISTS idx_fuel_stations_location;
DROP INDEX IF EXISTS idx_fuel_prices_type_price;
DROP INDEX IF EXISTS idx_fuel_stations_name;
DROP INDEX IF EXISTS idx_fuel_stations_state;

-- Drop tables (fuel_prices will be dropped automatically due to CASCADE)
-- But we'll drop it explicitly first to be safe
DROP TABLE IF EXISTS fuel_prices CASCADE;
DROP TABLE IF EXISTS fuel_stations CASCADE;

-- Remove feature flag entry from hidden_feature_flags table
DELETE FROM hidden_feature_flags WHERE feature_key = 'fuel_finder';





