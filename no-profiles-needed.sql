-- No profiles table needed!
-- You're using Supabase auth.users table which is perfect.

-- Just run this to make sure your products have stock columns:
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS stock_quantity INTEGER DEFAULT 50,
ADD COLUMN IF NOT EXISTS stock_status TEXT DEFAULT 'in_stock';

-- Update existing products to be in stock
UPDATE products SET 
  stock_quantity = 50,
  stock_status = 'in_stock',
  in_stock = true
WHERE stock_quantity IS NULL OR stock_quantity = 0;

-- Show your products
SELECT name, category, stock_quantity, stock_status FROM products;