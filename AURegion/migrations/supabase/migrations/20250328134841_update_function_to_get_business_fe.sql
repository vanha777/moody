CREATE OR REPLACE FUNCTION public.get_company_details_by_identifier(
    p_identifier TEXT
) RETURNS JSON AS $$
    SELECT json_build_object(
        'company', (
            SELECT json_build_object(
                'id', c.id,
                'name', c.name,
                'description', c.description,
                'currency_id', c.currency_id,
                'identifier', c.identifier,
                'timetable', (
                    SELECT json_agg(
                        json_build_object(
                            'id', t.id,
                            'company_id', t.company_id,
                            'day_of_week', t.day_of_week,
                            'start_time', t.start_time,
                            'end_time', t.end_time
                        )
                    ) FROM public.timetable t WHERE t.company_id = c.id
                ),
                'services', (
                    SELECT json_agg(
                        json_build_object(
                            'id', s.id,
                            'company_id', s.company_id,
                            'name', s.name,
                            'duration', s.duration,
                            'price', s.price
                        )
                    ) FROM public.services s WHERE s.company_id = c.id
                )
            ) FROM public.companies c WHERE c.identifier = p_identifier
        ),
        'staff', (
            SELECT json_agg(
                json_build_object(
                    'id', p.id,
                    'personal_information', (
                        SELECT json_build_object(
                            'first_name', pi.first_name,
                            'last_name', pi.last_name
                        )
                        FROM public.personal_information pi
                        WHERE pi.person_id = p.id
                    )
                )
            )
            FROM public.people p
            JOIN public.role r ON r.person_id = p.id
            JOIN public.companies c ON c.id = r.company_id
            WHERE c.identifier = p_identifier
            AND r.role_name = 'staff'
        )
    ) AS result;
$$ LANGUAGE SQL;