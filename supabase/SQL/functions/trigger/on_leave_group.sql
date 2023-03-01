/* Function: on_leave_group
 * Description: Deletes all data associated with users membership in a group when they leave
 * Should also handle if the owner leaves the group
 * Parameters:
 *   NONE
 * Returns:
 *   NONE
 * Security:
 *   SECURITY DEFINER
 */
CREATE OR REPLACE FUNCTION public.on_leave_group() RETURNS TRIGGER AS $$ BEGIN IF OLD.user_id = (
    SELECT owner
    FROM public.group
    WHERE id = OLD.group_id
  ) THEN -- Delete the group
DELETE FROM public.group
WHERE id = OLD.group_id;
-- Delete all user_group entries
DELETE FROM public.user_group
WHERE group_id = OLD.group_id;
-- Delete all topic_responses
DELETE FROM public.topic_response
WHERE group_id = OLD.group_id;

ELSE -- Delete all topic_responses
DELETE FROM public.topic_response
WHERE user_id = OLD.user_id
  AND group_id = OLD.group_id;
END IF;

RETURN OLD;
END;
$$ LANGUAGE plpgsql;


CREATE TRIGGER on_leave_group
AFTER DELETE ON public.user_group FOR EACH ROW EXECUTE PROCEDURE public.on_leave_group();