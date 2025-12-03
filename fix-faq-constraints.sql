-- Fix FAQ table constraints to support new categories
-- Run this in Supabase SQL Editor

-- Drop the existing check constraint on category
ALTER TABLE faqs 
DROP CONSTRAINT IF EXISTS faqs_category_check;

-- Add updated check constraint with all categories
ALTER TABLE faqs 
ADD CONSTRAINT faqs_category_check 
CHECK (category IN ('general', 'application', 'visa', 'studying', 'costs', 'accommodation', 'test_preparation'));

-- Verify the constraint was added
SELECT 
    conname as constraint_name,
    pg_get_constraintdef(oid) as constraint_definition
FROM pg_constraint 
WHERE conrelid = 'faqs'::regclass 
AND conname = 'faqs_category_check';
