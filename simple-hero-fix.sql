-- Simple Hero Fix - Run this in Supabase
-- This will update the Christmas hero with 20% OFF

-- Update any active hero to Christmas with 20% OFF
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

-- If no active hero exists, create one
INSERT INTO heroes (
  name, title, subtitle, description, discount_text, 
  cta_primary, cta_secondary, is_active, created_at, updated_at
)
SELECT 
  'christmas', 'CHRISTMAS', 'MEGA SALE', 
  'Get amazing deals on fresh poultry products this Christmas season',
  '20% OFF', 'Shop Now', 'Flash Deals', true, NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM heroes WHERE is_active = true);

-- Ensure expenses and income tables have status column
ALTER TABLE expenses ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'cleared';
ALTER TABLE income ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'cleared';

-- Update existing records to have proper status
UPDATE expenses SET status = 'cleared' WHERE status IS NULL;
UPDATE income SET status = 'cleared' WHERE status IS NULL;

-- Verify the changes
SELECT 'Hero updated successfully!' as result;
SELECT * FROM heroes WHERE is_active = true;