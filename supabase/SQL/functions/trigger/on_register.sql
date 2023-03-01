/* Function: on_register
 * Description: Adds a new user to the user table when they register, and adds default content responses
 * Parameters:
 *   NONE
 * Returns:
 *   NONE
 * Security:
 *   SECURITY DEFINER
 */
CREATE OR REPLACE FUNCTION public.on_register() RETURNS TRIGGER language plpgsql SECURITY DEFINER
SET search_path = public AS $$ BEGIN -- Insert the user into the user table
INSERT INTO public.user (
    id,
    full_name,
    name,
    discord_id,
    profile_picture
  )
VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'name',
    NEW.raw_user_meta_data->>'provider_id',
    NEW.raw_user_meta_data->>'avatar_url'
  );

-- Insert default content responses
INSERT INTO public.content_response (user_id, content_id, intensity)
SELECT NEW.id,
  content.id,
  content.default_intensity
FROM public.content content;
RETURN NEW;
END;
$$;

CREATE TRIGGER on_register
AFTER
INSERT ON auth.users FOR each ROW EXECUTE PROCEDURE public.on_register();