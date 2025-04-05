-- Create the trigger function
CREATE OR REPLACE FUNCTION public.handle_booking_confirmation()
RETURNS TRIGGER AS $$
DECLARE
    v_campaign_exists BOOLEAN;
    v_feature_check RECORD;
    v_http_response JSONB;
BEGIN
    -- Check if there's a campaign_linkable record for this company
    SELECT EXISTS (
        SELECT 1 
        FROM campaign_linkable cl 
        WHERE cl.campaign_id = '2d19ad8b-9aea-4d37-af46-47121f1fca71'
        AND cl.linkable_type = 'company'
        AND cl.linkable_id = NEW.company_id
    ) INTO v_campaign_exists;

    -- If campaign exists, check feature usage and send HTTP request
    IF v_campaign_exists THEN
        -- Check feature usage cap
        SELECT * FROM check_feature_usage_cap(NEW.company_id, 'SMS') INTO v_feature_check;
        
        -- If feature check returns true (is_within_cap), send HTTP request
        IF v_feature_check.is_within_cap THEN
            -- Make HTTP request to edge function
            SELECT * FROM http_post(
                'https://xzjrkgzptjqoyxxeqchy.supabase.co/functions/v1/booking_confirm_sms',
                jsonb_build_object(
                    'company_id', NEW.company_id,
                    'feature_id', v_feature_check.feature_id,
                    'booking_id', NEW.id,
                    'campaign_id', '2d19ad8b-9aea-4d37-af46-47121f1fca71'
                ),
                'application/json'
            ) INTO v_http_response;
        END IF;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS trigger_booking_confirmation ON public.booking;

-- Create the trigger
CREATE TRIGGER trigger_booking_confirmation
    AFTER INSERT
    ON public.booking
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_booking_confirmation();
