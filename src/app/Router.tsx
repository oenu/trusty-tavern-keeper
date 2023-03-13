// Router
import { Route, Routes } from 'react-router-dom';

// Screens
import CreateGroup from './screens/CreateGroup/CreateGroup';
import Group from './screens/Group/Group';
import Profile from './screens/Profile/Profile';

// Types
import ContentList from './screens/Profile/components/ContentList/ContentList';
import Landing from './screens/Landing/Landing';

function Router({ getGroups }: { getGroups: () => Promise<void> }) {
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

      <Route path="*" element={<Landing />} />
    </Routes>
  );
}

export default Router;
