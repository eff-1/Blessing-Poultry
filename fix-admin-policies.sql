-- Fix infinite recursion in admin_roles policies
-- Drop existing policies that cause recursion
DROP POLICY IF EXISTS "Admins can manage expenses" ON expenses;
DROP POLICY IF EXISTS "Admins can manage income" ON income;

-- Create simpler policies that don't reference admin_roles from within admin_roles
CREATE POLICY "Enable all operations for authenticated users" ON expenses
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Enable all operations for authenticated users" ON income
  FOR ALL USING (auth.role() = 'authenticated');

-- For admin_roles table, create a simple policy
DROP POLICY IF EXISTS "Enable read access for all users" ON admin_roles;
CREATE POLICY "Enable read access for authenticated users" ON admin_roles
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Enable insert for authenticated users" ON admin_roles
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable update for own record" ON admin_roles
  FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Enable delete for own record" ON admin_roles
  FOR DELETE USING (user_id = auth.uid());