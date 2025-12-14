-- Create financial management tables for expense and income tracking

-- Create expenses table
CREATE TABLE IF NOT EXISTS expenses (
  id SERIAL PRIMARY KEY,
  description TEXT NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  category VARCHAR(50) NOT NULL,
  store_name VARCHAR(100),
  date DATE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_by UUID REFERENCES auth.users(id) DEFAULT auth.uid()
);

-- Create income table
CREATE TABLE IF NOT EXISTS income (
  id SERIAL PRIMARY KEY,
  description TEXT NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  source VARCHAR(50) NOT NULL,
  date DATE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_by UUID REFERENCES auth.users(id) DEFAULT auth.uid()
);

-- Enable RLS
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE income ENABLE ROW LEVEL SECURITY;

-- Create policies for expenses
CREATE POLICY "Admins can manage expenses" ON expenses
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM admin_roles 
      WHERE user_id = auth.uid()
    )
  );

-- Create policies for income
CREATE POLICY "Admins can manage income" ON income
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM admin_roles 
      WHERE user_id = auth.uid()
    )
  );

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_expenses_date ON expenses(date);
CREATE INDEX IF NOT EXISTS idx_expenses_category ON expenses(category);
CREATE INDEX IF NOT EXISTS idx_income_date ON income(date);
CREATE INDEX IF NOT EXISTS idx_income_source ON income(source);

-- Insert sample data for testing
INSERT INTO expenses (description, amount, category, store_name, date) VALUES
('Chicken Feed - Layer Mash', 15000.00, 'Feed', 'Agro Store Ltd', CURRENT_DATE - INTERVAL '2 days'),
('Vitamins and Supplements', 5000.00, 'Medication', 'Vet Supplies', CURRENT_DATE - INTERVAL '1 day'),
('Water System Repair', 8000.00, 'Maintenance', 'Plumbing Services', CURRENT_DATE);

INSERT INTO income (description, amount, source, date) VALUES
('Egg Sales - 50 crates', 25000.00, 'Egg Sales', CURRENT_DATE - INTERVAL '2 days'),
('Chicken Sales - 10 birds', 20000.00, 'Chicken Sales', CURRENT_DATE - INTERVAL '1 day'),
('Day-old Chicks - 100 pieces', 15000.00, 'Chick Sales', CURRENT_DATE);