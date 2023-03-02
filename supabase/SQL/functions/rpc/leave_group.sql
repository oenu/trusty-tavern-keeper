/* Function: leave_group
 * Description: Removes a user from a group
 * Parameters:
 *   req_id INTEGER: The group id
 * Returns:
 *   TEXT: A success message
 * Security:
 *   SECURITY DEFINER
 */
CREATE OR REPLACE FUNCTION public.leave_group(req_id INTEGER) RETURNS TEXT AS $$ BEGIN -- Delete the current user and the group id from the user_group table
DELETE FROM public.user_group
WHERE user_id = auth.uid()
  AND group_id = req_id;
-- Return a success message
RETURN 'Successfully left group with id: ' || req_id::TEXT;
END;
$$ LANGUAGE plpgsql;