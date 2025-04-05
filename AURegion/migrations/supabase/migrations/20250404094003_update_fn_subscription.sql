CREATE OR REPLACE FUNCTION check_feature_usage_cap(
    p_company_id UUID,
    p_feature_name TEXT
) RETURNS BOOLEAN AS $$
DECLARE
    v_subscription_id UUID;
    v_feature_id UUID;
    v_feature_cap INTEGER;
    v_current_usage INTEGER;
BEGIN
    -- Get the company's subscription ID from subscription_linkable
    SELECT subscription_id INTO v_subscription_id
    FROM subscription_linkable
    WHERE linkable_type = 'company'
    AND linkable_id = p_company_id;

    IF v_subscription_id IS NULL THEN
        RETURN FALSE;
    END IF;

    -- Get the feature cap and ID from features table
    SELECT id, features_cap INTO v_feature_id, v_feature_cap
    FROM features
    WHERE subscription_id = v_subscription_id
    AND name = p_feature_name;

    IF v_feature_cap IS NULL THEN
        RETURN FALSE;
    END IF;

    -- Count current usage
    SELECT COUNT(*) INTO v_current_usage
    FROM features_linkable
    WHERE feature_id = v_feature_id
    AND linkable_type = 'company'
    AND linkable_id = p_company_id;

    -- Return TRUE if current usage is less than cap, FALSE otherwise
    RETURN v_current_usage < v_feature_cap;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
