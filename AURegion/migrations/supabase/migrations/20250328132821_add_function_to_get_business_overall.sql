CREATE OR REPLACE FUNCTION public.get_company_details_by_owner(
    p_username TEXT,
    p_password_hash TEXT
) RETURNS JSON AS $$
    WITH owner_role AS (
        SELECT l.username, l.password_hash, r.company_id
        FROM public.login l
        JOIN public.people p ON p.id = l.person_id
        JOIN public.role r ON r.person_id = p.id
        WHERE l.username = p_username
        AND l.password_hash = p_password_hash
        AND r.role_name = 'owner'
        LIMIT 1
    )
    SELECT json_build_object(
        'username', o.username,
        'password_hash', o.password_hash,
        'roles', json_build_object(
            'owner', (
                SELECT json_agg(
                    json_build_object(
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
                )
                FROM public.people p
                JOIN public.role r ON r.person_id = p.id
                WHERE r.company_id = o.company_id
                AND r.role_name = 'owner'
            ),
            'admin', (
                SELECT json_agg(
                    json_build_object(
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
                )
                FROM public.people p
                JOIN public.role r ON r.person_id = p.id
                WHERE r.company_id = o.company_id
                AND r.role_name = 'admin'
            ),
            'staff', (
                SELECT json_agg(
                    json_build_object(
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
                )
                FROM public.people p
                JOIN public.role r ON r.person_id = p.id
                WHERE r.company_id = o.company_id
                AND r.role_name = 'staff'
            ),
            'customer', (
                SELECT json_agg(
                    json_build_object(
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
                )
                FROM public.people p
                JOIN public.role r ON r.person_id = p.id
                WHERE r.company_id = o.company_id
                AND r.role_name = 'customer'
            )
        ),
        'company', (
            SELECT json_build_object(
                'id', c.id,
                'name', c.name,
                'description', c.description,
                'currency_id', c.currency_id,
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
                ),
                'contact_method', (
                    SELECT json_agg(
                        json_build_object(
                            'id', cm.id,
                            'type', cm.type,
                            'value', cm.value,
                            'is_primary', cm.is_primary
                        )
                    ) FROM public.contact_method cm WHERE cm.company_id = c.id
                )
            ) FROM public.companies c WHERE c.id = o.company_id
        ),
        'bookings', (
            SELECT json_agg(
                json_build_object(
                    'id', b.id,
                    'customer_id', b.customer_id,
                    'staff_id', b.staff_id,
                    'service_id', b.service_id,
                    'company_id', b.company_id,
                    'start_time', b.start_time,
                    'end_time', b.end_time,
                    'status_id', b.status_id
                )
            ) FROM public.booking b 
            WHERE b.company_id = o.company_id
        )
    ) AS result
    FROM owner_role o;
$$ LANGUAGE SQL;