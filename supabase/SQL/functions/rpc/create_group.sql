/* Function: create_group
 * Description: Creates a new group
 * Parameters:
 *   name TEXT: The group name
 *   intensity TEXT: The group intensity
 * Returns:
 *   INTEGER: The group id
 * Security:
 *   SECURITY DEFINER
 */
CREATE OR REPLACE FUNCTION public.create_group(name TEXT, intensity TEXT) RETURNS INTEGER AS $$
DECLARE invite TEXT;
BEGIN -- Check if the user already owns 10 groups
IF (
  SELECT COUNT(*)
  FROM public.group
  WHERE owner = auth.uid()
) >= 10 THEN RAISE EXCEPTION 'Maximum number of groups reached (10)';
END IF;
-- Generate a random invite code
invite := md5(random()::text);
-- Remove the '-', 
invite := REPLACE(invite, '-', '');
-- and take the first 6 characters
invite := substring(invite, 1, 6);

  -- check if the invite code is already in use (should be very unlikely)
WHILE EXISTS (
  SELECT 1
  FROM public.group
  WHERE invite_code = invite
) LOOP -- If it is, generate a new invite code
invite := md5(random()::text);
invite := REPLACE(invite, '-', '');
invite := substring(invite, 1, 6);
END LOOP;
-- Insert the group into the groups table
INSERT INTO public.group (name, invite_code, initial_intensity, owner)
VALUES (
    name,
    invite,
    intensity::TopicIntensity,
    auth.uid()
  );

 -- Insert the owner into the user_group table
INSERT INTO public.user_group (user_id, group_id)
VALUES (auth.uid(), currval('group_id_seq'));
-- Return the group id
RETURN currval('group_id_seq');
END;
$$ LANGUAGE plpgsql;