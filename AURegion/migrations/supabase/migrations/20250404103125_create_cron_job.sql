CREATE TYPE feature_check_result AS (
    is_within_cap BOOLEAN,
    feature_id UUID
);

DROP FUNCTION IF EXISTS check_feature_usage_cap(UUID, TEXT);

CREATE OR REPLACE FUNCTION check_feature_usage_cap(
    p_company_id UUID,
    p_feature_name TEXT
) RETURNS feature_check_result AS $$
DECLARE
    v_subscription_id UUID;
    v_feature_id UUID;
    v_feature_cap INTEGER;
    v_current_usage INTEGER;
    v_result feature_check_result;
BEGIN
    -- Get the company's subscription ID from subscription_linkable
    SELECT subscription_id INTO v_subscription_id
    FROM subscription_linkable
    WHERE linkable_type = 'company'
    AND linkable_id = p_company_id;

    IF v_subscription_id IS NULL THEN
        v_result.is_within_cap := FALSE;
        v_result.feature_id := NULL;
        RETURN v_result;
    END IF;

    -- Get the feature cap and ID from features table
    SELECT id, feature_cap INTO v_feature_id, v_feature_cap
    FROM features
    WHERE subscription_id = v_subscription_id
    AND name = p_feature_name;

    IF v_feature_cap IS NULL THEN
        v_result.is_within_cap := FALSE;
        v_result.feature_id := NULL;
        RETURN v_result;
    END IF;

    -- Count current usage
    SELECT COUNT(*) INTO v_current_usage
    FROM features_linkable
    WHERE feature_id = v_feature_id
    AND linkable_type = 'company'
    AND linkable_id = p_company_id;

    -- Set the result
    v_result.is_within_cap := v_current_usage < v_feature_cap;
    v_result.feature_id := v_feature_id;
    
    -- Return proper JSON result for better client consumption
    RETURN ROW(
        v_current_usage < v_feature_cap,
        v_feature_id
    )::feature_check_result;
    
    RETURN v_result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
