CREATE OR REPLACE FUNCTION get_booked_slots(
    p_company_id UUID,
    p_staff_id UUID,  -- NULL for all staff
    p_start_time TIMESTAMP WITH TIME ZONE
) RETURNS TABLE (
    booked_start TIMESTAMP WITH TIME ZONE,
    booked_end TIMESTAMP WITH TIME ZONE
) AS $$
    WITH input AS (
        SELECT 
            p_company_id AS company_id,
            p_staff_id AS staff_id,
            p_start_time AS start_time
    )
    SELECT 
        b.start_time AS booked_start,
        b.end_time AS booked_end
    FROM public.booking b
    WHERE b.company_id = (SELECT company_id FROM input)
    AND b.status_id IN (SELECT id FROM public.status WHERE name IN ('pending', 'confirmed'))
    AND b.start_time >= (SELECT start_time FROM input)
    AND (b.staff_id = (SELECT staff_id FROM input) OR (SELECT staff_id FROM input) IS NULL)
    ORDER BY b.start_time;
$$ LANGUAGE SQL;