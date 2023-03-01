DROP FUNCTION IF EXISTS public.get_group_content_responses;

-- CREATE TABLE public.content_response (
--   user_id uuid REFERENCES public.user ON DELETE CASCADE NOT NULL,
--   -- User ID
--   content_id INTEGER REFERENCES public.content ON DELETE CASCADE NOT NULL,
--   -- Content ID
--   intensity ContentIntensity NOT NULL,
--   -- Intensity of the content ('Neutral', 'Warning', 'Ban')
--   PRIMARY KEY (user_id, content_id) -- Primary key
-- );
-- CREATE TABLE public.content (
--   id SERIAL PRIMARY KEY,
--   -- Content ID
--   name TEXT NOT NULL,
--   -- Content name
--   category ContentCategory NOT NULL,
--   -- Content category (Physical', 'Objects', 'Social', 'Animals', 'Death', 'Supernatural', 'Other')
--   emoji TEXT,
--   -- Emoji that is displayed next to the content
--   default_intensity ContentIntensity NOT NULL,
--   -- Default intensity of the content ('Neutral', 'Warning', 'Ban')
--   description TEXT NOT NULL -- Content description (used to explain the content to the user)
-- );
/* get_group_content_responses
 This function will be used to get the content responses for a group. (will anonymize responses)
 */
CREATE OR REPLACE FUNCTION public.get_group_content_responses(req_group_id INTEGER) RETURNS TABLE (
    id INTEGER,
    -- Content ID
    name TEXT,
    -- Content name
    description TEXT,
    -- Content description
    intensity ContentIntensity,
    -- Intensity of the content ('Neutral', 'Warning', 'Ban') returns the highest intensity of the content
    category ContentCategory -- Content category (Physical', 'Objects', 'Social', 'Animals', 'Death', 'Supernatural', 'Other')
  ) LANGUAGE plpgsql SECURITY DEFINER AS $$ BEGIN RETURN QUERY
SELECT c.id,
  c.name,
  c.description,
  MAX(cr.intensity) AS intensity,
  c.category
FROM public.content_response cr
  JOIN public.content c ON cr.content_id = c.id
WHERE cr.user_id IN (
    SELECT user_id
    FROM public.user_group
    WHERE group_id = req_group_id
  )
GROUP BY c.id;
END;
$$;