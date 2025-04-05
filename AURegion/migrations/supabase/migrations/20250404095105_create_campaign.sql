-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create campaign table
CREATE TABLE campaign (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    trigger_frequency INTEGER NOT NULL,
    status BOOLEAN DEFAULT false,
    message_template TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create index on company_id for faster lookups
CREATE INDEX idx_campaign_company_id ON campaign(id);

-- Add RLS policies
ALTER TABLE campaign ENABLE ROW LEVEL SECURITY;

-- Create trigger to update updated_at timestamp
CREATE TRIGGER set_updated_at
    BEFORE UPDATE ON campaign
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();


-- Create campaign_linkable table for polymorphic associations
CREATE TABLE campaign_linkable (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    campaign_id UUID NOT NULL REFERENCES campaign(id) ON DELETE CASCADE,
    linkable_type VARCHAR(50) NOT NULL,
    linkable_id UUID NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better query performance
CREATE INDEX idx_campaign_linkable_campaign_id ON campaign_linkable(campaign_id);
CREATE INDEX idx_campaign_linkable_type_id ON campaign_linkable(linkable_type, linkable_id);

-- Enable RLS
ALTER TABLE campaign_linkable ENABLE ROW LEVEL SECURITY;


-- Create trigger to update updated_at timestamp
CREATE TRIGGER set_updated_at
    BEFORE UPDATE ON campaign_linkable
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column(); 

