-- Create a function to process active campaigns
CREATE OR REPLACE FUNCTION process_active_campaigns()
RETURNS VOID AS $$
DECLARE
    v_campaigns JSONB;
BEGIN
    -- Get all active campaigns with their company IDs
    SELECT jsonb_agg(
        jsonb_build_object(
            'campaign_id', c.id,
            'message_template', c.message_template,
            'trigger_frequency', c.trigger_frequency,
            'company_id', cl.linkable_id
        )
    ) INTO v_campaigns
    FROM campaign c
    JOIN campaign_linkable cl ON c.id = cl.campaign_id
    WHERE c.status = true
    AND cl.linkable_type = 'company';

    -- Call edge function with the array of campaigns
    PERFORM net.http_post(
        url := 'https://xzjrkgzptjqoyxxeqchy.supabase.co/functions/v1/send-booking-sms',
        headers := '{"Content-Type": "application/json"}',
        body := json_build_object(
            'campaigns', COALESCE(v_campaigns, '[]'::jsonb)
        )::text
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
