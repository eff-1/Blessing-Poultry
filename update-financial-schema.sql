-- Add status column to expenses and income tables
ALTER TABLE expenses ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'cleared';
ALTER TABLE income ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'cleared';

-- Update amount column to handle larger numbers (up to 999,999,999.99)
ALTER TABLE expenses ALTER COLUMN amount TYPE DECIMAL(12,2);
ALTER TABLE income ALTER COLUMN amount TYPE DECIMAL(12,2);

-- Create indexes for better performance on status filtering
CREATE INDEX IF NOT EXISTS idx_expenses_status ON expenses(status);
CREATE INDEX IF NOT EXISTS idx_income_status ON income(status);

-- Update existing records to have 'cleared' status
UPDATE expenses SET status = 'cleared' WHERE status IS NULL;
UPDATE income SET status = 'cleared' WHERE status IS NULL;

