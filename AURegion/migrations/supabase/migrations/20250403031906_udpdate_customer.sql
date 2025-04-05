-- Drop existing function first
DROP FUNCTION IF EXISTS public.create_or_update_customer(TEXT, UUID, TEXT, TEXT, DATE, TEXT, TEXT);
DROP FUNCTION IF EXISTS public.create_or_update_customer(TEXT, UUID, TEXT, TEXT, DATE, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT);

-- Function to update a person's information by their ID
CREATE OR REPLACE FUNCTION public.update_person_by_id(
    p_person_id UUID,
    p_first_name TEXT DEFAULT NULL,
    p_last_name TEXT DEFAULT NULL,
    p_date_of_birth DATE DEFAULT NULL,
    p_gender TEXT DEFAULT NULL,
    p_email TEXT DEFAULT NULL,
    p_street TEXT DEFAULT NULL,
    p_city TEXT DEFAULT NULL,
    p_state TEXT DEFAULT NULL,
    p_postal_code TEXT DEFAULT NULL,
    p_country TEXT DEFAULT NULL,
    p_note TEXT DEFAULT NULL
) RETURNS UUID AS $$
DECLARE
    v_contact_method_id UUID;
BEGIN
    -- Update personal information if any fields are provided
    IF p_first_name IS NOT NULL OR p_last_name IS NOT NULL OR p_date_of_birth IS NOT NULL OR p_gender IS NOT NULL THEN
        -- Check if personal information exists
        IF EXISTS (SELECT 1 FROM public.personal_information WHERE person_id = p_person_id) THEN
            -- Update existing personal information
            UPDATE public.personal_information
            SET 
                first_name = COALESCE(p_first_name, first_name),
                last_name = COALESCE(p_last_name, last_name),
                date_of_birth = COALESCE(p_date_of_birth, date_of_birth),
                gender = COALESCE(p_gender, gender),
                updated_at = NOW()
            WHERE person_id = p_person_id;
        ELSE
            -- Insert new personal information
            INSERT INTO public.personal_information (person_id, first_name, last_name, date_of_birth, gender)
            VALUES (p_person_id, p_first_name, p_last_name, p_date_of_birth, p_gender);
        END IF;
    END IF;
    
    -- Update email if provided
    IF p_email IS NOT NULL THEN
        -- Check if email contact method exists
        SELECT id INTO v_contact_method_id
        FROM public.contact_method
        WHERE person_id = p_person_id AND type = 'email'
        LIMIT 1;
        
        IF v_contact_method_id IS NULL THEN
            -- Insert new email contact method
            INSERT INTO public.contact_method (person_id, type, value, is_primary)
            VALUES (p_person_id, 'email', p_email, FALSE);
        ELSE
            -- Update existing email
            UPDATE public.contact_method
            SET value = p_email, updated_at = NOW()
            WHERE id = v_contact_method_id;
        END IF;
    END IF;
    
    -- Update address if address fields are provided
    IF p_street IS NOT NULL AND p_city IS NOT NULL AND p_country IS NOT NULL THEN
        -- Check if address exists for this person
        IF EXISTS (SELECT 1 FROM public.address WHERE person_id = p_person_id) THEN
            -- Update existing address
            UPDATE public.address
            SET 
                street = p_street,
                city = p_city,
                state = p_state,
                postal_code = p_postal_code,
                country = p_country,
                updated_at = NOW()
            WHERE person_id = p_person_id;
        ELSE
            -- Insert new address
            INSERT INTO public.address (
                person_id,
                street,
                city,
                state,
                postal_code,
                country
            ) VALUES (
                p_person_id,
                p_street,
                p_city,
                p_state,
                p_postal_code,
                p_country
            );
        END IF;
    END IF;
    
    -- Insert note if provided
    IF p_note IS NOT NULL THEN
        INSERT INTO public.notes (
            text,
            belong_to,
            belong_id,
            created_at,
            updated_at
        ) VALUES (
            p_note,
            'people',
            p_person_id,
            NOW(),
            NOW()
        );
    END IF;
    
    -- Return the person_id on success
    RETURN p_person_id;
EXCEPTION
    WHEN OTHERS THEN
        RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Example usage
COMMENT ON FUNCTION public.update_person_by_id IS 
'Updates a person''s information by their ID.
Returns the UUID of the person if successful, NULL if there was an error.
Example:
SELECT public.update_person_by_id(
    ''person-uuid'',
    ''John'',
    ''Doe'',
    ''1990-01-01'',
    ''male'',
    ''john.doe@example.com'',
    ''123 Main St'',
    ''New York'',
    ''NY'',
    ''10001'',
    ''USA'',
    ''Updated contact information''
);
';
