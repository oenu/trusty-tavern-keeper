INSERT INTO auth.users (
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