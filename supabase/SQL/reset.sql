-- Drop all tables
DROP TABLE IF EXISTS public.user CASCADE;
DROP TABLE IF EXISTS public.group CASCADE;
DROP TABLE IF EXISTS public.user_group CASCADE;
DROP TABLE IF EXISTS public.content CASCADE;
DROP TABLE IF EXISTS public.custom_content CASCADE;
DROP TABLE IF EXISTS public.content_response CASCADE;
DROP TABLE IF EXISTS public.topic CASCADE;
DROP TABLE IF EXISTS public.topic_response CASCADE;


-- Drop all enums
DROP TYPE IF EXISTS ContentIntensity CASCADE;
DROP TYPE IF EXISTS TopicIntensity CASCADE;
DROP TYPE IF EXISTS ContentCategory CASCADE;

-- Drop all functions
DROP FUNCTION IF EXISTS public.handle_new_user CASCADE;
DROP FUNCTION IF EXISTS public.join_group_with_code CASCADE;
DROP FUNCTION IF EXISTS public.delete_group CASCADE;
DROP FUNCTION IF EXISTS public.leave_group CASCADE;
DROP FUNCTION IF EXISTS public.create_group CASCADE;
DROP FUNCTION IF EXISTS public.get_group_users CASCADE;
DROP FUNCTION IF EXISTS public.get_group_size CASCADE;
DROP FUNCTION IF EXISTS public.delete_group_on_owner_leave CASCADE;


-- Drop all triggers
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users CASCADE;
DROP TRIGGER IF EXISTS on_owner_leaves_group ON auth.users CASCADE;

-- Delete all users in auth.users
DELETE FROM auth.users;