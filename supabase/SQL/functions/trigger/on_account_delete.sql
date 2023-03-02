/* Function: on_account_delete
 * Description: Deletes all data associated with a user when they are deleted
 * Parameters:
 *   NONE
 * Returns:
 *   NONE
 * Security:
 *   SECURITY DEFINER
 */
CREATE OR REPLACE FUNCTION public.on_account_delete() RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public AS $$ BEGIN
DELETE FROM public.content_response
WHERE user_id = OLD.id;

DELETE FROM public.custom_content
WHERE user_id = OLD.id;

DELETE FROM public.user_group
WHERE user_id = OLD.id;

DELETE FROM public.topic_response
WHERE user_id = OLD.id;

RETURN OLD;
END;
$$;

CREATE OR REPLACE TRIGGER on_account_delete
AFTER DELETE ON auth.users FOR each ROW EXECUTE PROCEDURE public.on_account_delete();