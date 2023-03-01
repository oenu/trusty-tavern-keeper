/* Function: delete_content_responses
 * Description: Deletes all content responses for a user when they are deleted
 * Parameters:
 *   NONE
 * Returns:
 *   NONE
 * Security:
 *   SECURITY DEFINER
 */
CREATE OR REPLACE FUNCTION public.delete_content_responses() RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public AS $$ BEGIN
DELETE FROM public.content_response
WHERE user_id = OLD.id;
RETURN OLD;
END;
$$;
CREATE TRIGGER delete_content_responses
AFTER DELETE ON public.user FOR EACH ROW EXECUTE PROCEDURE public.delete_content_responses();


/* Function: delete_custom_contents
 * Description: Deletes all custom contents for a user when they are deleted
 * Parameters:
 *   NONE
 * Returns:
 *   NONE
 * Security:
 *   SECURITY DEFINER
 */
CREATE OR REPLACE FUNCTION public.delete_custom_contents() RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public AS $$ BEGIN
DELETE FROM public.custom_content
WHERE user_id = OLD.id;
RETURN OLD;
END;
$$;

CREATE TRIGGER delete_custom_contents
AFTER DELETE ON public.user FOR EACH ROW EXECUTE PROCEDURE public.delete_custom_contents();


/* Function: delete group memberships
 * Description: Deletes all group memberships for a user when they are deleted
 * Parameters:
 *   NONE
 * Returns:
 *   NONE
 * Security:
 *   SECURITY DEFINER
 */
CREATE OR REPLACE FUNCTION public.delete_group_memberships() RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public AS $$ BEGIN
DELETE FROM public.user_group
WHERE user_id = OLD.id;
RETURN OLD;
END;


/* Function: delete_topic_responses
 * Description: Deletes all topic responses for a user when they are deleted
 * Parameters:
 *   NONE
 * Returns:
 *   NONE
 * Security:
 *   SECURITY DEFINER
 */
CREATE OR REPLACE FUNCTION public.delete_topic_responses() RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public AS $$ BEGIN
DELETE FROM public.topic_response
WHERE user_id = OLD.id;
RETURN OLD;
END;