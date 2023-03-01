-- #endregion Response Getter Functions
-- ====================== TRIGGER FUNCTIONS ======================
-- #region Triggers
-- #region Registration Triggers
-- #endregion Group Triggers
-- #endregion Triggers
-- -- The function that allows a user to see how many users are in a group they are in
-- CREATE OR REPLACE FUNCTION public.get_group_size(
--   req_id INTEGER
-- ) returns INTEGER AS $$
-- DECLARE
--   group_size INTEGER;
-- BEGIN
--   -- Check if the user is in the group
--   IF NOT EXISTS (SELECT * FROM public.user_group WHERE group_id = req_id AND user_id = auth.uid()) THEN
--     RAISE EXCEPTION 'User is not in group';
--     -- NOTE: RAISE EXCEPTION will stop the function from executing and will return an error message
--   END IF;
--   -- Retrieve the number of users in the group
--   SELECT COUNT(*) INTO group_size FROM public.user_group WHERE group_id = req_id;
--   -- Return the number of users in the group
--   RETURN group_size;
-- END;
-- $$ LANGUAGE plpgsql;