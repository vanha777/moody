-- Create payments table
CREATE TABLE public.payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    amount DECIMAL(10,2) NOT NULL,
    currency_id UUID REFERENCES public.currency(id) NOT NULL,
    payment_method VARCHAR(50) NULL,
    person_id UUID REFERENCES public.people(id) NOT NULL,
    company_id UUID REFERENCES public.companies(id) NOT NULL,
    status VARCHAR(20) DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create payment_linkable table for polymorphic relationships
CREATE TABLE public.payment_linkable (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    payment_id UUID REFERENCES public.payments(id) ON DELETE CASCADE,
    linkable_id UUID NOT NULL,
    linkable_type VARCHAR(50) NOT NULL, -- e.g., 'booking', 'service', etc.
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    -- Create a unique constraint to prevent duplicate links
    UNIQUE(payment_id, linkable_id, linkable_type)
);

-- Create index for faster lookups
CREATE INDEX idx_payment_linkable_lookup ON public.payment_linkable(linkable_type, linkable_id);