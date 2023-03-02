/* topic table 
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
SELECT USING (TRUE);