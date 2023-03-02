import { Route, Routes } from 'react-router-dom';

// Screens

import CreateGroup from './screens/CreateGroup/CreateGroup';
import Group from './screens/Group/Group';

import Profile from './screens/Profile/Profile';

import TopicList from './components/topics/Topics/TopicList/TopicList';

// Types
import { Session } from '@supabase/supabase-js';
import TopicReport from './components/topics/TopicReport/TopicReport';
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

      <Route path="/group/:group_id" element={<Group getGroups={getGroups} />}>
        <Route path="/group/:group_id/report" element={<TopicReport />} />
        <Route index path="/group/:group_id" element={<TopicList />} />
      </Route>

      {/* Misc */}
      <Route path="/profile" element={<Profile />} />

      {/* Catch */}

      <Route path="*" element={<div>404</div>} />
    </Routes>
  );
}

export default Router;
