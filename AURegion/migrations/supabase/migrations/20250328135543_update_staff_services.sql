-- Create notes table to store notes for various entities
CREATE TABLE IF NOT EXISTS public.notes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    text TEXT NOT NULL,
    belong_to VARCHAR NOT NULL,
    belong_id UUID NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Add index to improve query performance when searching by belong_to and belong_id
CREATE INDEX IF NOT EXISTS idx_notes_belong_to_belong_id ON public.notes(belong_to, belong_id);

-- Add comment to explain the purpose of the table
COMMENT ON TABLE public.notes IS 'Stores notes that can be linked to any entity in the system';
COMMENT ON COLUMN public.notes.belong_to IS 'Indicates which table this note is linked to (e.g., "companies", "people", "booking")';
COMMENT ON COLUMN public.notes.belong_id IS 'The UUID of the record in the table specified by belong_to';

-- Create service_catalogue table
CREATE TABLE IF NOT EXISTS public.service_catalogue (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Add catalogue_id to services table
ALTER TABLE public.services 
ADD COLUMN catalogue_id UUID REFERENCES public.service_catalogue(id);

-- Add index for the foreign key
CREATE INDEX IF NOT EXISTS idx_services_catalogue_id ON public.services(catalogue_id);

-- Add comment to explain the tables
COMMENT ON TABLE public.service_catalogue IS 'Stores categories/collections of services';
COMMENT ON COLUMN public.services.catalogue_id IS 'References the catalogue this service belongs to';

