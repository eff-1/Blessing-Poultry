-- NUCLEAR RESET: Complete admin system cleanup
-- This will completely reset the admin system

-- 1. Drop the entire admin_roles table and recreate it
DROP TABLE IF EXISTS admin_roles CASCADE;

-- 2. Create a fresh admin_roles table with no RLS initially
CREATE TABLE admin_roles (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  role VARCHAR(50) DEFAULT 'admin',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id)
);

-- 3. Grant permissions
GRANT ALL ON admin_roles TO authenticated;
GRANT ALL ON admin_roles TO anon;

-- 4. Enable RLS with a simple policy
ALTER TABLE admin_roles ENABLE ROW LEVEL SECURITY;

-- 5. Create the simplest possible policy
CREATE POLICY "Allow all authenticated users" ON admin_roles
  FOR ALL USING (true);

-- 6. Alternative: If you want to disable RLS completely for now
-- ALTER TABLE admin_roles DISABLE ROW LEVEL SECURITY;

-- 7. Clean up any orphaned data
DELETE FROM expenses WHERE created_by NOT IN (SELECT id FROM auth.users);
DELETE FROM income WHERE created_by NOT IN (SELECT id FROM auth.users);

-- 8. Reset sequences
ALTER SEQUENCE admin_roles_id_seq RESTART WITH 1;