CREATE OR REPLACE FUNCTION check_feature_usage_cap(
    p_company_id UUID,
    p_feature_name TEXT
) RETURNS BOOLEAN AS $$
DECLARE
    v_subscription_id UUID;
    v_feature_cap INTEGER;
    v_current_usage INTEGER;
BEGIN
    -- Get the company's subscription ID
    SELECT subscription_id INTO v_subscription_id
    FROM companies
    WHERE id = p_company_id;

    IF v_subscription_id IS NULL THEN
        RETURN FALSE;
    END IF;

    -- Get the feature cap from subscription_features
    SELECT features_cap INTO v_feature_cap
    FROM subscription_features sf
    JOIN features f ON sf.feature_id = f.id
    WHERE sf.subscription_id = v_subscription_id
    AND f.name = p_feature_name;

    IF v_feature_cap IS NULL THEN
        RETURN FALSE;
    END IF;

    -- Count current usage
    SELECT COUNT(*) INTO v_current_usage
    FROM features_linkable fl
    JOIN features f ON fl.feature_id = f.id
    WHERE f.name = p_feature_name
    AND fl.linkable_type = 'company'
    AND fl.linkable_id = p_company_id;

    -- Return TRUE if current usage is less than cap, FALSE otherwise
    RETURN v_current_usage < v_feature_cap;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
