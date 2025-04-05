-- Create required extensions
CREATE EXTENSION IF NOT EXISTS http;

-- Drop existing function first
DROP FUNCTION IF EXISTS process_active_campaigns();

-- Create a function to process active campaigns
CREATE OR REPLACE FUNCTION process_active_campaigns()
RETURNS TEXT AS $$
DECLARE
    v_campaigns JSONB;
    v_response TEXT;
BEGIN
    -- Get all active campaigns with their company IDs and feature information
    SELECT jsonb_agg(
        jsonb_build_object(
            'campaign_id', c.id,
            'message_template', c.message_template,
            'trigger_frequency', c.trigger_frequency,
            'company_id', cl_company.linkable_id,
            'feature_id', f.id,
            'feature_name', f.name
        )
    ) INTO v_campaigns
    FROM campaign c
    -- First join to get company links
    JOIN campaign_linkable cl_company ON c.id = cl_company.campaign_id 
        AND cl_company.linkable_type = 'company'
    -- Then join to get feature links for the same campaign
    LEFT JOIN campaign_linkable cl_feature ON c.id = cl_feature.campaign_id 
        AND cl_feature.linkable_type = 'features'
    -- Finally join to get feature details
    LEFT JOIN features f ON cl_feature.linkable_id = f.id
    WHERE c.status = true;

    -- Call edge function with the array of campaigns and capture response
    SELECT content INTO v_response
    FROM http_post(
        'https://xzjrkgzptjqoyxxeqchy.supabase.co/functions/v1/review-sms',
        json_build_object(
            'campaigns', COALESCE(v_campaigns, '[]'::jsonb)
        )::text,
        'application/json'
    );

    RETURN v_response;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a cron job to run the function daily
SELECT cron.schedule(
    'process-active-campaigns-daily',  -- name of the cron job
    '0 0 * * *',                       -- run at midnight every day (cron syntax)
    'SELECT process_active_campaigns()'
);

-- Create extension if it doesn't exist (uncomment if needed)
-- CREATE EXTENSION IF NOT EXISTS pg_cron;