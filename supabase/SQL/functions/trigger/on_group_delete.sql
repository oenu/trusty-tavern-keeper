/* Function: on_group_delete
 * Description: Deletes all group memberships for a group when it is deleted
 * Parameters:
 *   NONE
 * Returns:
 *   NONE
 * Security:
 *   SECURITY DEFINER
 */
CREATE FUNCTION public.on_group_delete() RETURNS TRIGGER language plpgsql SECURITY DEFINER
SET search_path = public AS $$ BEGIN -- Delete all rows from the user_group table that have the group id of the deleted group
DELETE FROM public.user_group
WHERE group_id = old.id;
RETURN old;
END;
$$;

CREATE TRIGGER on_group_deleted
AFTER DELETE ON public.group FOR EACH ROW EXECUTE PROCEDURE public.on_group_delete();