-- Function to get customer IDs from booking table grouped by company and creation date with frequency
CREATE OR REPLACE FUNCTION public.get_customer_bookings_by_company_and_date(
    p_company_id UUID,
    p_start_date TIMESTAMP WITH TIME ZONE DEFAULT NULL, -- 2 days ago
    p_end_date TIMESTAMP WITH TIME ZONE DEFAULT NULL --today
) RETURNS TABLE (
    customer_id UUID,
    booking_date DATE,
    booking_count BIGINT,
    phone TEXT,
    first_name TEXT,
    last_name TEXT,
    date_of_birth DATE
) AS $$
BEGIN
    RETURN QUERY
    WITH latest_bookings AS (
        SELECT 
            b.customer_id,
            DATE(b.start_time) as booking_date,
            COUNT(*) as booking_count,
            ROW_NUMBER() OVER (PARTITION BY b.customer_id ORDER BY MAX(b.start_time) DESC) as rn
        FROM public.booking b
        WHERE b.company_id = p_company_id
        AND (p_start_date IS NULL OR b.start_time >= p_start_date)
        AND (p_end_date IS NULL OR b.start_time <= p_end_date) -- Changed to include today
        AND NOT EXISTS (
            SELECT 1 
            FROM public.feature_usage_history fuh 
            WHERE fuh.recipient_id = b.customer_id 
            AND fuh.company_id = p_company_id
            AND fuh.sent_at >= p_start_date
            AND fuh.sent_at <= p_end_date
        )
        GROUP BY b.customer_id, DATE(b.start_time)
    )
    SELECT 
        lb.customer_id,
        lb.booking_date,
        lb.booking_count,
        cm.value::text as phone,
        pi.first_name::text as first_name,
        pi.last_name::text as last_name,
        pi.date_of_birth
    FROM latest_bookings lb
    LEFT JOIN public.contact_method cm ON 
        cm.person_id = lb.customer_id 
        AND cm.company_id = p_company_id 
        AND cm.type = 'phone'
    LEFT JOIN public.personal_information pi ON 
        pi.person_id = lb.customer_id
    WHERE lb.rn = 1
    ORDER BY lb.booking_date DESC, lb.booking_count DESC;
END;
$$ LANGUAGE plpgsql;