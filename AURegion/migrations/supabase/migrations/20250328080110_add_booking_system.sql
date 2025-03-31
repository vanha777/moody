-- Drop the trigger first (since it depends on the function)
DROP TRIGGER IF EXISTS trigger_check_and_assign_staff ON public.booking;

-- Drop the function
DROP FUNCTION IF EXISTS public.check_and_assign_staff;

-- Add identifier column to companies table (initially nullable)
ALTER TABLE public.companies ADD COLUMN identifier VARCHAR;

-- Copy existing company names to identifier if they exist (making them unique and lowercase)
UPDATE public.companies 
SET identifier = LOWER(REGEXP_REPLACE(name, '[^a-zA-Z0-9]', '-', 'g'));

-- Now make it NOT NULL
ALTER TABLE public.companies ALTER COLUMN identifier SET NOT NULL;

-- Add unique constraint
ALTER TABLE public.companies ADD CONSTRAINT companies_identifier_unique UNIQUE (identifier);