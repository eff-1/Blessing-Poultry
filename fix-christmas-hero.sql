-- Fix Christmas Hero Data - 20% OFF
-- First check table structure and update accordingly

-- Check what columns exist in heroes table
-- SELECT column_name FROM information_schema.columns WHERE table_name = 'heroes';

-- Simple approach - update the active hero (assuming it's Christmas)
UPDATE heroes 
SET 
  title = 'CHRISTMAS',
  subtitle = 'MEGA SALE', 
  description = 'Get amazing deals on fresh poultry products this Christmas season',
  discount_text = '20% OFF',
  cta_primary = 'Shop Now',
  cta_secondary = 'Flash Deals',
  updated_at = NOW()
WHERE is_active = true;

-- Alternative: Update by ID if you know the Christmas hero ID
-- UPDATE heroes 
-- SET 
--   discount_text = '20% OFF',
--   updated_at = NOW()
-- WHERE id = 1; -- Replace 1 with actual Christmas hero ID

-- Check current heroes
SELECT * FROM heroes;