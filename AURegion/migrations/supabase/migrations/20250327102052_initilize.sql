-- Filename: 20250327_123456_create_booking_system.sql

-- Create the public schema
CREATE SCHEMA IF NOT EXISTS public;

-- Create the UUID extension in the public schema (this is the recommended approach)
DROP EXTENSION IF EXISTS "uuid-ossp";
CREATE EXTENSION "uuid-ossp" WITH SCHEMA public;

-- Set the search path to include both public and public schemas
SET search_path TO public;

-- Sub-table: currency (standalone table for currency codes)
CREATE TABLE public.currency (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code VARCHAR(3) UNIQUE NOT NULL CHECK (code ~ '^[A-Z]{3}$'), -- ISO 4217 currency code (e.g., USD, EUR)
    name VARCHAR(100) NOT NULL, -- e.g., United States Dollar, Euro
    symbol VARCHAR(10), -- e.g., $, €
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Main table: companies
CREATE TABLE public.companies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    currency_id UUID REFERENCES public.currency(id) NOT NULL, -- Each company has one currency
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Main table: people (can belong to a company)
CREATE TABLE public.people (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID REFERENCES public.companies(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Sub-table: address (linked to companies or people)
CREATE TABLE public.address (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID REFERENCES public.companies(id) ON DELETE CASCADE,
    person_id UUID REFERENCES public.people(id) ON DELETE CASCADE,
    street VARCHAR(255) NOT NULL,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100),
    postal_code VARCHAR(20),
    country VARCHAR(100) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT single_owner CHECK (company_id IS NOT NULL OR person_id IS NOT NULL),
    CONSTRAINT unique_owner CHECK ((company_id IS NULL) != (person_id IS NULL))
);

-- Sub-table: personal_information (linked to people)
CREATE TABLE public.personal_information (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    person_id UUID UNIQUE REFERENCES public.people(id) ON DELETE CASCADE,
    date_of_birth DATE,
    gender VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Sub-table: contact_method (linked to companies or people)
CREATE TABLE public.contact_method (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID REFERENCES public.companies(id) ON DELETE CASCADE,
    person_id UUID REFERENCES public.people(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL CHECK (type IN ('email', 'phone', 'other')),
    value VARCHAR(255) NOT NULL,
    is_primary BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT single_owner CHECK (company_id IS NOT NULL OR person_id IS NOT NULL),
    CONSTRAINT unique_owner CHECK ((company_id IS NULL) != (person_id IS NULL))
);

-- Sub-table: login (linked to people)
CREATE TABLE public.login (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    person_id UUID UNIQUE REFERENCES public.people(id) ON DELETE CASCADE,
    username VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    last_login TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Sub-table: role (linked to people within a company, allows multiple roles per person per company)
CREATE TABLE public.role (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    person_id UUID REFERENCES public.people(id) ON DELETE CASCADE,
    company_id UUID REFERENCES public.companies(id) ON DELETE CASCADE,
    role_name VARCHAR(50) NOT NULL CHECK (role_name IN ('owner', 'staff', 'customer', 'admin')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    -- Removed CONSTRAINT unique_role_per_person_company to allow multiple roles
);

-- Sub-table: services (linked to companies)
CREATE TABLE public.services (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID REFERENCES public.companies(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    duration INTERVAL NOT NULL,
    price DECIMAL(10,2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Sub-table: timetable (linked to companies)
CREATE TABLE public.timetable (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID REFERENCES public.companies(id) ON DELETE CASCADE,
    day_of_week INTEGER NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6),
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    CHECK (end_time > start_time),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Sub-table: status (for tracking booking states)
CREATE TABLE public.status (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(50) UNIQUE NOT NULL CHECK (name IN ('pending', 'confirmed', 'cancelled', 'completed')),
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default status values (moved up)
INSERT INTO public.status (name, description) VALUES
    ('pending', 'Booking is awaiting confirmation'),
    ('confirmed', 'Booking is confirmed'),
    ('cancelled', 'Booking has been cancelled'),
    ('completed', 'Booking has been completed');

-- Function to get pending status ID
CREATE OR REPLACE FUNCTION public.get_pending_status_id() 
RETURNS UUID AS $$
BEGIN
    RETURN (SELECT id FROM public.status WHERE name = 'pending');
END;
$$ LANGUAGE plpgsql;

-- Sub-table: booking (linked to companies and people)
CREATE TABLE public.booking (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_id UUID REFERENCES public.people(id) ON DELETE SET NULL,
    staff_id UUID REFERENCES public.people(id) ON DELETE SET NULL,
    service_id UUID REFERENCES public.services(id) ON DELETE CASCADE,
    company_id UUID REFERENCES public.companies(id) ON DELETE CASCADE,
    start_time TIMESTAMP WITH TIME ZONE NOT NULL,
    end_time TIMESTAMP WITH TIME ZONE NOT NULL,
    status_id UUID REFERENCES public.status(id) DEFAULT public.get_pending_status_id(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CHECK (end_time > start_time),
    CHECK (customer_id != staff_id)
);

-- Indexes for performance
CREATE INDEX idx_booking_company_time ON public.booking(company_id, start_time, end_time);
CREATE INDEX idx_booking_staff_time ON public.booking(staff_id, start_time, end_time);

-- Function to check staff availability and assign staff
CREATE OR REPLACE FUNCTION public.check_and_assign_staff()
RETURNS TRIGGER AS $$
DECLARE
    available_staff RECORD;
BEGIN
    SELECT p.id INTO available_staff
    FROM public.people p
    JOIN public.role r ON p.id = r.person_id
    WHERE r.company_id = NEW.company_id
    AND r.role_name = 'staff'
    AND NOT EXISTS (
        SELECT 1
        FROM public.booking b
        WHERE b.staff_id = p.id
        AND b.status_id IN (SELECT id FROM public.status WHERE name IN ('pending', 'confirmed'))
        AND tsrange(b.start_time, b.end_time) && tsrange(NEW.start_time, NEW.end_time)
    )
    LIMIT 1;

    IF available_staff IS NULL THEN
        RAISE EXCEPTION 'No staff available for this time slot';
    END IF;

    NEW.staff_id := available_staff.id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to enforce staff availability
CREATE TRIGGER trigger_check_and_assign_staff
BEFORE INSERT OR UPDATE ON public.booking
FOR EACH ROW EXECUTE FUNCTION public.check_and_assign_staff();

-- Enable RLS
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.people ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.address ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.personal_information ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_method ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.login ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.role ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.timetable ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.status ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.booking ENABLE ROW LEVEL SECURITY;

-- Insert default currency values
INSERT INTO public.currency (code, name, symbol) VALUES
    ('USD', 'United States Dollar', '$'),
    ('EUR', 'Euro', '€'),
    ('VND', 'Vietnamese Dong', '₫'),
    ('AUD', 'Australian Dollar', 'A$'),
    ('GBP', 'British Pound', '£');

-- Insert default status values
-- INSERT INTO public.status (name, description) VALUES
--     ('pending', 'Booking is awaiting confirmation'),
--     ('confirmed', 'Booking is confirmed'),
--     ('cancelled', 'Booking has been cancelled'),
--     ('completed', 'Booking has been completed');