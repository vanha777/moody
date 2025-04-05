-- Drop existing function first
DROP FUNCTION IF EXISTS public.create_or_update_customer(TEXT, UUID, TEXT, TEXT, DATE, TEXT, TEXT);
DROP FUNCTION IF EXISTS public.create_or_update_customer(TEXT, UUID, TEXT, TEXT, DATE, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT);

-- Function to create or update a person with customer role by phone number
CREATE OR REPLACE FUNCTION public.create_or_update_customer(
    p_phone_number TEXT,
    p_company_id UUID,
    p_first_name TEXT DEFAULT NULL,
    p_last_name TEXT DEFAULT NULL,
    p_date_of_birth DATE DEFAULT NULL,
    p_gender TEXT DEFAULT NULL,
    p_email TEXT DEFAULT NULL,
    -- New address parameters
    p_street TEXT DEFAULT NULL,
    p_city TEXT DEFAULT NULL,
    p_state TEXT DEFAULT NULL,
    p_postal_code TEXT DEFAULT NULL,
    p_country TEXT DEFAULT NULL,
    p_note TEXT DEFAULT NULL  -- New note parameter
) RETURNS UUID AS $$
DECLARE
    v_person_id UUID;
    v_contact_method_id UUID;
    v_role_id UUID;
    v_exists BOOLEAN;
BEGIN
    -- Check if a person with this phone number already exists
    SELECT p.id INTO v_person_id
    FROM public.people p
    JOIN public.contact_method cm ON cm.person_id = p.id
    WHERE cm.type = 'phone' AND cm.value = p_phone_number
    LIMIT 1;
    
    v_exists := v_person_id IS NOT NULL;
    
    -- If person doesn't exist, create a new one
    IF NOT v_exists THEN
        -- Insert into people table with company_id
        INSERT INTO public.people (created_at, updated_at, company_id)
        VALUES (NOW(), NOW(), p_company_id)
        RETURNING id INTO v_person_id;
        
        -- Insert phone as contact method
        INSERT INTO public.contact_method (person_id, type, value, is_primary)
        VALUES (v_person_id, 'phone', p_phone_number, TRUE)
        RETURNING id INTO v_contact_method_id;
        
        -- If email is provided, insert it as a secondary contact method
        IF p_email IS NOT NULL THEN
            INSERT INTO public.contact_method (person_id, type, value, is_primary)
            VALUES (v_person_id, 'email', p_email, FALSE);
        END IF;
        
        -- Assign customer role
        INSERT INTO public.role (person_id, company_id, role_name)
        VALUES (v_person_id, p_company_id, 'customer')
        RETURNING id INTO v_role_id;
    ELSE
        -- If email is provided and person exists, check if we need to add or update email
        IF p_email IS NOT NULL THEN
            -- Check if email contact method exists
            SELECT id INTO v_contact_method_id
            FROM public.contact_method
            WHERE person_id = v_person_id AND type = 'email'
            LIMIT 1;
            
            IF v_contact_method_id IS NULL THEN
                -- Insert new email contact method
                INSERT INTO public.contact_method (person_id, type, value, is_primary)
                VALUES (v_person_id, 'email', p_email, FALSE);
            ELSE
                -- Update existing email
                UPDATE public.contact_method
                SET value = p_email, updated_at = NOW()
                WHERE id = v_contact_method_id;
            END IF;
        END IF;
        
        -- Check if they already have the customer role for this company
        SELECT id INTO v_role_id
        FROM public.role
        WHERE person_id = v_person_id AND company_id = p_company_id AND role_name = 'customer'
        LIMIT 1;
        
        -- If they don't have the customer role, assign it
        IF v_role_id IS NULL THEN
            INSERT INTO public.role (person_id, company_id, role_name)
            VALUES (v_person_id, p_company_id, 'customer')
            RETURNING id INTO v_role_id;
        END IF;
    END IF;
    
    -- Insert or update personal information if any fields are provided
    IF p_first_name IS NOT NULL OR p_last_name IS NOT NULL OR p_date_of_birth IS NOT NULL OR p_gender IS NOT NULL THEN
        -- Check if personal information already exists
        IF EXISTS (SELECT 1 FROM public.personal_information WHERE person_id = v_person_id) THEN
            -- Update existing personal information
            UPDATE public.personal_information
            SET 
                first_name = COALESCE(p_first_name, first_name),
                last_name = COALESCE(p_last_name, last_name),
                date_of_birth = COALESCE(p_date_of_birth, date_of_birth),
                gender = COALESCE(p_gender, gender),
                updated_at = NOW()
            WHERE person_id = v_person_id;
        ELSE
            -- Insert new personal information
            INSERT INTO public.personal_information (person_id, first_name, last_name, date_of_birth, gender)
            VALUES (v_person_id, p_first_name, p_last_name, p_date_of_birth, p_gender);
        END IF;
    END IF;
    
    -- Insert or update address if address fields are provided
    IF p_street IS NOT NULL AND p_city IS NOT NULL AND p_country IS NOT NULL THEN
        -- Check if address already exists for this person
        IF EXISTS (SELECT 1 FROM public.address WHERE person_id = v_person_id) THEN
            -- Update existing address
            UPDATE public.address
            SET 
                street = p_street,
                city = p_city,
                state = p_state,
                postal_code = p_postal_code,
                country = p_country,
                updated_at = NOW()
            WHERE person_id = v_person_id;
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
                v_person_id,
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
            v_person_id,
            NOW(),
            NOW()
        );
    END IF;
    
    -- Return just the person_id on success
    RETURN v_person_id;
EXCEPTION
    WHEN OTHERS THEN
        RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Example usage
COMMENT ON FUNCTION public.create_or_update_customer IS 
'Creates or updates a customer identified by phone number.
Returns the UUID of the person if successful, NULL if there was an error.
Example:
SELECT public.create_or_update_customer(
    ''1234567890'',
    ''company-uuid'',
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
    ''First visit customer, prefers evening appointments''
);
';
