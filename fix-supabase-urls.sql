-- Fix Supabase Auth Configuration URLs
-- This will update the auth configuration to use production URLs

-- Update auth configuration to use production domain
UPDATE auth.config 
SET 
  site_url = 'https://blessing-poultry.vercel.app',
  uri_allow_list = 'https://blessing-poultry.vercel.app/auth/confirm,https://blessing-poultry.vercel.app/auth/callback,https://blessing-poultry.vercel.app'
WHERE TRUE;

-- If the above doesn't work, try inserting the config
INSERT INTO auth.config (site_url, uri_allow_list) 
VALUES (
  'https://blessing-poultry.vercel.app',
  'https://blessing-poultry.vercel.app/auth/confirm,https://blessing-poultry.vercel.app/auth/callback,https://blessing-poultry.vercel.app'
)
ON CONFLICT DO UPDATE SET
  site_url = EXCLUDED.site_url,
  uri_allow_list = EXCLUDED.uri_allow_list;

-- Enable email confirmation requirement
UPDATE auth.config 
SET enable_confirmations = true
WHERE TRUE;

-- Alternative approach: Update auth settings directly
-- (This might require admin privileges)
UPDATE auth.instances 
SET 
  raw_base_config = jsonb_set(
    raw_base_config,
    '{SITE_URL}',
    '"https://blessing-poultry.vercel.app"'
  )
WHERE TRUE;

-- Force email confirmation for all new signups
UPDATE auth.instances 
SET 
  raw_base_config = jsonb_set(
    raw_base_config,
    '{DISABLE_SIGNUP}',
    'false'
  ),
  raw_base_config = jsonb_set(
    raw_base_config,
    '{ENABLE_CONFIRMATIONS}',
    'true'
  )
WHERE TRUE;