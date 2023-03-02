/* Function: get_group_members
 * Description: Gets all users in a group
 * Parameters:
 *   req_id INTEGER: The group id
 * Returns:
 *   full_name TEXT: The user's full name
 *   name TEXT: The user's name
 *   discord_id TEXT: The user's discord id
 *   profile_picture TEXT: The user's profile picture
 *   is_owner BOOLEAN: True if the user is the group owner
 *   topics_submitted BOOLEAN: True if the user has submitted topics
 * Security:
 *   SECURITY DEFINER
 */
CREATE OR REPLACE FUNCTION public.get_group_members(req_id INTEGER) RETURNS TABLE (
    full_name TEXT,
    name TEXT,
    discord_id TEXT,
    profile_picture TEXT,
    is_owner BOOLEAN,
    topics_submitted BOOLEAN
  ) SECURITY DEFINER
SET search_path = public AS $$ BEGIN IF NOT EXISTS (
    SELECT *
    FROM public.user_group
    WHERE group_id = req_id
      AND user_id = auth.uid()
  ) THEN RAISE EXCEPTION 'User is not a member of the group';
END IF;
RETURN QUERY
SELECT u.full_name,
  u.name,
  u.discord_id,
  u.profile_picture,
  g.owner = u.id,
  ug.topics_submitted
FROM public.user_group ug
  INNER JOIN public.user u ON ug.user_id = u.id
  INNER JOIN public.group g ON ug.group_id = g.id
WHERE ug.group_id = req_id;
END $$ LANGUAGE plpgsql;