-- Blessing Poultry Database Setup
-- Run this in Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Hero table
CREATE TABLE IF NOT EXISTS hero (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  subtitle TEXT,
  image_url TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- About table
CREATE TABLE IF NOT EXISTS about (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  content TEXT NOT NULL,
  image_url TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Products table
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  price NUMERIC(10,2) NOT NULL,
  image_url TEXT,
  category TEXT NOT NULL,
  in_stock BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Gallery table
CREATE TABLE IF NOT EXISTS gallery (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  image_url TEXT NOT NULL,
  caption TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Testimonials table
CREATE TABLE IF NOT EXISTS testimonials (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  comment TEXT NOT NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  image_url TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Contact info table
CREATE TABLE IF NOT EXISTS contact_info (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  phone TEXT,
  whatsapp TEXT,
  email TEXT,
  address TEXT,
  facebook TEXT,
  instagram TEXT,
  twitter TEXT
);

-- Enable Row Level Security (RLS)
ALTER TABLE hero ENABLE ROW LEVEL SECURITY;
ALTER TABLE about ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_info ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Public read access" ON hero FOR SELECT USING (true);
CREATE POLICY "Public read access" ON about FOR SELECT USING (true);
CREATE POLICY "Public read access" ON products FOR SELECT USING (true);
CREATE POLICY "Public read access" ON gallery FOR SELECT USING (true);
CREATE POLICY "Public read access" ON testimonials FOR SELECT USING (true);
CREATE POLICY "Public read access" ON contact_info FOR SELECT USING (true);

-- Create policies for authenticated users (admin) to manage content
CREATE POLICY "Authenticated users can insert" ON hero FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update" ON hero FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Authenticated users can delete" ON hero FOR DELETE TO authenticated USING (true);

CREATE POLICY "Authenticated users can insert" ON about FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update" ON about FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Authenticated users can delete" ON about FOR DELETE TO authenticated USING (true);

CREATE POLICY "Authenticated users can insert" ON products FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update" ON products FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Authenticated users can delete" ON products FOR DELETE TO authenticated USING (true);

CREATE POLICY "Authenticated users can insert" ON gallery FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update" ON gallery FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Authenticated users can delete" ON gallery FOR DELETE TO authenticated USING (true);

CREATE POLICY "Authenticated users can insert" ON testimonials FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update" ON testimonials FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Authenticated users can delete" ON testimonials FOR DELETE TO authenticated USING (true);

CREATE POLICY "Authenticated users can insert" ON contact_info FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update" ON contact_info FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Authenticated users can delete" ON contact_info FOR DELETE TO authenticated USING (true);

-- Insert sample data with LOCAL IMAGES
INSERT INTO contact_info (phone, whatsapp, email, address, facebook, instagram, twitter) VALUES
('0706 079 0094', '2348012345678', 'info@blessingpoultries.com', '141, Idiroko Express Way, Oju-Ore, Ota 102213, Nigeria', '', '', '');

INSERT INTO about (content, image_url) VALUES
('At Blessing Poultries, we are dedicated to providing fresh, healthy, and naturally raised poultry products. Located at 141, Idiroko Express Way, Oju-Ore, Ota, we have been serving the community for over 10 years with quality products and exceptional service. We are into poultry production and treatments of all kinds of birds. We believe in sustainable farming practices and the humane treatment of our birds.', 
'/images/about/farm-1.jpg');

-- Sample products with LOCAL IMAGES
INSERT INTO products (name, description, price, category, in_stock, image_url) VALUES
-- Eggs
('Fresh Farm Eggs (Crate)', 'Fresh eggs from free-range chickens, delivered daily', 2500.00, 'Eggs', true, '/images/products/eggs/egg-1.jpg'),
('Brown Eggs (Dozen)', 'Premium brown eggs from healthy layers', 1200.00, 'Eggs', true, '/images/products/eggs/egg-2.jpg'),
('White Eggs (Crate)', 'Clean white eggs, farm fresh', 2300.00, 'Eggs', true, '/images/products/eggs/egg-3.jpg'),

-- Broilers
('Broiler Chicken (Live)', 'Healthy broiler chickens ready for sale, 2-3kg', 3500.00, 'Broilers', true, '/images/products/broilers/broiler-1.jpg'),
('Dressed Chicken', 'Freshly dressed broiler chicken, cleaned and ready to cook', 4000.00, 'Broilers', true, '/images/products/broilers/broiler-2.jpg'),
('Whole Chicken (Frozen)', 'Premium frozen whole chicken', 3800.00, 'Broilers', true, '/images/products/broilers/broiler-3.jpg'),

-- Layers
('Layer Hens (Point of Lay)', 'Productive layer hens ready to start laying', 4000.00, 'Layers', true, '/images/products/layers/layer-1.jpg'),
('Mature Layers', 'Mature laying hens, excellent egg production', 3500.00, 'Layers', true, '/images/products/layers/layer-2.jpg'),

-- Day-Old Chicks
('Day-Old Chicks (Broiler)', 'Healthy day-old broiler chicks, vaccinated', 500.00, 'Day-Old Chicks', true, '/images/products/chicks/chick-1.jpg'),
('Day-Old Chicks (Layer)', 'Quality day-old layer chicks, vaccinated', 450.00, 'Day-Old Chicks', true, '/images/products/chicks/chick-2.jpg'),

-- Feeds
('Broiler Starter Feed (25kg)', 'Quality starter feed for broiler chicks', 8500.00, 'Feeds', true, '/images/products/feeds/feed-1.jpg'),
('Layer Feed (25kg)', 'Premium layer feed for optimal egg production', 8000.00, 'Feeds', true, '/images/products/feeds/feed-2.jpg'),
('Grower Feed (25kg)', 'Balanced grower feed for healthy development', 7500.00, 'Feeds', true, '/images/products/feeds/feed-3.jpg');

-- Sample testimonials
INSERT INTO testimonials (name, comment, rating) VALUES
('John Adebayo', 'Best quality eggs in Ota! Always fresh and the customer service is excellent. I have been buying from Blessing Poultries for over a year now.', 5),
('Mary Okonkwo', 'I have been buying from Blessing Poultries for 2 years now. Their chickens are healthy and well-raised. Very professional service!', 5),
('David Eze', 'Great prices and reliable delivery. The day-old chicks are always healthy. Highly recommended!', 5),
('Blessing Adeyemi', 'Their feeds are top quality. My birds are growing well and laying consistently. Thank you Blessing Poultries!', 5);

-- Sample gallery images with LOCAL IMAGES
INSERT INTO gallery (image_url, caption) VALUES
('/images/products/eggs/egg-1.jpg', 'Fresh Farm Eggs'),
('/images/products/broilers/broiler-1.jpg', 'Healthy Broilers'),
('/images/products/layers/layer-1.jpg', 'Layer Hens'),
('/images/products/chicks/chick-1.jpg', 'Day-Old Chicks'),
('/images/products/feeds/feed-1.jpg', 'Quality Feeds'),
('/images/about/farm-1.jpg', 'Our Farm'),
('/images/about/farm-2.jpg', 'Farm Facilities'),
('/images/about/farm-3.jpg', 'Clean Environment');
