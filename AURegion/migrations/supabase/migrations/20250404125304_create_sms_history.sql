-- Create SMS history table
CREATE TABLE IF NOT EXISTS public.feature_usage_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    recipient_id UUID REFERENCES people(id) ON DELETE SET NULL,
    feature_id UUID REFERENCES features(id) ON DELETE SET NULL,
    campaign_id UUID REFERENCES campaign(id) ON DELETE SET NULL,
    message_content TEXT NOT NULL,
    recipient TEXT NOT NULL,
    status BOOLEAN NOT NULL DEFAULT TRUE,
    sent_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);