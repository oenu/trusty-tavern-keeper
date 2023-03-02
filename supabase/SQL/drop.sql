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




-- Drop Trigger Functions
DROP FUNCTION IF EXISTS public.on_register CASCADE;
DROP FUNCTION IF EXISTS public.on_account_delete CASCADE;


DROP FUNCTION IF EXISTS public.add_default_content_responses CASCADE;
DROP FUNCTION IF EXISTS public.on_leave_group CASCADE;


-- Drop RPC Functions
DROP FUNCTION IF EXISTS public.create_group CASCADE;
DROP FUNCTION IF EXISTS public.join_group CASCADE;
DROP FUNCTION IF EXISTS public.leave_group CASCADE;
DROP FUNCTION IF EXISTS public.get_group_members CASCADE;
DROP FUNCTION IF EXISTS public.delete_content_responses CASCADE;



DROP FUNCTION IF EXISTS public.delete_custom_contents CASCADE;
DROP FUNCTION IF EXISTS public.delete_topic_responses_on_leave_group CASCADE;
DROP FUNCTION IF EXISTS public.elevated_insert_user_group CASCADE;
DROP FUNCTION IF EXISTS public.get_group_topic_responses CASCADE;
DROP FUNCTION IF EXISTS public.delete_group_memberships CASCADE;
DROP FUNCTION IF EXISTS public.delete_topic_responses CASCADE;
DROP FUNCTION IF EXISTS public.on_group_delete CASCADE;


-- Drop all triggers
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users CASCADE;
DROP TRIGGER IF EXISTS on_owner_leaves_group ON auth.users CASCADE;

-- Delete all users in auth.users
DELETE FROM auth.users;