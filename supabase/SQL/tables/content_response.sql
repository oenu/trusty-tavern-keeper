/* content_response table
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
INSERT WITH CHECK (auth.uid() = user_id);