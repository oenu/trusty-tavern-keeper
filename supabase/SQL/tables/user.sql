CREATE TABLE public.user (
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
UPDATE USING (auth.uid() = id);