import { Route, Routes } from 'react-router-dom';

// Screens

import CreateGroup from './screens/CreateGroup/CreateGroup';
import Group from './screens/Group/Group';

import Profile from './screens/Profile/Profile';

// Types
import { Session } from '@supabase/supabase-js';
import ContentList from './components/contents/ContentList/ContentList';

function Router({
  session,
  getGroups,
}: {
  session: Session | null;
  getGroups: () => Promise<void>;
}) {
  return (
    <Routes>
      {/* Personal Content Prefs */}
      <Route path="/contents" element={<ContentList />} />

      {/* Create Survey */}
      <Route path="/create" element={<CreateGroup getGroups={getGroups} />} />

      {/* Groups */}
      <Route
        path="/group/:group_id"
        element={<Group getGroups={getGroups} />}
      />

      {/* Misc */}
      <Route path="/profile" element={<Profile />} />

      {/* Catch */}

      <Route path="*" element={<div>404</div>} />
    </Routes>
  );
}

export default Router;
