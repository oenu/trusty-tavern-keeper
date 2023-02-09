-- ====================== RESET DATABASE ======================
-- #region Reset database
-- Drop all tables
DROP TABLE IF EXISTS public.user cascade;
DROP TABLE IF EXISTS public.group cascade;
DROP TABLE IF EXISTS public.user_group cascade;
DROP TABLE IF EXISTS public.phobia cascade;
DROP TABLE IF EXISTS public.custom_phobia cascade;
DROP TABLE IF EXISTS public.phobia_response cascade;
DROP TABLE IF EXISTS public.topic cascade;
DROP TABLE IF EXISTS public.topic_response cascade;

-- Drop all enums
DROP TYPE IF EXISTS PhobiaIntensity cascade;
DROP TYPE IF EXISTS TopicIntensity cascade;

-- Drop all functions
DROP FUNCTION IF EXISTS public.handle_new_user cascade;
DROP FUNCTION IF EXISTS public.join_group_with_code cascade;
DROP FUNCTION IF EXISTS public.delete_group cascade;
DROP FUNCTION IF EXISTS public.leave_group cascade;
DROP FUNCTION IF EXISTS public.create_group cascade;
DROP FUNCTION IF EXISTS public.get_group_users cascade;
DROP FUNCTION IF EXISTS public.get_group_size cascade;
DROP FUNCTION IF EXISTS public.delete_group_on_owner_leave cascade;


-- Drop all triggers
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users cascade;
DROP TRIGGER IF EXISTS on_owner_leaves_group ON auth.users cascade;

-- Delete all users in auth.users
DELETE FROM auth.users;

-- #endregion

-- ====================== INIT DATABASE ======================

-- ENUMS
CREATE TYPE PhobiaIntensity AS ENUM ('Unaffected', 'Neutral', 'Warning', 'Ban');
CREATE TYPE TopicIntensity AS ENUM ('Fantasy', 'Adventure', 'Struggle', 'Tragedy');



-- ====================== USER ======================
-- #region User
/* User table
- Stores a reference to the user's profile in the auth.users table
- Stores the user's name
*/
CREATE TABLE public.user (
    id uuid REFERENCES auth.users ON DELETE CASCADE NOT NULL,
    discord_id TEXT NOT NULL, -- Discord ID
    profile_picture TEXT NOT NULL, -- URL to the profile picture
    name TEXT NOT NULL, -- Name + discriminator
    full_name TEXT NOT NULL, -- Name that is displayed on the profile
    PRIMARY KEY (id)
);
ALTER TABLE public.user ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can insert their own profile."
ON public.user FOR INSERT
WITH CHECK ( auth.uid() = id );

CREATE POLICY "Users are viewable by users who created them."
ON public.user FOR SELECT
USING ( auth.uid() = id );

CREATE POLICY "Users can update own profile."
ON public.user FOR UPDATE
USING ( auth.uid() = id );

create function public.handle_new_user() -- Inserts a row into public.user
returns trigger -- Return type of the function: a Postgres trigger
language plpgsql -- Language used, plpgsql is a Postgres-specific SQL language 
security definer set search_path = public -- Define security rules: trusted schemas (public)
as $$ -- Start definition of the function
begin
  -- Link the user to the auth.users table and extract the full_name
  insert into public.user (id, full_name, name, discord_id, profile_picture)
  values (new.id, new.raw_user_meta_data ->> 'full_name', new.raw_user_meta_data ->> 'name', new.raw_user_meta_data ->> 'provider_id', new.raw_user_meta_data ->> 'avatar_url');
  return new;
end;
$$; -- Return the function


create trigger on_auth_user_created -- Trigger the function every time a user is created
  after insert on auth.users -- New sign up: insert in `auth.users`
  for each row execute procedure public.handle_new_user(); -- Call `handle_new_user` function



-- Seed the database with a user
-- To seed this we will need to also insert data into the auth.users table
INSERT INTO auth.users (id,	aud,role,	email, email_confirmed_at, last_sign_in_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at)
VALUES (
'00000000-0000-0000-0000-000000000000',
'authenticated',
'authenticated',
'test@example.com',
'2023-02-06 10:44:44.461272+00',
'2023-02-06 10:44:44.454399+00',
'{"provider":"discord","providers":["discord"]}',
'{"iss":"https://discord.com/api","sub":"159985870458322944","name":"mee6#4876","email":"test@example.com","picture":"https://cdn.discordapp.com/avatars/159985870458322944/b50adff099924dd5e6b72d13f77eb9d7","full_name":"Mee6","avatar_url":"https://cdn.discordapp.com/avatars/159985870458322944/b50adff099924dd5e6b72d13f77eb9d7","provider_id":"159985870458322944","email_verified":true}',
'2023-02-06 10:44:44.461272+00', '2023-02-06 10:44:44.461272+00');

-- INSERT INTO public.user (id, name)
-- VALUES ('00000000-0000-0000-0000-000000000000', 'Test User');



-- #endregion
-- ====================== GROUPS ======================
-- #region Groups
/* Group table
- Stores the group's name
- Stores the group's invite code
- Stores the group's intensity
- Stores the group's members
- Stores the group's owner

Groups are created by a user (owner) and can be joined by other users (members). They have a maximum intensity level that is set by the owner when the group is created.
Users will answer questions about their phobias and topics. The answers will be used to determine the intensity of the group / which specific phobias and topics are allowed in the group. (Fetched via sql queries)
*/

CREATE TABLE public.group (
    id SERIAL PRIMARY KEY UNIQUE NOT NULL,
    name TEXT NOT NULL,
    invite_code TEXT UNIQUE NOT NULL,
    initial_intensity TopicIntensity NOT NULL,
    owner uuid REFERENCES public.user ON DELETE CASCADE NOT NULL
);

ALTER TABLE public.group ENABLE ROW LEVEL SECURITY;

/* user_group table
- Stores the user's id
- Stores the group's id
*/
CREATE TABLE public.user_group (
    user_id uuid REFERENCES public.user ON DELETE CASCADE NOT NULL,
    group_id INTEGER REFERENCES public.group ON DELETE CASCADE NOT NULL,
    PRIMARY KEY (user_id, group_id)
);

ALTER TABLE public.user_group ENABLE ROW LEVEL SECURITY;


-- The function that allows a user to see how many users are in a group they are in
CREATE OR REPLACE FUNCTION public.get_group_size(
  req_id INTEGER
) returns INTEGER AS $$
DECLARE
  group_size INTEGER;
BEGIN
  -- Check if the user is in the group
  IF NOT EXISTS (SELECT * FROM public.user_group WHERE group_id = req_id AND user_id = auth.uid()) THEN
    RAISE EXCEPTION 'User is not in group';
    -- NOTE: RAISE EXCEPTION will stop the function from executing and will return an error message
  END IF;
  -- Retrieve the number of users in the group
  SELECT COUNT(*) INTO group_size FROM public.user_group WHERE group_id = req_id;
  -- Return the number of users in the group
  RETURN group_size;
END;
$$ LANGUAGE plpgsql;







-- The function that allows a user to join a group with a given invite code
CREATE OR REPLACE FUNCTION public.join_group_with_code(
  invite TEXT
) returns JSON
security definer set search_path = public
 AS $$
DECLARE
  group_to_join INTEGER;
BEGIN

-- Check if the invite is a number or text
  IF NOT (invite::TEXT ~ '^[0-9]+$' OR invite::TEXT ~ '^[a-zA-Z]+$') THEN
    RAISE EXCEPTION 'Invalid invite code type (must be a number or text))';
    -- NOTE: RAISE EXCEPTION will stop the function from executing and will return an error message
  END IF;

  -- Check if the invite code is valid
  IF NOT EXISTS (SELECT * FROM public.group WHERE invite_code::TEXT = invite::TEXT) THEN
    RAISE EXCEPTION 'Invalid invite code: %', invite::TEXT;
    -- NOTE: RAISE EXCEPTION will stop the function from executing and will return an error message
  END IF;

-- Retrieve the group id for the given invite code
  SELECT id INTO group_to_join FROM public.group WHERE invite_code = invite::TEXT;

  -- Check if the user is already in the group
IF EXISTS (SELECT * FROM public.user_group WHERE group_id = group_to_join AND user_id = auth.uid()) THEN
    RAISE EXCEPTION 'User is already in group';
  END IF;
  

  -- Insert the user into the group
  -- PERFORM public.elevated_insert_user_group(auth.uid(), group_to_join);
  -- Insert the current user and the group id into the user_group table
  INSERT INTO public.user_group (user_id, group_id)
  VALUES (auth.uid(), group_to_join);


  -- Return a success message 
  -- RETURN json_build_object('message', 'Successfully joined group with id: ' ||  group_to_join::TEXT, 'group_id', group_to_join, 'invite_code', invite::TEXT);
  -- Returns json object inside an array
  RETURN json_build_array(json_build_object('message', 'Successfully joined group with id: ' ||  group_to_join::TEXT, 'group_id', group_to_join, 'invite_code', invite::TEXT));
END;
$$ LANGUAGE plpgsql;




-- The function that allows a user to leave a group
CREATE OR REPLACE FUNCTION public.leave_group(
  req_id INTEGER
) returns TEXT AS $$
BEGIN
  -- Delete the current user and the group id from the user_group table
  DELETE FROM public.user_group WHERE user_id = auth.uid() AND group_id = req_id;
  -- Return a success message
  RETURN 'Successfully left group with id: ' ||  req_id::TEXT;
END;
$$ LANGUAGE plpgsql;




-- The function that allows a user to create a group
CREATE OR REPLACE FUNCTION public.create_group(
  name TEXT,
  intensity TEXT
) returns TEXT AS $$
DECLARE
  invite TEXT;
BEGIN

  -- Check if the user already owns 10 groups
  -- IF EXISTS (SELECT * FROM public.group WHERE owner = auth.uid()) THEN
    -- RAISE EXCEPTION 'Maximum number of groups reached (10)';
  -- END IF;
  IF (SELECT COUNT(*) FROM public.group WHERE owner = auth.uid()) >= 10 THEN
    RAISE EXCEPTION 'Maximum number of groups reached (10)';
  END IF;


  -- Generate a random invite code
  invite := md5(random()::text);
  -- Remove the '-', 
  invite := replace(invite, '-', '');
  -- and take the first 6 characters
  invite := substring(invite, 1, 6);

  -- check if the invite code is already in use (should be very unlikely)
  WHILE EXISTS
   (SELECT 1 FROM public.group WHERE invite_code = invite) 
  LOOP
    -- If it is, generate a new invite code
    invite := md5(random()::text);
    invite := replace(invite, '-', '');
    invite := substring(invite, 1, 6);
  END LOOP;
  
  -- Insert the group into the groups table
  INSERT INTO public.group (name, invite_code, initial_intensity, owner)
  VALUES (name, invite, intensity::TopicIntensity, auth.uid());

 -- Insert the owner into the user_group table
  INSERT INTO public.user_group (user_id, group_id)
  VALUES (auth.uid(), currval('group_id_seq'));
  -- PERFORM public.elevated_insert_user_group(auth.uid(), currval('group_id_seq'));


  -- Return the group id
  RETURN currval('group_id_seq');
END;
$$ LANGUAGE plpgsql;


-- Function that is called when a group is deleted by the owner (cascade delete to the user_group table)
CREATE FUNCTION public.delete_group()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  -- Delete all rows from the user_group table that have the group id of the deleted group
  delete from public.user_group where group_id = old.id;
  return old;
end;
$$;

-- Trigger the function when a group is deleted
create trigger on_group_deleted
  after delete on public.group
  for each row execute procedure public.delete_group();


CREATE FUNCTION public.delete_group_on_owner_leave()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  -- Delete the group if the owner leaves
  delete from public.group where id = old.group_id and owner = old.user_id;
  return old;
end;
$$;


-- Trigger the delete group function when the owner leaves the group
create trigger on_owner_leaves_group
  after delete on public.user_group
  for each row execute procedure public.delete_group_on_owner_leave();



-- Function that returns the list of users in a group, must be a member of the group
CREATE OR REPLACE FUNCTION public.get_group_users(
  req_id INTEGER
) returns TABLE (
  full_name TEXT,
  name TEXT,
  discord_id TEXT,
  profile_picture TEXT,
  is_owner BOOLEAN
) 
security definer set search_path = public
AS $$
BEGIN

  -- Get the group id from the invite code
  -- SELECT id INTO var_group_id FROM public.group WHERE invite_code = invite::TEXT;

  -- Check if the user is a member of the group
  IF NOT EXISTS (SELECT * FROM public.user_group WHERE group_id = req_id AND user_id = auth.uid()) THEN
    RAISE EXCEPTION 'User is not a member of the group';
  END IF;

  -- Return the list of users in the group (rewrite to include owner)
  RETURN QUERY
  SELECT u.full_name, u.name, u.discord_id, u.profile_picture, g.owner = u.id
  FROM public.user_group ug
  INNER JOIN public.user u ON ug.user_id = u.id
  INNER JOIN public.group g ON ug.group_id = g.id
  WHERE ug.group_id = req_id;
END

$$ LANGUAGE plpgsql;









-- The function that prevents users from seeing the owner of a group
-- TODO: Implement this functionality to protect the owner's identity from other users
-- CREATE POLICY "Group members should not be able to see the owners personal ID" 
-- ON "group" FOR SELECT
-- USING (EXISTS (SELECT 1 FROM public.user_group WHERE user_id = auth.uid() AND group_id = id));



-- Group Policies
CREATE POLICY "Groups are viewable by users who are members of the group."
ON "group" FOR SELECT
USING (EXISTS (SELECT 1 FROM public.user_group WHERE user_id = auth.uid() AND group_id = id));

CREATE POLICY "Groups are viewable by users who created them."
ON "group" FOR SELECT
USING ( auth.uid() = owner );

CREATE POLICY "Groups can be updated by users who created them."
ON "group" FOR UPDATE
USING ( auth.uid() = owner );

CREATE POLICY "Groups can be deleted by users who created them."
ON "group" FOR DELETE
USING ( auth.uid() = owner );

CREATE POLICY "Groups can be inserted by all users."
ON "group" FOR INSERT
WITH CHECK ( true );


-- User_Group Policies
CREATE POLICY "Users can insert themselves into a group."
ON "user_group" FOR INSERT
WITH CHECK ( auth.uid() = user_id );

CREATE POLICY "Users can delete themselves from a group."
ON "user_group" FOR DELETE
USING ( auth.uid() = user_id );

CREATE POLICY "Users can view groups they are members of."
ON "user_group" FOR SELECT
USING ( auth.uid() = user_id );




-- Seed data for the group table
INSERT INTO public.group (name, invite_code, initial_intensity, owner) VALUES ('SQL Seed Group', '123456', 'Adventure', '00000000-0000-0000-0000-000000000000');

-- Seed data for the user_group table
-- INSERT INTO public.user_group (user_id, group_id) VALUES ('00000000-0000-0000-0000-000000000000', 1);
-- rewrite this to use a select statement to get the id of the group that was just inserted
INSERT INTO public.user_group (user_id, group_id) VALUES ('00000000-0000-0000-0000-000000000000', (SELECT id FROM public.group WHERE invite_code = '123456'));


-- #endregion
-- ====================== PHOBIAS ======================
-- #region Phobias
/* phobia table
- Stores the phobia's name
- Stores the phobia's description

This table will be used to store the phobias that users can choose from when answering questions about their phobias, a seperate table contains the responses to these questions (phobia_response).
*/

CREATE TABLE public.phobia (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT NOT NULL
);

ALTER TABLE public.phobia ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Phobias are viewable by all users."
ON "phobia" FOR SELECT
USING ( true );



-- Seed data for the phobia table 
INSERT INTO public.phobia (name, description) VALUES ('Aerophobia', 'Fear of heights or flying.');
INSERT INTO public.phobia (name, description) VALUES ('Agoraphobia', 'Fear of open spaces.');
INSERT INTO public.phobia (name, description) VALUES ('Aichmophobia', 'Fear of needles.');
INSERT INTO public.phobia (name, description) VALUES ('Astraphobia', 'Fear of thunder and lightning.');
INSERT INTO public.phobia (name, description) VALUES ('Astraphobia', 'Fear of thunder and lightning.');
INSERT INTO public.phobia (name, description) VALUES ('Bathmophobia', 'Fear of stairs.');
INSERT INTO public.phobia (name, description) VALUES ('Chaetophobia', 'Fear of hair.');
INSERT INTO public.phobia (name, description) VALUES ('Cynophobia', 'Fear of dogs.');
INSERT INTO public.phobia (name, description) VALUES ('Dendrophobia', 'Fear of trees.');
INSERT INTO public.phobia (name, description) VALUES ('Dentophobia', 'Fear of dentists.');
INSERT INTO public.phobia (name, description) VALUES ('Dystychiphobia', 'Fear of accidents.');
INSERT INTO public.phobia (name, description) VALUES ('Emetophobia', 'Fear of vomiting.');
INSERT INTO public.phobia (name, description) VALUES ('Ephebiphobia', 'Fear of teenagers.');





/* custom_phobia table
- Stores the user's id
- Stores the phobia's name
- Stores the phobia's description
- Stores the phobia's intensity ('Unaffected', 'Neutral', 'Warning', 'Ban')

This table will be used to store the phobias that users create themselves
*/

CREATE TABLE public.custom_phobia (
    user_id uuid REFERENCES public.user ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    intensity PhobiaIntensity NOT NULL,
    PRIMARY KEY (user_id, name)
);

ALTER TABLE public.custom_phobia ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Custom phobias are viewable by users who created them."
ON "custom_phobia" FOR SELECT
USING ( auth.uid() = user_id );

CREATE POLICY "Custom phobias are editable by users who created them."
ON "custom_phobia" FOR UPDATE
USING ( auth.uid() = user_id );

CREATE POLICY "Custom phobias are deletable by users who created them."
ON "custom_phobia" FOR DELETE
USING ( auth.uid() = user_id );



/* phobia_response table
- Stores the user's id
- Stores the phobia's id
- Stores the phobia's intensity ('Unaffected', 'Neutral', 'Warning', 'Ban')

This table will be used to store the responses to the questions about the user's phobias.
Phobia responses are used across multiple groups (unlike topics), so they are stored in a seperate table.
*/

CREATE TABLE public.phobia_response (
    user_id uuid REFERENCES public.user ON DELETE CASCADE NOT NULL,
    phobia_id INTEGER REFERENCES public.phobia ON DELETE CASCADE NOT NULL,
    intensity PhobiaIntensity NOT NULL,
    PRIMARY KEY (user_id, phobia_id)
);

ALTER TABLE public.phobia_response ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Phobia responses are viewable by users who created them."
ON "phobia_response" FOR SELECT
USING ( auth.uid() = user_id );

CREATE POLICY "Phobia responses can be updated by users who created them."
ON "phobia_response" FOR UPDATE
USING ( auth.uid() = user_id );

CREATE POLICY "Phobia responses can be deleted by users who created them."
ON "phobia_response" FOR DELETE
USING ( auth.uid() = user_id );

CREATE POLICY "Phobia responses can be inserted by users who created them."
ON "phobia_response" FOR INSERT WITH CHECK ( auth.uid() = user_id );

-- #endregion
-- ====================== TOPICS ======================
-- #region Topics
/* topic table
- Stores the topic's name
- Stores the topic's description
- Stores 4 examples, one for each intensity
- Stores the topic's intensity (Fantasy', 'Adventure', 'Struggle', 'Tragedy')

This table will be used to store the topics that users can choose from when answering questions about their topics, a seperate table contains the responses to these questions (topic_response).
*/

CREATE TABLE public.topic (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    fantasy_example TEXT NOT NULL,
    adventure_example TEXT NOT NULL,
    struggle_example TEXT NOT NULL,
    tragedy_example TEXT NOT NULL
);

ALTER TABLE public.topic ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Topics are viewable by all users."
ON "topic" FOR SELECT
USING ( true );


-- Seed data for the topic table
INSERT INTO public.topic (name, description, fantasy_example, adventure_example, struggle_example, tragedy_example) 
VALUES (
  'Combat - PLACEHOLDER', 
  'How do you want to play combat in your game, some players like to describe their attacks in detail, others prefer to keep it simple. PLACEHOLDER',
  'I deal 6 damage to the dragon with my sword.',
  'I strike the dragon with my sword, it pierces its scales and deals 6 damage.',
  'The dragon roars in pain as I plunge my sword between its scales dealing 6 damage.',
  'I wrench my sword from the dragon''s chest, blood spurting from the wound as I deal 6 damage.'
);

INSERT INTO public.topic (name, description, fantasy_example, adventure_example, struggle_example, tragedy_example)
VALUES (
  'Magic - PLACEHOLDER', 
  'How do you want to play magic in your game, some players like to describe their spells in detail, others prefer to keep it simple. PLACEHOLDER',
  'I cast fireball, dealing 6 damage to the dragon.',
  'I cast fireball, the dragon roars in pain as it takes 6 damage.',
  'I cast fireball, the dragon roars in pain as it takes 6 damage, its scales begin to melt.',
  'I cast fireball, the dragon roars in pain as it takes 6 damage, its scales begin to melt, its flesh begins to burn.'
);





/* topic_response table
- Stores the user's id
- Stores the topic's id
- Stores the group's id (topic responses are specific to a group, ie a user can have different responses to the same topic in different groups)
- Stores the topic's intensity ('Fantasy', 'Adventure', 'Struggle', 'Tragedy')

This table will be used to store the responses to the questions about the user's topics.
*/

CREATE TABLE public.topic_response (
    user_id uuid REFERENCES public.user ON DELETE CASCADE NOT NULL,
    topic_id INTEGER REFERENCES public.topic ON DELETE CASCADE NOT NULL,
    group_id INTEGER REFERENCES public.group ON DELETE CASCADE NOT NULL,
    intensity TopicIntensity NOT NULL,
    PRIMARY KEY (user_id, topic_id, group_id)
);

ALTER TABLE public.topic_response ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Topic responses are viewable by users who created them."
ON "topic_response" FOR SELECT
USING ( auth.uid() = user_id );

CREATE POLICY "Topic responses can be updated by users who created them."
ON "topic_response" FOR UPDATE
USING ( auth.uid() = user_id );

CREATE POLICY "Topic responses can be deleted by users who created them."
ON "topic_response" FOR DELETE
USING ( auth.uid() = user_id );

CREATE POLICY "Topic responses can be inserted by users who created them."
ON "topic_response" FOR INSERT WITH CHECK ( auth.uid() = user_id );

-- #endregion






