/* custom_content table 
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

CREATE POLICY "Custom contents are deletable by users who created them." ON "custom_content" FOR DELETE USING (auth.uid() = user_id);