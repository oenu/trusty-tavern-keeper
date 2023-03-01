/* Function: join_group_with_code
 * Description: Joins a user to a group using an invite code
 * Parameters:
 *   invite TEXT: The invite code
 * Returns:
 *   INTEGER: The group id
 * Security:
 *   SECURITY DEFINER
 */
CREATE OR REPLACE FUNCTION public.join_group_with_code(invite TEXT) RETURNS INTEGER SECURITY DEFINER
SET search_path = public AS $$
DECLARE group_to_join INTEGER;
BEGIN -- Check if the invite is a number or text
IF NOT (
  invite::TEXT ~ '^[0-9]+$'
  OR invite::TEXT ~ '^[a-zA-Z]+$'
) THEN RAISE EXCEPTION 'Invalid invite code type (must be a number or text))';
END IF;

  -- Check if the invite code is valid
IF NOT EXISTS (
  SELECT *
  FROM public.group
  WHERE invite_code::TEXT = invite::TEXT
) THEN RAISE EXCEPTION 'Invalid invite code: %',
invite::TEXT;
END IF;

-- Retrieve the group id for the given invite code
SELECT id INTO group_to_join
FROM public.group
WHERE invite_code = invite::TEXT;

  -- Check if the user is already in the group
IF EXISTS (
  SELECT *
  FROM public.user_group
  WHERE group_id = group_to_join
    AND user_id = auth.uid()
) THEN RAISE EXCEPTION 'User is already in group';
END IF;
-- Insert the current user and the group id into the user_group table
INSERT INTO public.user_group (user_id, group_id)
VALUES (auth.uid(), group_to_join);


  RETURN group_to_join;
END;
$$ LANGUAGE plpgsql;