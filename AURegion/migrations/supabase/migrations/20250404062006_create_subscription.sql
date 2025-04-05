-- Create subscription table to define subscription plans
CREATE TABLE IF NOT EXISTS public.subscription (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    currency_id UUID REFERENCES public.currency(id) NOT NULL,
    billing_frequency_days INTEGER NOT NULL CHECK (billing_frequency_days > 0),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create subscription_linkable table to link subscriptions to entities
CREATE TABLE IF NOT EXISTS public.subscription_linkable (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    subscription_id UUID NOT NULL REFERENCES public.subscription(id) ON DELETE CASCADE,
    linkable_type TEXT NOT NULL,
    linkable_id UUID NOT NULL,
    status BOOLEAN NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create features table to define subscription features
CREATE TABLE IF NOT EXISTS public.features (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    subscription_id UUID NOT NULL REFERENCES public.subscription(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    feature_cap INTEGER NOT NULL CHECK (feature_cap >= 0),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create features_linkable table to link features to companies
CREATE TABLE IF NOT EXISTS public.features_linkable (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    feature_id UUID NOT NULL REFERENCES public.features(id) ON DELETE CASCADE,
    linkable_type TEXT NOT NULL,
    linkable_id UUID NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for faster lookups
CREATE INDEX IF NOT EXISTS idx_subscription_linkable_subscription_id ON public.subscription_linkable(subscription_id);
CREATE INDEX IF NOT EXISTS idx_subscription_linkable_linkable ON public.subscription_linkable(linkable_type, linkable_id);
CREATE INDEX IF NOT EXISTS idx_features_subscription_id ON public.features(subscription_id);
CREATE INDEX IF NOT EXISTS idx_features_linkable_feature_id ON public.features_linkable(feature_id);
CREATE INDEX IF NOT EXISTS idx_features_linkable_linkable ON public.features_linkable(linkable_type, linkable_id);

-- Add RLS policies
ALTER TABLE public.subscription ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscription_linkable ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.features ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.features_linkable ENABLE ROW LEVEL SECURITY;

