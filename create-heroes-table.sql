-- Create heroes table for managing different hero sections
CREATE TABLE IF NOT EXISTS heroes (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  theme VARCHAR(50) NOT NULL DEFAULT 'christmas',
  title VARCHAR(255) NOT NULL,
  subtitle VARCHAR(255),
  description TEXT,
  discount_text VARCHAR(100),
  countdown_days INTEGER DEFAULT 0,
  countdown_hours INTEGER DEFAULT 0,
  countdown_minutes INTEGER DEFAULT 0,
  countdown_seconds INTEGER DEFAULT 0,
  cta_primary VARCHAR(100) DEFAULT 'Shop Now',
  cta_secondary VARCHAR(100) DEFAULT 'View Deals',
  background_image VARCHAR(500),
  is_active BOOLEAN DEFAULT FALSE,
  features JSONB DEFAULT '[]',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_heroes_updated_at 
    BEFORE UPDATE ON heroes 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Insert default Christmas hero
INSERT INTO heroes (
  name,
  theme,
  title,
  subtitle,
  description,
  discount_text,
  countdown_days,
  countdown_hours,
  countdown_minutes,
  countdown_seconds,
  cta_primary,
  cta_secondary,
  background_image,
  is_active,
  features
) VALUES (
  'Christmas Sale 2024',
  'christmas',
  'CHRISTMAS',
  'MEGA SALE',
  'Up to 70% OFF on Everything!',
  '70% OFF',
  23,
  45,
  12,
  38,
  'Shop Now',
  'View Deals',
  '/images/hero/christmas-banner.jpg',
  true,
  '[
    {"icon": "Gift", "text": "Free Gift Wrap"},
    {"icon": "Sparkles", "text": "Flash Deals"},
    {"icon": "Heart", "text": "Loved by 100K+"}
  ]'::jsonb
);

-- Enable RLS (Row Level Security)
ALTER TABLE heroes ENABLE ROW LEVEL SECURITY;

-- Create policy for authenticated users (admins)
CREATE POLICY "Enable all operations for authenticated users" ON heroes
  FOR ALL USING (auth.role() = 'authenticated');

-- Create policy for public read access to active heroes
CREATE POLICY "Enable read access for active heroes" ON heroes
  FOR SELECT USING (is_active = true);