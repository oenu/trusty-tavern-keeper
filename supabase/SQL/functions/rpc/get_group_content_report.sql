-- //HACK - Do not remove this note until the function is finalized and the drop statement is removed
DROP FUNCTION IF EXISTS public.get_group_content_report(req_group_id INTEGER);

CREATE OR REPLACE FUNCTION public.get_group_content_report(req_group_id INTEGER) RETURNS TABLE (
    id INTEGER,
    -- Content ID
    name TEXT,
    -- Content name
    description TEXT,
    -- Content description
    intensity ContentIntensity,
    -- Intensity of the content ('Neutral', 'Warning', 'Ban') returns the highest intensity of the content
    category ContentCategory,
    -- Content category (Physical', 'Objects', 'Social', 'Animals', 'Death', 'Supernatural', 'Other')
    emoji TEXT,
    -- Emoji that is displayed next to the content
    default_intensity ContentIntensity -- Default intensity of the content ('Neutral', 'Warning', 'Ban')
  ) LANGUAGE plpgsql SECURITY DEFINER AS $$ BEGIN RETURN QUERY
SELECT c.id,
  c.name,
  c.description,
  MAX(cr.intensity) AS intensity,
  c.category,
  c.emoji,
  c.default_intensity
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


-- Test
SELECT *
FROM public.get_group_content_report(1);