
-- Drop all tables
DROP TABLE IF EXISTS public.users cascade;
DROP TABLE IF EXISTS public.groups cascade;
DROP TABLE IF EXISTS public.users_groups cascade;
DROP TABLE IF EXISTS public.phobias cascade;
DROP TABLE IF EXISTS public.topics cascade;
DROP TABLE IF EXISTS public.phobiaList cascade;
DROP TABLE IF EXISTS public.topicList cascade;

-- Drop all types
DROP TYPE IF EXISTS PhobiaPreference;
DROP TYPE IF EXISTS TopicIntensity;


-- Enums
CREATE TYPE PhobiaPreference AS ENUM ('Unaffected', 'Neutral', 'Warning', 'Ban');
CREATE TYPE TopicIntensity AS ENUM ('Fantasy', 'Adventure', 'Struggle', 'Tragedy');

-- Models
CREATE TABLE public.users (
    id uuid not null references auth.users on delete cascade,
    discord_id VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    primary key (id)
);
alter table public.users enable row level security;

CREATE TABLE public.groups (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    invite_code VARCHAR(255) UNIQUE NOT NULL,
    intensity TopicIntensity NOT NULL
);

CREATE TABLE public.phobias (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description VARCHAR(255) NOT NULL,
    preference PhobiaPreference NOT NULL,
    user_id uuid not null references public.users(id) on delete cascade
);

CREATE TABLE public.topics (
    id SERIAL PRIMARY KEY,
    -- user_id INTEGER NOT NULL,
    label VARCHAR(255) NOT NULL,
    question VARCHAR(255) NOT NULL,
    options VARCHAR(255)[] NOT NULL,
    response TopicIntensity NOT NULL,
    -- FOREIGN KEY (user_id) REFERENCES public.users(id)
    -- constraint fk_user_id 
        -- foreign key (user_id) 
        -- references public.users(id) on delete cascade

    user_id uuid not null references public.users(id) on delete cascade
);

-- Lists

CREATE TABLE public.phobiaList (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description VARCHAR(255) NOT NULL
);

CREATE TABLE public.topicList (
    id SERIAL PRIMARY KEY,
    label VARCHAR(255) NOT NULL,
    question VARCHAR(255) NOT NULL,
    options VARCHAR(255)[] NOT NULL
);

-- -- Policies
-- create policy "Profiles are viewable by users who created them."
--   on profiles for select
--   using ( auth.uid() = id );

-- create policy "Profiles are editable by users who created them."
--     on profiles for update
--     using ( auth.uid() = id );

-- create policy "Profiles are deletable by users who created them."
--     on profiles for delete
--     using ( auth.uid() = id );
