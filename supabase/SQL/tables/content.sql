/* content table
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
SELECT USING (TRUE);