import { Route, Routes } from 'react-router-dom';

// Screens
import CreateGroup from './screens/main/Group/CreateGroup';
import Group from './screens/main/Group/Group';
import Home from './screens/main/Home/Home';
import Login from './screens/main/Login/Login';
import Profile from './screens/main/Profile/Profile';
import CreateSurvey from './screens/main/Survey/CreateSurvey';
import Topics from './screens/main/Topics/TopicList';
import Debug from './screens/misc/Debug/Debug';

// Types
import { Session } from '@supabase/supabase-js';
import ContentList from './screens/main/Contents/ContentList';
import TopicReport from './screens/main/TopicReport/TopicReport';

function Router({
  session,
  getGroups,
}: {
  session: Session | null;
  getGroups: () => Promise<void>;
}) {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      {/* Personal Content Prefs */}
      <Route path="/contents" element={<ContentList />} />

      {/* Create Survey */}
      <Route path="/create" element={<CreateGroup getGroups={getGroups} />} />
      <Route path="/create/survey" element={<CreateSurvey />} />
      {/* Groups */}
      <Route path="/group/:group_id/topics" element={<Topics />} />
      <Route path="/group/:group_id" element={<Group getGroups={getGroups} />}>
        <Route path="/group/:group_id/report" element={<TopicReport />} />
      </Route>

      {/* Misc */}
      <Route path="/debug" element={<Debug session={session} />} />
      <Route path="/profile" element={<Profile />} />

      {/* Catch */}
      <Route path="/" element={<Home />} index />
      <Route path="*" element={<div>404</div>} />
    </Routes>
  );
}

export default Router;
