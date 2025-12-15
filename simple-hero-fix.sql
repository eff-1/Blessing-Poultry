-- Simple Hero Fix - Just update the active hero
UPDATE heroes 
SET 
  discount_text = '20% OFF'
WHERE is_active = true;