-- Add daily_weather_logs table for weather-operational correlation
-- Stores daily weather conditions (metric: Celsius, mm) for performance analysis

CREATE TABLE IF NOT EXISTS daily_weather_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  log_date DATE NOT NULL UNIQUE,
  latitude DECIMAL(10, 8) NOT NULL,
  longitude DECIMAL(11, 8) NOT NULL,
  temp_celsius_max DECIMAL(4, 1),
  temp_celsius_min DECIMAL(4, 1),
  precipitation_mm DECIMAL(6, 2) DEFAULT 0,
  weather_code INTEGER,
  weather_status VARCHAR(100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_daily_weather_logs_date ON daily_weather_logs(log_date);

-- Trigger for updated_at
DROP TRIGGER IF EXISTS update_daily_weather_logs_updated_at ON daily_weather_logs;
CREATE TRIGGER update_daily_weather_logs_updated_at
  BEFORE UPDATE ON daily_weather_logs
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
