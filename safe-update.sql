-- SAFE UPDATE SQL - Handles existing tables and policies
-- Run this in Supabase if you get "already exists" errors

-- ========================================
-- 1. SAFE BUDGET SYSTEM SETUP
-- ========================================

-- Create monthly_budgets table (only if not exists)
CREATE TABLE IF NOT EXISTS monthly_budgets (
  id SERIAL PRIMARY KEY,
  month INTEGER NOT NULL, -- 1-12
  year INTEGER NOT NULL,
  budget_amount DECIMAL(12,2) NOT NULL DEFAULT 0,
  expense_limit DECIMAL(12,2) NOT NULL DEFAULT 0,
  income_target DECIMAL(12,2) NOT NULL DEFAULT 0,
  notes TEXT,
  created_by UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(month, year)
);

-- Create budget_categories table (only if not exists)
CREATE TABLE IF NOT EXISTS budget_categories (
  id SERIAL PRIMARY KEY,
  budget_id INTEGER REFERENCES monthly_budgets(id) ON DELETE CASCADE,
  category_name VARCHAR(100) NOT NULL,
  allocated_amount DECIMAL(12,2) NOT NULL DEFAULT 0,
  spent_amount DECIMAL(12,2) NOT NULL DEFAULT 0,
  category_type VARCHAR(20) NOT NULL DEFAULT 'expense', -- 'expense' or 'income'
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Enable RLS (safe - won't error if already enabled)
ALTER TABLE monthly_budgets ENABLE ROW LEVEL SECURITY;
ALTER TABLE budget_categories ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist, then recreate
DROP POLICY IF EXISTS "authenticated_access_budgets" ON monthly_budgets;
CREATE POLICY "authenticated_access_budgets" ON monthly_budgets
  FOR ALL USING (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "authenticated_access_budget_categories" ON budget_categories;
CREATE POLICY "authenticated_access_budget_categories" ON budget_categories
  FOR ALL USING (auth.uid() IS NOT NULL);

-- Grant permissions (safe - won't error if already granted)
GRANT ALL ON monthly_budgets TO authenticated;
GRANT ALL ON budget_categories TO authenticated;

-- Create indexes (safe with IF NOT EXISTS)
CREATE INDEX IF NOT EXISTS idx_monthly_budgets_month_year ON monthly_budgets(month, year);
CREATE INDEX IF NOT EXISTS idx_budget_categories_budget_id ON budget_categories(budget_id);
CREATE INDEX IF NOT EXISTS idx_budget_categories_type ON budget_categories(category_type);

-- ========================================
-- 2. HERO SYSTEM FIXES
-- ========================================

-- Update Christmas hero with 20% OFF
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

-- If no active hero exists, create Christmas hero
INSERT INTO heroes (
  name, title, subtitle, description, discount_text, 
  cta_primary, cta_secondary, is_active, created_at, updated_at
)
SELECT 
  'christmas', 'CHRISTMAS', 'MEGA SALE', 
  'Get amazing deals on fresh poultry products this Christmas season',
  '20% OFF', 'Shop Now', 'Flash Deals', true, NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM heroes WHERE is_active = true);

-- ========================================
-- 3. FINANCIAL SYSTEM FIXES
-- ========================================

-- Ensure expenses and income tables have status column
ALTER TABLE expenses ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'cleared';
ALTER TABLE income ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'cleared';

-- Update existing records to have proper status
UPDATE expenses SET status = 'cleared' WHERE status IS NULL;
UPDATE income SET status = 'cleared' WHERE status IS NULL;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_expenses_status ON expenses(status);
CREATE INDEX IF NOT EXISTS idx_income_status ON income(status);
CREATE INDEX IF NOT EXISTS idx_expenses_date ON expenses(date);
CREATE INDEX IF NOT EXISTS idx_income_date ON income(date);

-- ========================================
-- 4. BUDGET AUTO-UPDATE FUNCTIONS
-- ========================================

-- Create or replace function (safe - will update if exists)
CREATE OR REPLACE FUNCTION update_budget_spent_amounts()
RETURNS TRIGGER AS $$
BEGIN
  -- Update expense categories
  UPDATE budget_categories bc
  SET 
    spent_amount = (
      SELECT COALESCE(SUM(e.amount), 0)
      FROM expenses e
      WHERE e.category = bc.category_name
      AND EXTRACT(MONTH FROM e.date) = (
        SELECT mb.month FROM monthly_budgets mb WHERE mb.id = bc.budget_id
      )
      AND EXTRACT(YEAR FROM e.date) = (
        SELECT mb.year FROM monthly_budgets mb WHERE mb.id = bc.budget_id
      )
    ),
    updated_at = NOW()
  WHERE bc.category_type = 'expense';

  -- Update income categories
  UPDATE budget_categories bc
  SET 
    spent_amount = (
      SELECT COALESCE(SUM(i.amount), 0)
      FROM income i
      WHERE i.source = bc.category_name
      AND EXTRACT(MONTH FROM i.date) = (
        SELECT mb.month FROM monthly_budgets mb WHERE mb.id = bc.budget_id
      )
      AND EXTRACT(YEAR FROM i.date) = (
        SELECT mb.year FROM monthly_budgets mb WHERE mb.id = bc.budget_id
      )
    ),
    updated_at = NOW()
  WHERE bc.category_type = 'income';

  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Drop and recreate triggers (safe)
DROP TRIGGER IF EXISTS trigger_update_budget_on_expense ON expenses;
CREATE TRIGGER trigger_update_budget_on_expense
  AFTER INSERT OR UPDATE OR DELETE ON expenses
  FOR EACH STATEMENT
  EXECUTE FUNCTION update_budget_spent_amounts();

DROP TRIGGER IF EXISTS trigger_update_budget_on_income ON income;
CREATE TRIGGER trigger_update_budget_on_income
  AFTER INSERT OR UPDATE OR DELETE ON income
  FOR EACH STATEMENT
  EXECUTE FUNCTION update_budget_spent_amounts();

-- ========================================
-- 5. VERIFICATION
-- ========================================

-- Verify setup
SELECT 'SAFE UPDATE COMPLETED SUCCESSFULLY!' as result;
SELECT 'Budget system ready' as budget_status;
SELECT 'Hero system updated' as hero_status;
SELECT 'Financial system enhanced' as financial_status;

-- Show current active hero
SELECT * FROM heroes WHERE is_active = true LIMIT 1;

-- Show budget tables are ready
SELECT 
  COUNT(*) as budget_count,
  'monthly_budgets table ready' as status
FROM monthly_budgets;

SELECT 
  COUNT(*) as category_count,
  'budget_categories table ready' as status  
FROM budget_categories;