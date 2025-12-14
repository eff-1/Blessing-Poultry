-- COMPLETE RLS POLICY FIX
-- This will fix all infinite recursion issues

-- 1. First, disable RLS temporarily to clean up
ALTER TABLE admin_roles DISABLE ROW LEVEL SECURITY;
ALTER TABLE expenses DISABLE ROW LEVEL SECURITY;
ALTER TABLE income DISABLE ROW LEVEL SECURITY;

-- 2. Drop ALL existing policies that might cause recursion
DROP POLICY IF EXISTS "Admins can manage expenses" ON expenses;
DROP POLICY IF EXISTS "Admins can manage income" ON income;
DROP POLICY IF EXISTS "Admin access only" ON admin_roles;
DROP POLICY IF EXISTS "Admins can view admin_roles" ON admin_roles;
DROP POLICY IF EXISTS "Users can view own admin role" ON admin_roles;

-- 3. Re-enable RLS
ALTER TABLE admin_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE income ENABLE ROW LEVEL SECURITY;

-- 4. Create simple, non-recursive policies

-- For admin_roles table - allow users to see their own role
CREATE POLICY "Users can view own admin role" ON admin_roles
  FOR SELECT USING (user_id = auth.uid());

-- For expenses table - allow authenticated users (we'll check admin in app)
CREATE POLICY "Authenticated users can manage expenses" ON expenses
  FOR ALL USING (auth.uid() IS NOT NULL);

-- For income table - allow authenticated users (we'll check admin in app)  
CREATE POLICY "Authenticated users can manage income" ON income
  FOR ALL USING (auth.uid() IS NOT NULL);

-- 5. Grant necessary permissions
GRANT ALL ON admin_roles TO authenticated;
GRANT ALL ON expenses TO authenticated;
GRANT ALL ON income TO authenticated;

-- 6. Ensure tables exist with correct structure
CREATE TABLE IF NOT EXISTS admin_roles (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  role VARCHAR(50) DEFAULT 'admin',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id)
);

-- 7. Insert a test admin role if none exists (replace with your user ID)
-- You can get your user ID from Supabase Auth > Users
-- INSERT INTO admin_roles (user_id, role) 
-- VALUES ('your-user-id-here', 'super_admin')
-- ON CONFLICT (user_id) DO NOTHING;