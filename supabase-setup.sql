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

-- Insert sample data (optional)
INSERT INTO contact_info (phone, whatsapp, email, address) VALUES
('08012345678', '2348012345678', 'info@blessingpoultry.com', '123 Farm Road, Lagos, Nigeria');

INSERT INTO about (content, image_url) VALUES
('At Blessing Poultry, we are dedicated to providing fresh, healthy, and naturally raised poultry products. Our farm has been serving the community for years with quality products and exceptional service. We believe in sustainable farming practices and the humane treatment of our birds.', 
'https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?w=800');

-- Sample products
INSERT INTO products (name, description, price, category, in_stock, image_url) VALUES
('Fresh Farm Eggs (Crate)', 'Fresh eggs from free-range chickens', 2500.00, 'Eggs', true, 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=800'),
('Broiler Chicken (Live)', 'Healthy broiler chickens ready for sale', 3500.00, 'Broilers', true, 'https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?w=800'),
('Layer Hens', 'Productive layer hens', 4000.00, 'Layers', true, 'https://images.unsplash.com/photo-1612170153139-6f881ff067e0?w=800'),
('Day-Old Chicks (Broiler)', 'Healthy day-old broiler chicks', 500.00, 'Day-Old Chicks', true, 'https://images.unsplash.com/photo-1563281577-a7be47e20db9?w=800'),
('Poultry Feed (25kg)', 'Quality poultry feed for optimal growth', 8500.00, 'Feeds', true, 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800');

-- Sample testimonials
INSERT INTO testimonials (name, comment, rating) VALUES
('John Adebayo', 'Best quality eggs in Lagos! Always fresh and the customer service is excellent.', 5),
('Mary Okonkwo', 'I have been buying from Blessing Poultry for 2 years now. Their chickens are healthy and well-raised.', 5),
('David Eze', 'Great prices and reliable delivery. Highly recommended!', 4);

-- Sample gallery images
INSERT INTO gallery (image_url, caption) VALUES
('https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?w=800', 'Our farm'),
('https://images.unsplash.com/photo-1612170153139-6f881ff067e0?w=800', 'Happy chickens'),
('https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=800', 'Fresh eggs'),
('https://images.unsplash.com/photo-1563281577-a7be47e20db9?w=800', 'Day-old chicks');
