-- FORCE DELETE ALL USERS AND RESET EVERYTHING
-- This will completely wipe all user data and reset the system

-- 1. Disable RLS on all tables to avoid conflicts
ALTER TABLE admin_roles DISABLE ROW LEVEL SECURITY;
ALTER TABLE expenses DISABLE ROW LEVEL SECURITY;
ALTER TABLE income DISABLE ROW LEVEL SECURITY;
ALTER TABLE heroes DISABLE ROW LEVEL SECURITY;

-- 2. Delete all data that references users
DELETE FROM admin_roles;
DELETE FROM expenses;
DELETE FROM income;
DELETE FROM heroes WHERE created_by IS NOT NULL;

-- 3. Delete all auth users (this should work now)
DELETE FROM auth.users;

-- 4. Reset all sequences
ALTER SEQUENCE admin_roles_id_seq RESTART WITH 1;
ALTER SEQUENCE expenses_id_seq RESTART WITH 1;
ALTER SEQUENCE income_id_seq RESTART WITH 1;

-- 5. Recreate admin_roles table with simple structure
DROP TABLE IF EXISTS admin_roles CASCADE;
CREATE TABLE admin_roles (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  role VARCHAR(50) DEFAULT 'admin',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id)
);

-- 6. Grant permissions (no RLS for now)
GRANT ALL ON admin_roles TO authenticated;
GRANT ALL ON admin_roles TO anon;

-- 7. Re-enable RLS with simple policies
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE income ENABLE ROW LEVEL SECURITY;
ALTER TABLE heroes ENABLE ROW LEVEL SECURITY;

-- Keep admin_roles without RLS for now
-- ALTER TABLE admin_roles ENABLE ROW LEVEL SECURITY;

-- 8. Recreate simple policies for financial tables
CREATE POLICY "Allow authenticated users expenses" ON expenses
  FOR ALL USING (auth.uid() IS NOT NULL);

CREATE POLICY "Allow authenticated users income" ON income
  FOR ALL USING (auth.uid() IS NOT NULL);

-- 9. Insert default heroes if they don't exist
INSERT INTO heroes (name, title, subtitle, description, cta_text, cta_link, background_image, hero_image, is_active, season) VALUES
('Christmas Hero', 'Celebrate Christmas with Fresh Poultry!', '🎄 Special Holiday Discounts Available', 'Make your Christmas celebrations memorable with our premium quality chickens and fresh eggs. Special holiday packages available for bulk orders.', 'Shop Christmas Specials', '/products', '/images/hero/christmas-bg.jpg', '/images/hero/christmas-chicken.jpg', false, 'christmas'),
('Ramadan Hero', 'Premium Poultry for Ramadan', '🌙 Blessed Ramadan Kareem', 'Nourish your family during the holy month with our halal-certified, premium quality poultry products. Special Ramadan packages available.', 'View Ramadan Offers', '/products', '/images/hero/ramadan-bg.jpg', '/images/hero/ramadan-chicken.jpg', false, 'ramadan'),
('Easter Hero', 'Fresh Eggs for Easter Celebrations', '🐣 Happy Easter from Our Farm', 'Celebrate Easter with the freshest eggs and finest poultry from our farm. Perfect for your Easter feast and family gatherings.', 'Easter Specials', '/products', '/images/hero/easter-bg.jpg', '/images/hero/easter-eggs.jpg', false, 'easter'),
('Normal Hero', 'Fresh, Healthy Poultry Products', 'From Our Farm to Your Table', 'Experience the difference of farm-fresh poultry products. Our chickens are raised with care, ensuring the highest quality for your family.', 'Shop Now', '/products', '/images/hero/normal-bg.jpg', '/images/hero/normal-chicken.jpg', true, 'normal')
ON CONFLICT (name) DO NOTHING;