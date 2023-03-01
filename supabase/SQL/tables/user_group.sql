/* user_group table (many to many relationship between users and groups) */
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
UPDATE USING (auth.uid() = user_id);