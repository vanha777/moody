-- Create required extensions
CREATE EXTENSION IF NOT EXISTS http;

-- Create a function to process active campaigns
CREATE OR REPLACE FUNCTION process_active_campaigns()
RETURNS VOID AS $$
DECLARE
    v_campaigns JSONB;
BEGIN
    -- Get all active campaigns with their company IDs and feature information
    SELECT jsonb_agg(
        jsonb_build_object(
            'campaign_id', c.id,
            'message_template', c.message_template,
            'trigger_frequency', c.trigger_frequency,
            'company_id', cl.linkable_id,
            'feature_id', CASE 
                WHEN cl.linkable_type = 'features' THEN f.id 
                ELSE NULL 
            END,
            'feature_name', CASE 
                WHEN cl.linkable_type = 'features' THEN f.name 
                ELSE NULL 
            END
        )
    ) INTO v_campaigns
    FROM campaign c
    JOIN campaign_linkable cl ON c.id = cl.campaign_id
    LEFT JOIN features f ON cl.linkable_id = f.id AND cl.linkable_type = 'features'
    WHERE c.status = true
    AND (cl.linkable_type = 'company' OR cl.linkable_type = 'features');

    -- Call edge function with the array of campaigns
    PERFORM http_post(
        'https://xzjrkgzptjqoyxxeqchy.supabase.co/functions/v1/send-booking-sms',
        json_build_object(
            'campaigns', COALESCE(v_campaigns, '[]'::jsonb)
        )::text,
        'application/json'
    );
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
