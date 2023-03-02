/* topic_response table
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
INSERT WITH CHECK (auth.uid() = user_id);