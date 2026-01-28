-- Migration: add-venue-settings
-- Adds table for storing venue location and geofence settings

CREATE TABLE IF NOT EXISTS venue_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL DEFAULT 'Main Venue',
  address TEXT,
  latitude DECIMAL(10, 8) NOT NULL,
  longitude DECIMAL(11, 8) NOT NULL,
  geofence_radius_meters INTEGER NOT NULL DEFAULT 100,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Trigger for updated_at
DROP TRIGGER IF EXISTS update_venue_settings_updated_at ON venue_settings;
CREATE TRIGGER update_venue_settings_updated_at
  BEFORE UPDATE ON venue_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Seed default venue (matches current hardcoded value)
INSERT INTO venue_settings (name, latitude, longitude, geofence_radius_meters)
VALUES ('PrepFlow HQ', -27.6394, 153.1094, 100);
