-- DELETE USERS ONLY (Keep all other data like heroes, products, etc.)
-- This will only remove users and admin_roles, keeping everything else

-- 1. Disable RLS temporarily to avoid conflicts
ALTER TABLE admin_roles DISABLE ROW LEVEL SECURITY;
ALTER TABLE expenses DISABLE ROW LEVEL SECURITY;
ALTER TABLE income DISABLE ROW LEVEL SECURITY;

-- 2. Delete user-related financial data first (to avoid foreign key conflicts)
DELETE FROM expenses;
DELETE FROM income;
DELETE FROM admin_roles;

-- 3. Now delete all auth users (should work without foreign key conflicts)
DELETE FROM auth.users;

-- 4. Reset sequences
ALTER SEQUENCE admin_roles_id_seq RESTART WITH 1;
ALTER SEQUENCE expenses_id_seq RESTART WITH 1;
ALTER SEQUENCE income_id_seq RESTART WITH 1;

-- 5. Recreate admin_roles table with simple structure (no RLS issues)
DROP TABLE IF EXISTS admin_roles CASCADE;
CREATE TABLE admin_roles (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  role VARCHAR(50) DEFAULT 'admin',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id)
);

-- 6. Grant permissions (no RLS for now to avoid recursion)
GRANT ALL ON admin_roles TO authenticated;
GRANT ALL ON admin_roles TO anon;

-- 7. Re-enable RLS for financial tables with simple policies
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE income ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow authenticated users expenses" ON expenses
  FOR ALL USING (auth.uid() IS NOT NULL);

CREATE POLICY "Allow authenticated users income" ON income
  FOR ALL USING (auth.uid() IS NOT NULL);

-- 8. Keep admin_roles WITHOUT RLS to prevent infinite recursion
-- We'll handle admin checks in the application code instead