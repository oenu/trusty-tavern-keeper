/* Group table
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
CREATE POLICY "Groups are viewable by users who are members of the group." ON "group" FOR
SELECT USING (
    EXISTS (
      SELECT 1
      FROM public.user_group
      WHERE user_id = auth.uid()
        AND group_id = id
    )
  );

CREATE POLICY "Groups are viewable by users who created them." ON "group" FOR
SELECT USING (auth.uid() = owner);

CREATE POLICY "Groups can be updated by users who created them." ON "group" FOR
UPDATE USING (auth.uid() = owner);

CREATE POLICY "Groups can be deleted by users who created them." ON "group" FOR DELETE USING (auth.uid() = owner);

CREATE POLICY "Groups can be inserted by all users." ON "group" FOR
INSERT WITH CHECK (TRUE);