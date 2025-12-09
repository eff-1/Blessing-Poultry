-- UPDATE EXISTING DATA TO USE LOCAL IMAGES
-- Run this in Supabase SQL Editor

-- Update Contact Info
UPDATE contact_info SET 
  phone = '0706 079 0094',
  whatsapp = '2347060790094',
  email = 'info@blessingpoultries.com',
  address = '141, Idiroko Express Way, Oju-Ore, Ota 102213, Nigeria';

-- Update About
UPDATE about SET 
  content = 'At Blessing Poultries, we are dedicated to providing fresh, healthy, and naturally raised poultry products. Located at 141, Idiroko Express Way, Oju-Ore, Ota, we have been serving the community for over 10 years with quality products and exceptional service. We are into poultry production and treatments of all kinds of birds. We believe in sustainable farming practices and the humane treatment of our birds.',
  image_url = '/images/about/farm-1.jpg';

-- Clear old products and add new ones with local images
DELETE FROM products;

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

-- Clear old gallery and add new ones with local images
DELETE FROM gallery;

INSERT INTO gallery (image_url, caption) VALUES
('/images/products/eggs/egg-1.jpg', 'Fresh Farm Eggs'),
('/images/products/eggs/egg-2.jpg', 'Brown Eggs'),
('/images/products/broilers/broiler-1.jpg', 'Healthy Broilers'),
('/images/products/broilers/broiler-2.jpg', 'Quality Chickens'),
('/images/products/layers/layer-1.jpg', 'Layer Hens'),
('/images/products/layers/layer-2.jpg', 'Productive Layers'),
('/images/products/chicks/chick-1.jpg', 'Day-Old Chicks'),
('/images/products/chicks/chick-2.jpg', 'Healthy Chicks'),
('/images/products/feeds/feed-1.jpg', 'Quality Feeds'),
('/images/products/feeds/feed-2.jpg', 'Layer Feed'),
('/images/about/farm-1.jpg', 'Our Farm'),
('/images/about/farm-2.jpg', 'Farm Facilities'),
('/images/about/farm-3.jpg', 'Clean Environment');
