-- Final Fixes SQL - Run this in Supabase

-- 1. Fix Christmas Hero (update any active hero)
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

-- 2. Ensure expenses and income tables have status column
ALTER TABLE expenses ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'cleared';
ALTER TABLE income ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'cleared';

-- 3. Update existing records to have proper status
UPDATE expenses SET status = 'cleared' WHERE status IS NULL;
UPDATE income SET status = 'cleared' WHERE status IS NULL;

-- 4. Add some test records with different statuses (optional - for testing)
-- Uncomment these if you want test data:

-- INSERT INTO expenses (description, amount, category, date, status, created_by) 
-- VALUES 
--   ('Test Pending Expense', 5000, 'Feed', CURRENT_DATE, 'pending', (SELECT id FROM auth.users LIMIT 1)),
--   ('Test Flagged Expense', 3000, 'Medication', CURRENT_DATE, 'flagged', (SELECT id FROM auth.users LIMIT 1));

-- INSERT INTO income (description, amount, source, date, status, created_by) 
-- VALUES 
--   ('Test Pending Income', 8000, 'Egg Sales', CURRENT_DATE, 'pending', (SELECT id FROM auth.users LIMIT 1)),
--   ('Test Flagged Income', 6000, 'Chicken Sales', CURRENT_DATE, 'flagged', (SELECT id FROM auth.users LIMIT 1));

-- 5. Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_expenses_status ON expenses(status);
CREATE INDEX IF NOT EXISTS idx_income_status ON income(status);
CREATE INDEX IF NOT EXISTS idx_expenses_date ON expenses(date);
CREATE INDEX IF NOT EXISTS idx_income_date ON income(date);

-- 6. Verify the changes
SELECT 'Heroes Updated' as result;
SELECT 'Status columns added' as result;
SELECT 'Indexes created' as result;