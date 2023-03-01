/* Function: get_group_topic_report
 * Description: Gets all topic responses for a group
 * Parameters:
 *   req_group_id INTEGER: The group id
 * Returns:
 *   topic_id INTEGER: The topic id
 *   topic_name TEXT: The topic name
 *   topic_description TEXT: The topic description
 *   fantasy_count BIGINT: The number of fantasy responses
 *   adventure_count BIGINT: The number of adventure responses
 *   struggle_count BIGINT: The number of struggle responses
 *   tragedy_count BIGINT: The number of tragedy responses
 *   fantasy_example TEXT: An example of a fantasy response
 *   adventure_example TEXT: An example of an adventure response
 *   struggle_example TEXT: An example of a struggle response
 *   tragedy_example TEXT: An example of a tragedy response
 * Security:
 *   SECURITY DEFINER
 */
CREATE OR REPLACE FUNCTION public.get_group_topic_report(req_group_id INTEGER) RETURNS TABLE (
    topic_id INTEGER,
    topic_name TEXT,
    topic_description TEXT,
    fantasy_count BIGINT,
    adventure_count BIGINT,
    struggle_count BIGINT,
    tragedy_count BIGINT,
    fantasy_example TEXT,
    adventure_example TEXT,
    struggle_example TEXT,
    tragedy_example TEXT
  ) SECURITY DEFINER
SET search_path = public,
  pg_temp AS $$ BEGIN -- Check if the user is in the group
  IF NOT EXISTS (
    SELECT *
    FROM public.user_group
    WHERE group_id = req_group_id
      AND user_id = auth.uid()
  ) THEN RAISE EXCEPTION 'User is not in group';
END IF;

  RETURN QUERY
SELECT t.id AS topic_id,
  t.name AS topic_name,
  t.description AS topic_description,
  COUNT(
    CASE
      WHEN tr.intensity = 'Fantasy' THEN 1
    END
  ) AS fantasy_count,
  COUNT(
    CASE
      WHEN tr.intensity = 'Adventure' THEN 1
    END
  ) AS adventure_count,
  COUNT(
    CASE
      WHEN tr.intensity = 'Struggle' THEN 1
    END
  ) AS struggle_count,
  COUNT(
    CASE
      WHEN tr.intensity = 'Tragedy' THEN 1
    END
  ) AS tragedy_count,
  t.fantasy_example AS fantasy_example,
  t.adventure_example AS adventure_example,
  t.struggle_example AS struggle_example,
  t.tragedy_example AS tragedy_example
FROM public.topic_response tr
  JOIN public.topic t ON tr.topic_id = t.id
WHERE tr.group_id = req_group_id
GROUP BY t.id
HAVING COUNT(*) >= 2;
END;
$$ LANGUAGE plpgsql;