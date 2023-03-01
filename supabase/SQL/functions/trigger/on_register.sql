CREATE FUNCTION public.handle_new_user() RETURNS TRIGGER language plpgsql SECURITY DEFINER
SET search_path = public AS $$ BEGIN
INSERT INTO public.user (id, full_name, name, discord_id, profile_picture)
VALUES (
    new.id,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'name',
    new.raw_user_meta_data->>'provider_id',
    new.raw_user_meta_data->>'avatar_url'
  );
RETURN new;
END;
$$;
CREATE TRIGGER on_auth_user_created
AFTER
INSERT ON auth.users FOR each ROW EXECUTE PROCEDURE public.handle_new_user();


CREATE OR REPLACE FUNCTION public.add_default_content_responses() RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public AS $$ BEGIN
INSERT INTO public.content_response (user_id, content_id, intensity)
SELECT NEW.id,
  content.id,
  content.default_intensity
FROM public.content content;

    RETURN NEW;
END;
$$;

CREATE TRIGGER add_default_content_responses
AFTER
INSERT ON public.user FOR EACH ROW EXECUTE PROCEDURE public.add_default_content_responses();