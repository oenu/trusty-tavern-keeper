/* Function: on_leave_group
 * Description: Deletes all topic responses for a user when they leave a group
 * Parameters:
 *   NONE
 * Returns:
 *   NONE
 * Security:
 *   SECURITY DEFINER
 */
CREATE OR REPLACE FUNCTION public.delete_topic_responses_on_leave_group() RETURNS TRIGGER AS $$ BEGIN
DELETE FROM public.topic_response
WHERE user_id = auth.uid()
  AND group_id = OLD.group_id;
RETURN OLD;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER delete_topic_responses_on_leave_group
AFTER DELETE ON public.user_group FOR EACH ROW EXECUTE PROCEDURE public.delete_topic_responses_on_leave_group();


/* Function: delete_group_on_owner_leave
 * Description: Deletes a group when the owner leaves it
 * Parameters:
 *   NONE
 * Returns:
 *   NONE
 * Security:
 *   SECURITY DEFINER
 */
CREATE FUNCTION public.delete_group_on_owner_leave() RETURNS TRIGGER language plpgsql SECURITY DEFINER
SET search_path = public AS $$ BEGIN
DELETE FROM public.group
WHERE id = old.group_id
  AND owner = old.user_id;
DELETE FROM public.user_group
WHERE group_id = old.group_id;
RETURN old;
END;
$$;

CREATE TRIGGER on_owner_leaves_group
AFTER DELETE ON public.user_group FOR EACH ROW EXECUTE PROCEDURE public.delete_group_on_owner_leave();