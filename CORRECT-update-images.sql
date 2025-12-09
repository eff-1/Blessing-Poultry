-- ✅ CORRECT SQL - BASED ON YOUR ACTUAL IMAGE FILES
-- Run this in Supabase SQL Editor

-- Update Contact Info
UPDATE contact_info SET 
  phone = '0706 079 0094',
  whatsapp = '2347060790094',
  email = 'info@blessingpoultries.com',
  address = '141, Idiroko Express Way, Oju-Ore, Ota 102213, Nigeria';

-- Update About (using actual file: farm-1.jpg)
UPDATE about SET 
  content = 'At Blessing Poultries, we are dedicated to providing fresh, healthy, and naturally raised poultry products. Located at 141, Idiroko Express Way, Oju-Ore, Ota, we have been serving the community for over 10 years with quality products and exceptional service. We are into poultry production and treatments of all kinds of birds. We believe in sustainable farming practices and the humane treatment of our birds.',
  image_url = '/images/about/farm-1.jpg';

-- Clear old products and add new ones with ACTUAL LOCAL IMAGE FILES
DELETE FROM products;

INSERT INTO products (name, description, price, category, in_stock, image_url) VALUES
-- Eggs (using egg-1.jpeg, egg-2.jpeg, egg-3.jpeg, egg-4.jpeg)
('Fresh Farm Eggs (Crate)', 'Fresh eggs from free-range chickens, delivered daily', 2500.00, 'Eggs', true, '/images/products/eggs/egg-1.jpeg'),
('Brown Eggs (Dozen)', 'Premium brown eggs from healthy layers', 1200.00, 'Eggs', true, '/images/products/eggs/egg-2.jpeg'),
('White Eggs (Crate)', 'Clean white eggs, farm fresh', 2300.00, 'Eggs', true, '/images/products/eggs/egg-3.jpeg'),
('Organic Eggs (Half Crate)', 'Organic free-range eggs', 1500.00, 'Eggs', true, '/images/products/eggs/egg-4.jpeg'),

-- Broilers (using broiler-1.jpeg, broiler-2.jpeg, broiler-3.jpeg, broiler-4.jpeg)
('Broiler Chicken (Live)', 'Healthy broiler chickens ready for sale, 2-3kg', 3500.00, 'Broilers', true, '/images/products/broilers/broiler-1.jpeg'),
('Dressed Chicken', 'Freshly dressed broiler chicken, cleaned and ready to cook', 4000.00, 'Broilers', true, '/images/products/broilers/broiler-2.jpeg'),
('Whole Chicken (Frozen)', 'Premium frozen whole chicken', 3800.00, 'Broilers', true, '/images/products/broilers/broiler-3.jpeg'),
('Premium Broiler (Large)', 'Large size broiler chicken, 3-4kg', 4500.00, 'Broilers', true, '/images/products/broilers/broiler-4.jpeg'),

-- Layers (using layer-1.jpeg, layer-2.jpeg, layer-3.jpeg)
('Layer Hens (Point of Lay)', 'Productive layer hens ready to start laying', 4000.00, 'Layers', true, '/images/products/layers/layer-1.jpeg'),
('Mature Layers', 'Mature laying hens, excellent egg production', 3500.00, 'Layers', true, '/images/products/layers/layer-2.jpeg'),
('Premium Layer Hens', 'High-quality layer hens, consistent egg production', 4200.00, 'Layers', true, '/images/products/layers/layer-3.jpeg'),

-- Day-Old Chicks (using chick-1.jpeg, chick-2.jpeg, chicks-3.jpeg, chick-4.jpeg)
('Day-Old Chicks (Broiler)', 'Healthy day-old broiler chicks, vaccinated', 500.00, 'Day-Old Chicks', true, '/images/products/chicks/chick-1.jpeg'),
('Day-Old Chicks (Layer)', 'Quality day-old layer chicks, vaccinated', 450.00, 'Day-Old Chicks', true, '/images/products/chicks/chick-2.jpeg'),
('Day-Old Chicks (Mixed)', 'Mixed breed day-old chicks', 475.00, 'Day-Old Chicks', true, '/images/products/chicks/chicks-3.jpeg'),
('Premium Day-Old Chicks', 'Premium quality day-old chicks', 550.00, 'Day-Old Chicks', true, '/images/products/chicks/chick-4.jpeg'),

-- Feeds (using feeds-1.png, feed-2.png, feed-3.jpeg, feed-4.png, feed-5.jpeg)
('Broiler Starter Feed (25kg)', 'Quality starter feed for broiler chicks', 8500.00, 'Feeds', true, '/images/products/feeds/feeds-1.png'),
('Layer Feed (25kg)', 'Premium layer feed for optimal egg production', 8000.00, 'Feeds', true, '/images/products/feeds/feed-2.png'),
('Grower Feed (25kg)', 'Balanced grower feed for healthy development', 7500.00, 'Feeds', true, '/images/products/feeds/feed-3.jpeg'),
('Finisher Feed (25kg)', 'Finisher feed for broilers', 8200.00, 'Feeds', true, '/images/products/feeds/feed-4.png'),
('Premium Layer Mash (25kg)', 'Premium quality layer mash', 8500.00, 'Feeds', true, '/images/products/feeds/feed-5.jpeg');

-- Clear old gallery and add new ones with ACTUAL LOCAL IMAGES
DELETE FROM gallery;

INSERT INTO gallery (image_url, caption) VALUES
-- Eggs
('/images/products/eggs/egg-1.jpeg', 'Fresh Farm Eggs'),
('/images/products/eggs/egg-2.jpeg', 'Brown Eggs'),
('/images/products/eggs/egg-3.jpeg', 'White Eggs'),
('/images/products/eggs/egg-4.jpeg', 'Organic Eggs'),

-- Broilers
('/images/products/broilers/broiler-1.jpeg', 'Healthy Broilers'),
('/images/products/broilers/broiler-2.jpeg', 'Quality Chickens'),
('/images/products/broilers/broiler-3.jpeg', 'Premium Broilers'),
('/images/products/broilers/broiler-4.jpeg', 'Large Broilers'),

-- Layers
('/images/products/layers/layer-1.jpeg', 'Layer Hens'),
('/images/products/layers/layer-2.jpeg', 'Productive Layers'),
('/images/products/layers/layer-3.jpeg', 'Premium Layers'),

-- Chicks
('/images/products/chicks/chick-1.jpeg', 'Day-Old Chicks'),
('/images/products/chicks/chick-2.jpeg', 'Healthy Chicks'),
('/images/products/chicks/chicks-3.jpeg', 'Mixed Chicks'),
('/images/products/chicks/chick-4.jpeg', 'Premium Chicks'),

-- Feeds
('/images/products/feeds/feeds-1.png', 'Quality Feeds'),
('/images/products/feeds/feed-2.png', 'Layer Feed'),
('/images/products/feeds/feed-3.jpeg', 'Grower Feed'),
('/images/products/feeds/feed-4.png', 'Finisher Feed'),
('/images/products/feeds/feed-5.jpeg', 'Premium Mash'),

-- About/Farm
('/images/about/farm-1.jpg', 'Our Farm'),
('/images/about/farm-2.jpeg', 'Farm Facilities'),
('/images/about/farm-3.jpeg', 'Clean Environment'),
('/images/about/farm-4.jpeg', 'Modern Farm Setup');

-- Success message
SELECT 'Database updated successfully with local images!' as message;
