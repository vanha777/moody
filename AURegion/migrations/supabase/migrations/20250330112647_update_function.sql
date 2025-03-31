-- Function to query booking by id and company_id with all related data
CREATE OR REPLACE FUNCTION public.get_booking_details(
    p_booking_id UUID,
    p_company_id UUID
) RETURNS JSON AS $$
DECLARE
    v_result JSON;
BEGIN
    SELECT json_build_object(
        'booking', (
            SELECT json_build_object(
                'id', b.id,
                'customer', (
                    SELECT json_build_object(
                        'id', p.id,
                        'personal_information', (
                            SELECT json_build_object(
                                'first_name', pi.first_name,
                                'last_name', pi.last_name,
                                'date_of_birth', pi.date_of_birth,
                                'gender', pi.gender
                            )
                            FROM public.personal_information pi
                            WHERE pi.person_id = p.id
                        ),
                        'notes', (
                            SELECT n.text
                            FROM public.notes n
                            WHERE n.belong_to = 'people'
                            AND n.belong_id = p.id
                            ORDER BY n.created_at DESC
                            LIMIT 1
                        ),
                        'profile_image', (
                            SELECT json_build_object(
                                'id', m.id,
                                'type', m.type,
                                'path', m.path
                            )
                            FROM public.media m
                            WHERE m.belong_to = 'people'
                            AND m.belong_id = p.id
                            AND m.type = 'profile'
                            ORDER BY m.created_at DESC
                            LIMIT 1
                        ),
                        'contact_method', (
                            SELECT json_agg(
                                json_build_object(
                                    'id', cm.id,
                                    'type', cm.type,
                                    'value', cm.value,
                                    'is_primary', cm.is_primary
                                )
                            )
                            FROM public.contact_method cm
                            WHERE cm.person_id = p.id
                        )
                    )
                    FROM public.people p
                    WHERE p.id = b.customer_id
                ),
                'staff', (
                    SELECT json_build_object(
                        'id', p.id,
                        'personal_information', (
                            SELECT json_build_object(
                                'first_name', pi.first_name,
                                'last_name', pi.last_name,
                                'date_of_birth', pi.date_of_birth,
                                'gender', pi.gender
                            )
                            FROM public.personal_information pi
                            WHERE pi.person_id = p.id
                        ),
                        'profile_image', (
                            SELECT json_build_object(
                                'id', m.id,
                                'type', m.type,
                                'path', m.path
                            )
                            FROM public.media m
                            WHERE m.belong_to = 'people'
                            AND m.belong_id = p.id
                            AND m.type = 'profile'
                            ORDER BY m.created_at DESC
                            LIMIT 1
                        ),
                        'contact_method', (
                            SELECT json_agg(
                                json_build_object(
                                    'id', cm.id,
                                    'type', cm.type,
                                    'value', cm.value,
                                    'is_primary', cm.is_primary
                                )
                            )
                            FROM public.contact_method cm
                            WHERE cm.person_id = p.id
                        )
                    )
                    FROM public.people p
                    WHERE p.id = b.staff_id
                ),
                'service', (
                    SELECT json_build_object(
                        'id', s.id,
                        'name', s.name,
                        'description', (
                            SELECT n.text
                            FROM public.notes n
                            WHERE n.belong_to = 'services'
                            AND n.belong_id = s.id
                            ORDER BY n.created_at DESC
                            LIMIT 1
                        ),
                        'duration', s.duration,
                        'price', s.price
                    )
                    FROM public.services s
                    WHERE s.id = b.service_id
                ),
                'status', (
                    SELECT row_to_json(bs)
                    FROM public.status bs
                    WHERE bs.id = b.status_id
                ),
                'start_time', b.start_time,
                'end_time', b.end_time,
                'company', (
                    SELECT json_build_object(
                        'id', c.id,
                        'name', c.name,
                        'identifier', c.identifier,
                        'currency', (
                            SELECT json_build_object(
                                'id', cur.id,
                                'code', cur.code,
                                'symbol', cur.symbol
                            )
                            FROM public.currency cur
                            WHERE cur.id = c.currency_id
                        )
                    )
                    FROM public.companies c
                    WHERE c.id = b.company_id
                )
            )
            FROM public.booking b
            WHERE b.id = p_booking_id AND b.company_id = p_company_id
        )
    ) INTO v_result;

    RETURN v_result;
END;
$$ LANGUAGE plpgsql;
