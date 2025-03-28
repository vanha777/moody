CREATE OR REPLACE FUNCTION public.get_company_details_by_identifier(
    p_identifier TEXT
) RETURNS JSON AS $$
WITH company_data AS (
    SELECT c.* FROM public.companies c WHERE c.identifier = $1
)
    SELECT json_build_object(
        'company', (
            SELECT json_build_object(
                'id', c.id,
                'name', c.name,
                'description', c.description,
                'identifier', c.identifier,
                'currency', (
                    SELECT json_build_object(
                        'id', cur.id,
                        'code', cur.code,
                        'symbol', cur.symbol
                    )
                    FROM public.currency cur
                    WHERE cur.id = c.currency_id
                ),
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
                'services_by_catalogue', (
                    SELECT json_agg(
                        json_build_object(
                            'catalogue', json_build_object(
                                'id', sc.id,
                                'name', sc.name
                            ),
                            'services', (
                                SELECT json_agg(
                                    json_build_object(
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
                                )
                                FROM public.services s
                                WHERE s.catalogue_id = sc.id
                                AND s.company_id = c.id
                            )
                        )
                    )
                    FROM public.service_catalogue sc
                    WHERE EXISTS (
                        SELECT 1 
                        FROM public.services s 
                        WHERE s.catalogue_id = sc.id 
                        AND s.company_id = c.id
                    )
                )
            ) FROM company_data c
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
                    ),
                    'specialties', (
                        SELECT COALESCE(json_agg(
                            notes_data ORDER BY created_at DESC
                        ), '[]'::json)
                        FROM (
                            SELECT 
                                n.id,
                                n.text,
                                n.created_at
                            FROM public.notes n
                            WHERE n.belong_to = 'people'
                            AND n.belong_id = p.id
                        ) notes_data
                    )
                )
            )
            FROM public.people p
            JOIN public.role r ON r.person_id = p.id
            JOIN company_data c ON c.id = r.company_id
            WHERE r.role_name = 'staff'
        )
    ) AS result;
$$ LANGUAGE SQL;