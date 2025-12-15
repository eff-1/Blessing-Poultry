-- Budget Tracking System SQL
-- Run this in Supabase to create budget functionality

-- 1. Create monthly_budgets table
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

-- 2. Enable RLS
ALTER TABLE monthly_budgets ENABLE ROW LEVEL SECURITY;

-- 3. Create RLS policy
CREATE POLICY "authenticated_access_budgets" ON monthly_budgets
  FOR ALL USING (auth.uid() IS NOT NULL);

-- 4. Grant permissions
GRANT ALL ON monthly_budgets TO authenticated;

-- 5. Create budget categories table for detailed tracking
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

-- 6. Enable RLS for budget categories
ALTER TABLE budget_categories ENABLE ROW LEVEL SECURITY;

-- 7. Create RLS policy for budget categories
CREATE POLICY "authenticated_access_budget_categories" ON budget_categories
  FOR ALL USING (auth.uid() IS NOT NULL);

-- 8. Grant permissions for budget categories
GRANT ALL ON budget_categories TO authenticated;

-- 9. Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_monthly_budgets_month_year ON monthly_budgets(month, year);
CREATE INDEX IF NOT EXISTS idx_budget_categories_budget_id ON budget_categories(budget_id);
CREATE INDEX IF NOT EXISTS idx_budget_categories_type ON budget_categories(category_type);

-- 10. Insert default budget for current month (optional)
INSERT INTO monthly_budgets (month, year, budget_amount, expense_limit, income_target, notes, created_by)
SELECT 
  EXTRACT(MONTH FROM CURRENT_DATE)::INTEGER,
  EXTRACT(YEAR FROM CURRENT_DATE)::INTEGER,
  100000.00, -- Default budget amount
  80000.00,  -- Default expense limit
  120000.00, -- Default income target
  'Default monthly budget - adjust as needed',
  (SELECT id FROM auth.users LIMIT 1)
WHERE NOT EXISTS (
  SELECT 1 FROM monthly_budgets 
  WHERE month = EXTRACT(MONTH FROM CURRENT_DATE)::INTEGER 
  AND year = EXTRACT(YEAR FROM CURRENT_DATE)::INTEGER
);

-- 11. Insert default budget categories for current month
INSERT INTO budget_categories (budget_id, category_name, allocated_amount, category_type)
SELECT 
  b.id,
  category_data.name,
  category_data.amount,
  category_data.type
FROM monthly_budgets b
CROSS JOIN (
  VALUES 
    ('Feed', 30000.00, 'expense'),
    ('Medication', 15000.00, 'expense'),
    ('Equipment', 10000.00, 'expense'),
    ('Labor', 20000.00, 'expense'),
    ('Utilities', 5000.00, 'expense'),
    ('Egg Sales', 80000.00, 'income'),
    ('Chicken Sales', 40000.00, 'income')
) AS category_data(name, amount, type)
WHERE b.month = EXTRACT(MONTH FROM CURRENT_DATE)::INTEGER 
AND b.year = EXTRACT(YEAR FROM CURRENT_DATE)::INTEGER
AND NOT EXISTS (
  SELECT 1 FROM budget_categories bc 
  WHERE bc.budget_id = b.id AND bc.category_name = category_data.name
);

-- 12. Create function to update spent amounts automatically
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

-- 13. Create triggers to auto-update spent amounts
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

-- 14. Verify setup
SELECT 'Budget system created successfully!' as result;
SELECT 
  mb.*,
  (SELECT COUNT(*) FROM budget_categories WHERE budget_id = mb.id) as category_count
FROM monthly_budgets mb
WHERE month = EXTRACT(MONTH FROM CURRENT_DATE)::INTEGER 
AND year = EXTRACT(YEAR FROM CURRENT_DATE)::INTEGER;