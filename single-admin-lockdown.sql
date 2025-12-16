-- SINGLE ADMIN LOCKDOWN SYSTEM
-- This SQL enforces strict single admin access

-- ========================================
-- 1. CREATE ADMIN LOCKDOWN TABLE
-- ========================================

CREATE TABLE IF NOT EXISTS admin_lockdown (
  id SERIAL PRIMARY KEY,
  is_locked BOOLEAN DEFAULT TRUE,
  max_admins INTEGER DEFAULT 1,
  locked_at TIMESTAMP DEFAULT NOW(),
  locked_by UUID REFERENCES auth.users(id),
  notes TEXT DEFAULT 'System locked to single admin for security'
);

-- Insert lockdown record
INSERT INTO admin_lockdown (is_locked, max_admins, notes) 
VALUES (TRUE, 1, 'Production system - single admin only')
ON CONFLICT DO NOTHING;

-- ========================================
-- 2. CREATE FUNCTION TO PREVENT NEW ADMINS
-- ========================================

CREATE OR REPLACE FUNCTION prevent_multiple_admins()
RETURNS TRIGGER AS $$
DECLARE
  admin_count INTEGER;
  lockdown_status BOOLEAN;
  max_allowed INTEGER;
BEGIN
  -- Check lockdown status
  SELECT is_locked, max_admins INTO lockdown_status, max_allowed
  FROM admin_lockdown 
  ORDER BY id DESC 
  LIMIT 1;
  
  -- If system is locked, enforce limits
  IF lockdown_status = TRUE THEN
    -- Count existing admins
    SELECT COUNT(*) INTO admin_count FROM admin_roles;
    
    -- Prevent new admin if limit reached
    IF admin_count >= max_allowed THEN
      RAISE EXCEPTION 'ADMIN_LIMIT_REACHED: System locked to % admin(s). No additional admin accounts allowed.', max_allowed;
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ========================================
-- 3. CREATE TRIGGER TO ENFORCE LIMITS
-- ========================================

DROP TRIGGER IF EXISTS enforce_admin_limit ON admin_roles;
CREATE TRIGGER enforce_admin_limit
  BEFORE INSERT ON admin_roles
  FOR EACH ROW
  EXECUTE FUNCTION prevent_multiple_admins();

-- ========================================
-- 4. CREATE ADMIN MANAGEMENT FUNCTIONS
-- ========================================

-- Function to check if user can become admin
CREATE OR REPLACE FUNCTION can_create_admin()
RETURNS BOOLEAN AS $$
DECLARE
  admin_count INTEGER;
  lockdown_status BOOLEAN;
  max_allowed INTEGER;
BEGIN
  SELECT is_locked, max_admins INTO lockdown_status, max_allowed
  FROM admin_lockdown 
  ORDER BY id DESC 
  LIMIT 1;
  
  IF lockdown_status = FALSE THEN
    RETURN TRUE;
  END IF;
  
  SELECT COUNT(*) INTO admin_count FROM admin_roles;
  
  RETURN admin_count < max_allowed;
END;
$$ LANGUAGE plpgsql;

-- Function to get lockdown status
CREATE OR REPLACE FUNCTION get_admin_lockdown_status()
RETURNS TABLE(
  is_locked BOOLEAN,
  max_admins INTEGER,
  current_admins INTEGER,
  can_add_admin BOOLEAN
) AS $$
DECLARE
  admin_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO admin_count FROM admin_roles;
  
  RETURN QUERY
  SELECT 
    al.is_locked,
    al.max_admins,
    admin_count,
    (NOT al.is_locked OR admin_count < al.max_admins) as can_add_admin
  FROM admin_lockdown al
  ORDER BY al.id DESC
  LIMIT 1;
END;
$$ LANGUAGE plpgsql;

-- ========================================
-- 5. ENABLE RLS AND POLICIES
-- ========================================

ALTER TABLE admin_lockdown ENABLE ROW LEVEL SECURITY;

-- Only super admins can view lockdown status
CREATE POLICY "super_admin_lockdown_access" ON admin_lockdown
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM admin_roles 
      WHERE user_id = auth.uid() 
      AND role = 'super_admin'
    )
  );

GRANT ALL ON admin_lockdown TO authenticated;
GRANT USAGE ON SEQUENCE admin_lockdown_id_seq TO authenticated;

-- ========================================
-- 6. EMERGENCY UNLOCK FUNCTION (USE CAREFULLY)
-- ========================================

-- This function can only be called by existing super admin
CREATE OR REPLACE FUNCTION emergency_unlock_admin_system(unlock_reason TEXT)
RETURNS BOOLEAN AS $$
DECLARE
  current_user_role TEXT;
BEGIN
  -- Check if current user is super admin
  SELECT role INTO current_user_role 
  FROM admin_roles 
  WHERE user_id = auth.uid();
  
  IF current_user_role != 'super_admin' THEN
    RAISE EXCEPTION 'UNAUTHORIZED: Only super admin can unlock the system';
  END IF;
  
  -- Update lockdown status
  UPDATE admin_lockdown 
  SET 
    is_locked = FALSE,
    notes = 'Emergency unlock: ' || unlock_reason,
    locked_at = NOW(),
    locked_by = auth.uid()
  WHERE id = (SELECT id FROM admin_lockdown ORDER BY id DESC LIMIT 1);
  
  RETURN TRUE;
END;
$$ LANGUAGE plpgsql;

-- ========================================
-- VERIFICATION QUERIES
-- ========================================

-- Check current status
SELECT 
  'Current admin count:' as info,
  COUNT(*) as count 
FROM admin_roles;

SELECT 
  'Lockdown status:' as info,
  is_locked,
  max_admins,
  notes
FROM admin_lockdown 
ORDER BY id DESC 
LIMIT 1;

-- Test the lockdown function
SELECT can_create_admin() as can_add_new_admin;
SELECT * FROM get_admin_lockdown_status();