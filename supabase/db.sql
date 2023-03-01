CREATE TYPE ContentIntensity AS ENUM ('Neutral', 'Warning', 'Ban');
-- As ban is the last option, it will be the value returned by "max" when comparing two content intensities
CREATE TYPE TopicIntensity AS ENUM ('Fantasy', 'Adventure', 'Struggle', 'Tragedy');
CREATE TYPE ContentCategory AS ENUM (
  'Physical',
  'Objects',
  'Social',
  'Animals',
  'Death',
  'Supernatural',
  'Other'
);CREATE TABLE public.user (
  id uuid REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  -- User ID
  discord_id TEXT NOT NULL,
  -- Discord ID
  profile_picture TEXT NOT NULL,
  -- URL to the profile picture
  name TEXT NOT NULL,
  -- Name + discriminator
  full_name TEXT NOT NULL,
  -- Name that is displayed on the profile
  content_version INT NOT NULL DEFAULT 0,
  -- Version of the content that the user has seen (used to determine if the user has seen the latest content)
  PRIMARY KEY (id)
);
ALTER TABLE public.user ENABLE ROW LEVEL SECURITY;



-- User Policies
CREATE POLICY "Users can insert their own profile." ON public.user FOR
INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users are viewable by users who created them." ON public.user FOR
SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile." ON public.user FOR
UPDATE USING (auth.uid() = id);/* Group table
 Groups are created by a user (owner) and can be joined by other users (members). They have a maximum intensity level that is set by the owner when the group is created.
 Users will answer questions about their contents and topics. The answers will be used to determine the intensity of the group / which specific contents and topics are allowed in the group. (Fetched via sql queries)
 */
CREATE TABLE public.group (
  id SERIAL PRIMARY KEY UNIQUE NOT NULL,
  -- Group ID
  name TEXT NOT NULL,
  -- Group name
  invite_code TEXT UNIQUE NOT NULL,
  -- Invite code
  initial_intensity TopicIntensity NOT NULL,
  -- Initial intensity of the group (used to determine the maximum intensity of the group) (Fantasy', 'Adventure', 'Struggle', 'Tragedy')
  owner uuid REFERENCES public.user ON DELETE CASCADE NOT NULL -- Owner of the group
);
ALTER TABLE public.group ENABLE ROW LEVEL SECURITY;

-- Group Policies
CREATE POLICY "Groups are viewable by users who created them." ON "group" FOR
SELECT USING (auth.uid() = owner);

CREATE POLICY "Groups can be updated by users who created them." ON "group" FOR
UPDATE USING (auth.uid() = owner);

CREATE POLICY "Groups can be deleted by users who created them." ON "group" FOR DELETE USING (auth.uid() = owner);

CREATE POLICY "Groups can be inserted by all users." ON "group" FOR
INSERT WITH CHECK (TRUE);/* topic table 
 This table will be used to store the topics that users can choose from when answering questions about their topics, a seperate table contains the responses to these questions (topic_response).
 */
CREATE TABLE public.topic (
  id SERIAL PRIMARY KEY,
  -- Topic ID
  name TEXT NOT NULL,
  -- Topic name
  description TEXT NOT NULL,
  -- Topic description (used to explain the topic to the user)
  fantasy_example TEXT NOT NULL,
  -- Example of a fantasy level roleplay interaction
  adventure_example TEXT NOT NULL,
  -- Example of an adventure level roleplay interaction
  struggle_example TEXT NOT NULL,
  -- Example of a struggle level roleplay interaction
  tragedy_example TEXT NOT NULL -- Example of a tragedy level roleplay interaction
);
ALTER TABLE public.topic ENABLE ROW LEVEL SECURITY;


-- Topic Policies
CREATE POLICY "Topics are viewable by all users." ON "topic" FOR
SELECT USING (TRUE);/* content table
 This table will be used to store the contents that users can choose from when answering questions about their contents, a seperate table contains the responses to these questions (content_response).
 */
CREATE TABLE public.content (
  id SERIAL PRIMARY KEY,
  -- Content ID
  name TEXT NOT NULL,
  -- Content name
  category ContentCategory NOT NULL,
  -- Content category (Physical', 'Objects', 'Social', 'Animals', 'Death', 'Supernatural', 'Other')
  emoji TEXT,
  -- Emoji that is displayed next to the content
  default_intensity ContentIntensity NOT NULL,
  -- Default intensity of the content ('Neutral', 'Warning', 'Ban')
  description TEXT NOT NULL -- Content description (used to explain the content to the user)
);
ALTER TABLE public.content ENABLE ROW LEVEL SECURITY;

-- Content Policies
CREATE POLICY "Contents are viewable by all users." ON "content" FOR
SELECT USING (TRUE);/* user_group table (many to many relationship between users and groups) */
CREATE TABLE public.user_group (
  user_id uuid REFERENCES public.user ON DELETE CASCADE NOT NULL,
  -- User ID
  group_id INTEGER REFERENCES public.group ON DELETE CASCADE NOT NULL,
  -- Group ID
  topics_submitted BOOLEAN NOT NULL DEFAULT FALSE,
  -- Whether the user has submitted their topics (used to determine if the user has completed the onboarding process)
  PRIMARY KEY (user_id, group_id) -- Primary key
);
ALTER TABLE public.user_group ENABLE ROW LEVEL SECURITY;

-- User_Group Policies
CREATE POLICY "Groups are viewable by users who are members of the group." ON "group" FOR
SELECT USING (
    EXISTS (
      SELECT 1
      FROM public.user_group
      WHERE user_id = auth.uid()
        AND group_id = id
    )
  );
CREATE POLICY "Users can insert themselves into a group." ON "user_group" FOR
INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete themselves from a group." ON "user_group" FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view groups they are members of." ON "user_group" FOR
SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update groups they are members of." ON "user_group" FOR
UPDATE USING (auth.uid() = user_id);/* topic_response table
 This table will be used to store the responses to the questions about the user's topics.
 */
CREATE TABLE public.topic_response (
  user_id uuid REFERENCES public.user ON DELETE CASCADE NOT NULL,
  -- User ID
  topic_id INTEGER REFERENCES public.topic ON DELETE CASCADE NOT NULL,
  -- Topic ID
  group_id INTEGER REFERENCES public.group ON DELETE CASCADE NOT NULL,
  -- Group ID (users can have different responses to the same topic in different groups)
  intensity TopicIntensity NOT NULL,
  -- Intensity of the topic ('Fantasy', 'Adventure', 'Struggle', 'Tragedy')
  PRIMARY KEY (user_id, topic_id, group_id) -- Primary key
);
ALTER TABLE public.topic_response ENABLE ROW LEVEL SECURITY;


-- Topic Response Policies
CREATE POLICY "Topic responses are viewable by users who created them." ON "topic_response" FOR
SELECT USING (auth.uid() = user_id);

CREATE POLICY "Topic responses can be updated by users who created them." ON "topic_response" FOR
UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Topic responses can be deleted by users who created them." ON "topic_response" FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Topic responses can be inserted by users who created them." ON "topic_response" FOR
INSERT WITH CHECK (auth.uid() = user_id);/* content_response table
 This table will be used to store the responses to the questions about the user's contents.
 Content responses are used across multiple groups (unlike topics), so they are stored in a seperate table.
 */
CREATE TABLE public.content_response (
  user_id uuid REFERENCES public.user ON DELETE CASCADE NOT NULL,
  -- User ID
  content_id INTEGER REFERENCES public.content ON DELETE CASCADE NOT NULL,
  -- Content ID
  intensity ContentIntensity NOT NULL,
  -- Intensity of the content ('Neutral', 'Warning', 'Ban')
  PRIMARY KEY (user_id, content_id) -- Primary key
);
ALTER TABLE public.content_response ENABLE ROW LEVEL SECURITY;

-- Content Response Policies
CREATE POLICY "Content responses are viewable by users who created them." ON "content_response" FOR
SELECT USING (auth.uid() = user_id);

CREATE POLICY "Content responses can be updated by users who created them." ON "content_response" FOR
UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Content responses can be deleted by users who created them." ON "content_response" FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Content responses can be inserted by users who created them." ON "content_response" FOR
INSERT WITH CHECK (auth.uid() = user_id);/* custom_content table 
 //TODO: Implement this
 This table will be used to store the contents that users create themselves
 */
CREATE TABLE public.custom_content (
  user_id uuid REFERENCES public.user ON DELETE CASCADE NOT NULL,
  -- User ID
  name TEXT NOT NULL,
  -- Content name
  description TEXT NOT NULL,
  -- Content description (used to explain the content to the user)
  intensity ContentIntensity NOT NULL,
  -- Default intensity of the content ('Neutral', 'Warning', 'Ban')
  PRIMARY KEY (user_id, name) -- Primary key
);
ALTER TABLE public.custom_content ENABLE ROW LEVEL SECURITY;


-- Custom Content Policies
CREATE POLICY "Custom contents are viewable by users who created them." ON "custom_content" FOR
SELECT USING (auth.uid() = user_id);

CREATE POLICY "Custom contents are editable by users who created them." ON "custom_content" FOR
UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Custom contents are deletable by users who created them." ON "custom_content" FOR DELETE USING (auth.uid() = user_id);/* Function: on_account_delete
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
$$;/* Function: on_leave_group
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
AFTER DELETE ON public.user_group FOR EACH ROW EXECUTE PROCEDURE public.on_leave_group();/* Function: on_register
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
INSERT ON auth.users FOR each ROW EXECUTE PROCEDURE public.on_register();/* Function: create_group
 * Description: Creates a new group
 * Parameters:
 *   name TEXT: The group name
 *   intensity TEXT: The group intensity
 * Returns:
 *   INTEGER: The group id
 * Security:
 *   SECURITY DEFINER
 */
CREATE OR REPLACE FUNCTION public.create_group(name TEXT, intensity TEXT) RETURNS INTEGER AS $$
DECLARE invite TEXT;
BEGIN -- Check if the user already owns 10 groups
IF (
  SELECT COUNT(*)
  FROM public.group
  WHERE owner = auth.uid()
) >= 10 THEN RAISE EXCEPTION 'Maximum number of groups reached (10)';
END IF;
-- Generate a random invite code
invite := md5(random()::text);
-- Remove the '-', 
invite := REPLACE(invite, '-', '');
-- and take the first 6 characters
invite := substring(invite, 1, 6);

  -- check if the invite code is already in use (should be very unlikely)
WHILE EXISTS (
  SELECT 1
  FROM public.group
  WHERE invite_code = invite
) LOOP -- If it is, generate a new invite code
invite := md5(random()::text);
invite := REPLACE(invite, '-', '');
invite := substring(invite, 1, 6);
END LOOP;
-- Insert the group into the groups table
INSERT INTO public.group (name, invite_code, initial_intensity, owner)
VALUES (
    name,
    invite,
    intensity::TopicIntensity,
    auth.uid()
  );

 -- Insert the owner into the user_group table
INSERT INTO public.user_group (user_id, group_id)
VALUES (auth.uid(), currval('group_id_seq'));
-- Return the group id
RETURN currval('group_id_seq');
END;
$$ LANGUAGE plpgsql;/* Function: get_group_members
 * Description: Gets all users in a group
 * Parameters:
 *   req_id INTEGER: The group id
 * Returns:
 *   full_name TEXT: The user's full name
 *   name TEXT: The user's name
 *   discord_id TEXT: The user's discord id
 *   profile_picture TEXT: The user's profile picture
 *   is_owner BOOLEAN: True if the user is the group owner
 *   topics_submitted BOOLEAN: True if the user has submitted topics
 * Security:
 *   SECURITY DEFINER
 */
CREATE OR REPLACE FUNCTION public.get_group_members(req_id INTEGER) RETURNS TABLE (
    full_name TEXT,
    name TEXT,
    discord_id TEXT,
    profile_picture TEXT,
    is_owner BOOLEAN,
    topics_submitted BOOLEAN
  ) SECURITY DEFINER
SET search_path = public AS $$ BEGIN IF NOT EXISTS (
    SELECT *
    FROM public.user_group
    WHERE group_id = req_id
      AND user_id = auth.uid()
  ) THEN RAISE EXCEPTION 'User is not a member of the group';
END IF;
RETURN QUERY
SELECT u.full_name,
  u.name,
  u.discord_id,
  u.profile_picture,
  g.owner = u.id,
  ug.topics_submitted
FROM public.user_group ug
  INNER JOIN public.user u ON ug.user_id = u.id
  INNER JOIN public.group g ON ug.group_id = g.id
WHERE ug.group_id = req_id;
END $$ LANGUAGE plpgsql;/* Function: get_group_topic_report
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
$$ LANGUAGE plpgsql;/* Function: join_group
 * Description: Joins a user to a group using an invite code
 * Parameters:
 *   invite TEXT: The invite code
 * Returns:
 *   INTEGER: The group id
 * Security:
 *   SECURITY DEFINER
 */
CREATE OR REPLACE FUNCTION public.join_group(invite TEXT) RETURNS INTEGER SECURITY DEFINER
SET search_path = public AS $$
DECLARE group_to_join INTEGER;
BEGIN -- Check if the invite is a number or text
IF NOT (
  invite::TEXT ~ '^[0-9]+$'
  OR invite::TEXT ~ '^[a-zA-Z]+$'
) THEN RAISE EXCEPTION 'Invalid invite code type (must be a number or text))';
END IF;

  -- Check if the invite code is valid
IF NOT EXISTS (
  SELECT *
  FROM public.group
  WHERE invite_code::TEXT = invite::TEXT
) THEN RAISE EXCEPTION 'Invalid invite code: %',
invite::TEXT;
END IF;

-- Retrieve the group id for the given invite code
SELECT id INTO group_to_join
FROM public.group
WHERE invite_code = invite::TEXT;

  -- Check if the user is already in the group
IF EXISTS (
  SELECT *
  FROM public.user_group
  WHERE group_id = group_to_join
    AND user_id = auth.uid()
) THEN RAISE EXCEPTION 'User is already in group';
END IF;

-- Insert the current user and the group id into the user_group table
INSERT INTO public.user_group (user_id, group_id)
VALUES (auth.uid(), group_to_join);


  RETURN group_to_join;
END;
$$ LANGUAGE plpgsql;/* Function: leave_group
 * Description: Removes a user from a group
 * Parameters:
 *   req_id INTEGER: The group id
 * Returns:
 *   TEXT: A success message
 * Security:
 *   SECURITY DEFINER
 */
CREATE OR REPLACE FUNCTION public.leave_group(req_id INTEGER) RETURNS TEXT AS $$ BEGIN -- Delete the current user and the group id from the user_group table
DELETE FROM public.user_group
WHERE user_id = auth.uid()
  AND group_id = req_id;
-- Return a success message
RETURN 'Successfully left group with id: ' || req_id::TEXT;
END;
$$ LANGUAGE plpgsql;-- name: The name of an upsetting item/behavior/topic/thing
-- description: A description of how the item might occurr in a game of dungeons and dragons
-- category: The category of the content ('Physical','Objects','Social','Animals','Death','Supernatural','Other')
-- emoji: The emoji that represents the content
-- default_intensity: The default intensity of the content `ENUM ('Neutral', 'Warning', 'Ban')`
-- Neutral: I am not opposed to the content being present in the game
-- Warning: I am not opposed to the content being present in the game if I am warned about it and given the option to opt out
-- Ban: I am opposed to the content being present in the game (this will prevent me from joining the game)
-- Physical Sensation / Body
INSERT INTO public.content (
    name,
    description,
    category,
    emoji,
    default_intensity
  )
VALUES (
    'Heights',
    'Being in a high place, or looking down from a high place.',
    'Physical',
    '🏔️',
    'Neutral'
  );
INSERT INTO public.content (
    name,
    description,
    category,
    emoji,
    default_intensity
  )
VALUES (
    'Imprisonment',
    'Being trapped, or being unable to escape.',
    'Physical',
    '🔒',
    'Neutral'
  );
INSERT INTO public.content (
    name,
    description,
    category,
    emoji,
    default_intensity
  )
VALUES (
    'Water',
    'Water, oceans, lakes, and other bodies of water.',
    'Physical',
    '🌊',
    'Neutral'
  );
INSERT INTO public.content (
    name,
    description,
    category,
    emoji,
    default_intensity
  )
VALUES (
    'Drowning',
    'Being trapped underwater, or being unable to breathe.',
    'Physical',
    '🏊',
    'Neutral'
  );
INSERT INTO public.content (
    name,
    description,
    category,
    emoji,
    default_intensity
  )
VALUES (
    'Fire',
    'Fire, flames, and other things that burn.',
    'Physical',
    '🔥',
    'Neutral'
  );
INSERT INTO public.content (
    name,
    description,
    category,
    emoji,
    default_intensity
  )
VALUES (
    'Darkness',
    'Darkness, shadows, and other things that are hard to see in.',
    'Physical',
    '🌑',
    'Neutral'
  );
INSERT INTO public.content (
    name,
    description,
    category,
    emoji,
    default_intensity
  )
VALUES (
    'Gore',
    'Depictions of blood, guts, or other body parts.',
    'Physical',
    '🩸',
    'Neutral'
  );
INSERT INTO public.content (
    name,
    description,
    category,
    emoji,
    default_intensity
  )
VALUES (
    'Disfigurement',
    'Depictions of disfigurement, such as burns, scars, or amputations.',
    'Physical',
    '🦵',
    'Neutral'
  );
INSERT INTO public.content (
    name,
    description,
    category,
    emoji,
    default_intensity
  )
VALUES (
    'Diseases',
    'Depictions of diseases, plagues, or other illnesses.',
    'Physical',
    '🤒',
    'Neutral'
  );
INSERT INTO public.content (
    name,
    description,
    category,
    emoji,
    default_intensity
  )
VALUES (
    'Body Modification',
    'Depictions of body modification, such as tattoos or piercings.',
    'Physical',
    '👁️',
    'Neutral'
  );


-- Objects
INSERT INTO public.content (
    name,
    description,
    category,
    emoji,
    default_intensity
  )
VALUES (
    'Needles',
    'Either hollow or solid needles, commonly found in medical settings or in textile crafts.',
    'Objects',
    '💉',
    'Neutral'
  );
INSERT INTO public.content (
    name,
    description,
    category,
    emoji,
    default_intensity
  )
VALUES (
    'Alcohol',
    'Alcohol, such as beer, wine, or liquor.',
    'Objects',
    '🍺',
    'Neutral'
  );
INSERT INTO public.content (
    name,
    description,
    category,
    emoji,
    default_intensity
  )
VALUES (
    'Drugs',
    'Drugs, such as marijuana, cocaine, or heroin.',
    'Objects',
    '🌿',
    'Neutral'
  );
INSERT INTO public.content (
    name,
    description,
    category,
    emoji,
    default_intensity
  )
VALUES (
    'Guns',
    'Guns, such as pistols, rifles, or shotguns.',
    'Objects',
    '🔫',
    'Neutral'
  );
INSERT INTO public.content (
    name,
    description,
    category,
    emoji,
    default_intensity
  )
VALUES (
    'Knives and Blades',
    'Knives, such as kitchen knives, pocket knives, or swords.',
    'Objects',
    '🗡️',
    'Neutral'
  );


-- Social Interaction / People
INSERT INTO public.content (
    name,
    description,
    category,
    emoji,
    default_intensity
  )
VALUES (
    'Sexism',
    'Being treated differently because of your gender.',
    'Social',
    '👩',
    'Warning'
  );
INSERT INTO public.content (
    name,
    description,
    category,
    emoji,
    default_intensity
  )
VALUES (
    'Homophobia',
    'Being treated differently because of your sexual orientation.',
    'Social',
    '🏳️‍🌈',
    'Warning'
  );
INSERT INTO public.content (
    name,
    description,
    category,
    emoji,
    default_intensity
  )
VALUES (
    'Racism',
    'Being treated differently because of your race.',
    'Social',
    '🧕',
    'Warning'
  );
INSERT INTO public.content (
    name,
    description,
    category,
    emoji,
    default_intensity
  )
VALUES (
    'Ageism',
    'Being treated differently because of your age.',
    'Social',
    '👴',
    'Warning'
  );
INSERT INTO public.content (
    name,
    description,
    category,
    emoji,
    default_intensity
  )
VALUES (
    'Transphobia',
    'Being treated differently because of your gender identity.',
    'Social',
    '👧',
    'Warning'
  );
INSERT INTO public.content (
    name,
    description,
    category,
    emoji,
    default_intensity
  )
VALUES (
    'Abandonment',
    'Being left alone, or being unable to find help.',
    'Social',
    '👋',
    'Neutral'
  );
INSERT INTO public.content (
    name,
    description,
    category,
    emoji,
    default_intensity
  )
VALUES (
    'Dentists',
    'Dentists, dental hygienists, and other people who work in a dental office.',
    'Social',
    '🦷',
    'Neutral'
  );
INSERT INTO public.content (
    name,
    description,
    category,
    emoji,
    default_intensity
  )
VALUES (
    'Clowns',
    'Clowns, circus performers, often with exaggerated features.',
    'Social',
    '🤡',
    'Neutral'
  );
INSERT INTO public.content (
    name,
    description,
    category,
    emoji,
    default_intensity
  )
VALUES (
    'Evil Races',
    'Depictions of a specific group of people, such as goblins or orcs as being inherently evil.',
    'Social',
    '👹',
    'Neutral'
  );
INSERT INTO public.content (
    name,
    description,
    category,
    emoji,
    default_intensity
  )
VALUES (
    'Kidnapping / Abduction',
    'Being taken against your will, or being unable to escape.',
    'Social',
    '👮',
    'Neutral'
  );
INSERT INTO public.content (
    name,
    description,
    category,
    emoji,
    default_intensity
  )
VALUES (
    'Sexual Assault',
    'Depictions of sexual violence, such as rape or molestation.',
    'Social',
    '🛑',
    'Ban'
  );
INSERT INTO public.content (
    name,
    description,
    category,
    emoji,
    default_intensity
  )
VALUES (
    'Incest',
    'Sexual activity or intimate relationships between close family members.',
    'Social',
    '🛑',
    'Ban'
  );
INSERT INTO public.content (
    name,
    description,
    category,
    emoji,
    default_intensity
  )
VALUES (
    'Domestic Violence',
    'Depictions of violence in the home, or violence against a spouse or partner.',
    'Social',
    '🛑',
    'Ban'
  );
INSERT INTO public.content (
    name,
    description,
    category,
    emoji,
    default_intensity
  )
VALUES (
    'Violence Against Children',
    'Depictions of violence or abuse towards children.',
    'Social',
    '🛑',
    'Ban'
  );
INSERT INTO public.content (
    name,
    description,
    category,
    emoji,
    default_intensity
  )
VALUES (
    'Slavery / Forced Labor',
    'Being forced to work, or being forced to do something against your will.',
    'Social',
    '🔗',
    'Warning'
  );
INSERT INTO public.content (
    name,
    description,
    category,
    emoji,
    default_intensity
  )
VALUES (
    'Human Trafficking',
    'Being forced to work, or being forced to do something against your will.',
    'Social',
    '🛑',
    'Ban'
  );
INSERT INTO public.content (
    name,
    description,
    category,
    emoji,
    default_intensity
  )
VALUES (
    'Collonialism',
    'The exploitation of a country or people through political, economic, cultural or militarisic means.',
    'Social',
    '🇬🇧',
    'Warning'
  );
INSERT INTO public.content (
    name,
    description,
    category,
    emoji,
    default_intensity
  )
VALUES (
    'Religious Persecution',
    'The act of singling out or punishing individuals or communities based on their religious beliefs or practices.',
    'Social',
    '🛐',
    'Warning'
  );
INSERT INTO public.content (
    name,
    description,
    category,
    emoji,
    default_intensity
  )
VALUES (
    'Depictions of Religious Figures',
    'Depictions of human religious figures, such as prophets, saints, or religious leaders.',
    'Social',
    '🕋',
    'Warning'
  );
INSERT INTO public.content (
    name,
    description,
    category,
    emoji,
    default_intensity
  )
VALUES (
    'Religious Extremism',
    'The belief in and promotion of radical or fanatical interpretations of religion, often resulting in acts of violence or terrorism.',
    'Social',
    '🛑',
    'Ban'
  );
INSERT INTO public.content (
    name,
    description,
    category,
    emoji,
    default_intensity
  )
VALUES (
    'Political Violence',
    'The use of physical force or aggression in furtherance of political aims, including acts of terrorism, insurgency, civil unrest, or state-sponsored violence.',
    'Social',
    '🛑',
    'Ban'
  );


-- Animals
INSERT INTO public.content (
    name,
    description,
    category,
    emoji,
    default_intensity
  )
VALUES (
    'Violence against animals',
    'Hunting, butchery or other depictions of violence.',
    'Animals',
    '🪺',
    'Neutral'
  );
INSERT INTO public.content (
    name,
    description,
    category,
    emoji,
    default_intensity
  )
VALUES (
    'Insects',
    'Insects, flies, maggots or other small creatures with many legs.',
    'Animals',
    '🪲',
    'Neutral'
  );
INSERT INTO public.content (
    name,
    description,
    category,
    emoji,
    default_intensity
  )
VALUES (
    'Spiders',
    'Spiders, arachnids, and other arachnid-like creatures.',
    'Animals',
    '🕷️',
    'Neutral'
  );
INSERT INTO public.content (
    name,
    description,
    category,
    emoji,
    default_intensity
  )
VALUES (
    'Snakes',
    'Snakes, serpents, and other reptiles with long bodies and no legs.',
    'Animals',
    '🐍',
    'Neutral'
  );
INSERT INTO public.content (
    name,
    description,
    category,
    emoji,
    default_intensity
  )
VALUES (
    'Rats',
    'Rats, mice, and other rodents.',
    'Animals',
    '🐀',
    'Neutral'
  );
INSERT INTO public.content (
    name,
    description,
    category,
    emoji,
    default_intensity
  )
VALUES (
    'Bats',
    'Bats, flying foxes, and other flying mammals.',
    'Animals',
    '🦇',
    'Neutral'
  );
INSERT INTO public.content (
    name,
    description,
    category,
    emoji,
    default_intensity
  )
VALUES (
    'Dogs',
    'Dogs, wolves, coyotes, and other canines.',
    'Animals',
    '🐕',
    'Neutral'
  );
INSERT INTO public.content (
    name,
    description,
    category,
    emoji,
    default_intensity
  )
VALUES (
    'Cats',
    'Cats, lions, tigers, and other felines.',
    'Animals',
    '🐈',
    'Neutral'
  );

-- Death
INSERT INTO public.content (
    name,
    description,
    category,
    emoji,
    default_intensity
  )
VALUES (
    'Death',
    'Death, dying, and other things related to the end of life.',
    'Death',
    '☠️',
    'Neutral'
  );
INSERT INTO public.content (
    name,
    description,
    category,
    emoji,
    default_intensity
  )
VALUES (
    'Funerals',
    'Funerals, wakes, and other ceremonies related to death.',
    'Death',
    '⚱️',
    'Neutral'
  );
INSERT INTO public.content (
    name,
    description,
    category,
    emoji,
    default_intensity
  )
VALUES (
    'Cemeteries',
    'Cemeteries, graveyards, and other places where the dead are buried.',
    'Death',
    '🪦',
    'Neutral'
  );
INSERT INTO public.content (
    name,
    description,
    category,
    emoji,
    default_intensity
  )
VALUES (
    'Grave robbing',
    'Grave robbing, tomb raiding, and other things related to stealing from the dead.',
    'Death',
    '⚰️',
    'Neutral'
  );
INSERT INTO public.content (
    name,
    description,
    category,
    emoji,
    default_intensity
  )
VALUES (
    'Skeletons',
    'Skeletons, bones, and other things related to the dead.',
    'Death',
    '💀',
    'Neutral'
  );
INSERT INTO public.content (
    name,
    description,
    category,
    emoji,
    default_intensity
  )
VALUES (
    'Suicide',
    'The act of taking ones own life, or thoughts and discussions about suicide.',
    'Death',
    '🛑',
    'Ban'
  );
INSERT INTO public.content (
    name,
    description,
    category,
    emoji,
    default_intensity
  )
VALUES (
    'Genocide',
    'The deliberate and systematic destruction of a racial, ethnic, or religious group',
    'Death',
    '🛑',
    'Ban'
  );
INSERT INTO public.content (
    name,
    description,
    category,
    emoji,
    default_intensity
  )
VALUES (
    'Familial Death',
    'The death of family members or close relatives',
    'Death',
    '❤️‍🩹',
    'Warning'
  );


-- Supernatural
INSERT INTO public.content (
    name,
    description,
    category,
    emoji,
    default_intensity
  )
VALUES (
    'The Afterlife',
    'Heaven, hell, and other beliefs about what happens after death.',
    'Supernatural',
    '👼',
    'Neutral'
  );
INSERT INTO public.content (
    name,
    description,
    category,
    emoji,
    default_intensity
  )
VALUES (
    'Possesion',
    'Possession, being taken over by an evil entity, and other related topics.',
    'Supernatural',
    '🕴️',
    'Neutral'
  );
INSERT INTO public.content (
    name,
    description,
    category,
    emoji,
    default_intensity
  )
VALUES (
    'Ghosts',
    'Ghosts, specters, spirits, and other representations of the dead.',
    'Supernatural',
    '👻',
    'Neutral'
  );
INSERT INTO public.content (
    name,
    description,
    category,
    emoji,
    default_intensity
  )
VALUES (
    'Mummies',
    'Mummies, mummification, and other things related to the dead.',
    'Supernatural',
    '🇪🇬',
    'Neutral'
  );
INSERT INTO public.content (
    name,
    description,
    category,
    emoji,
    default_intensity
  )
VALUES (
    'Zombies',
    'Zombies, ghouls, and other undead creatures.',
    'Supernatural',
    '🧟',
    'Neutral'
  );
INSERT INTO public.content (
    name,
    description,
    category,
    emoji,
    default_intensity
  )
VALUES (
    'Vampires',
    'Vampires, bloodsuckers, and other creatures that feed on blood.',
    'Supernatural',
    '🧛',
    'Neutral'
  );
INSERT INTO public.content (
    name,
    description,
    category,
    emoji,
    default_intensity
  )
VALUES (
    'Werewolves',
    'Werewolves, lycanthropes, and other creatures that transform into wolves.',
    'Supernatural',
    '🐺',
    'Neutral'
  );
INSERT INTO public.content (
    name,
    description,
    category,
    emoji,
    default_intensity
  )
VALUES (
    'Demons',
    'Demons, devils, and other creatures that are evil and/or from hell.',
    'Supernatural',
    '👿',
    'Neutral'
  );


-- Other
INSERT INTO public.content (
    name,
    description,
    category,
    emoji,
    default_intensity
  )
VALUES (
    'Natural Disasters',
    'Depictions of natural disasters, such as tsunamis, earthquakes, or volcanoes.',
    'Other',
    '🌋',
    'Neutral'
  );-- Seed data for the topic table
-- name: the name of the topic (Shorthand for the topic, eg. 'Combat')
-- description: A description of the topic and how it might be used in a game of dungeons and dragons (eg. 'How do you want to play combat in your game, some players like to describe their attacks in detail, others prefer to keep it simple.')
-- fantasy_example: A fantasy example of the topic (Lowest intensity)
-- adventure_example: An adventure example of the topic (Medium intensity)
-- struggle_example: A struggle example of the topic (High intensity)
-- tragedy_example: A tragedy example of the topic (Highest intensity)
INSERT INTO public.topic (
    name,
    description,
    fantasy_example,
    adventure_example,
    struggle_example,
    tragedy_example
  )
VALUES (
    'Combat - PLACEHOLDER',
    'How do you want to play combat in your game, some players like to describe their attacks in detail, others prefer to keep it simple. PLACEHOLDER',
    'I deal 6 damage to the dragon with my sword.',
    'I strike the dragon with my sword, it pierces its scales and deals 6 damage.',
    'The dragon roars in pain as I plunge my sword between its scales dealing 6 damage.',
    'I wrench my sword from the dragon''s chest, blood spurting from the wound as I deal 6 damage.'
  );

INSERT INTO public.topic (
    name,
    description,
    fantasy_example,
    adventure_example,
    struggle_example,
    tragedy_example
  )
VALUES (
    'Magic - PLACEHOLDER',
    'How do you want to play magic in your game, some players like to describe their spells in detail, others prefer to keep it simple. PLACEHOLDER',
    'I cast fireball, dealing 6 damage to the dragon.',
    'I cast fireball, the dragon roars in pain as it takes 6 damage.',
    'I cast fireball, the dragon roars in pain as it takes 6 damage, its scales begin to melt.',
    'I cast fireball, the dragon roars in pain as it takes 6 damage, its scales begin to melt, its flesh begins to burn.'
  );INSERT INTO auth.users (
    id,
    aud,
    role,
    email,
    email_confirmed_at,
    last_sign_in_at,
    raw_app_meta_data,
    raw_user_meta_data,
    created_at,
    updated_at
  )
VALUES (
    '00000000-0000-0000-0000-000000000000',
    'authenticated',
    'authenticated',
    'test@example.com',
    '2023-02-06 10:44:44.461272+00',
    '2023-02-06 10:44:44.454399+00',
    '{"provider":"discord","providers":["discord"]}',
    '{"iss":"https://discord.com/api","sub":"159985870458322944","name":"mee6#4876","email":"test@example.com","picture":"https://cdn.discordapp.com/avatars/159985870458322944/b50adff099924dd5e6b72d13f77eb9d7","full_name":"Mee6","avatar_url":"https://cdn.discordapp.com/avatars/159985870458322944/b50adff099924dd5e6b72d13f77eb9d7","provider_id":"159985870458322944","email_verified":true}',
    '2023-02-06 10:44:44.461272+00',
    '2023-02-06 10:44:44.461272+00'
  );

-- Seed a new group for the test user
INSERT INTO public.group (name, invite_code, initial_intensity, owner)
VALUES (
    'SQL Seed Group',
    '123456',
    'Adventure',
    '00000000-0000-0000-0000-000000000000'
  );

-- Seed data for the user_group table
INSERT INTO public.user_group (user_id, group_id)
VALUES (
    '00000000-0000-0000-0000-000000000000',
    (
      SELECT id
      FROM public.group
      WHERE invite_code = '123456'
    )
  );
-- Seed Data for the topic_response table
INSERT INTO public.topic_response (user_id, topic_id, group_id, intensity)
VALUES (
    '00000000-0000-0000-0000-000000000000',
    1,
    1,
    'Fantasy'
  );