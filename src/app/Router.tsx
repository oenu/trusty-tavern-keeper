import React from 'react';
import { Route, Routes } from 'react-router-dom';

// Screens
import Home from './screens/main/Home/Home';
import Survey from './screens/main/Survey/Survey';
import Login from './screens/main/Login/Login';
import Group from './screens/main/Group/Group';
import CreateGroup from './screens/main/Group/CreateGroup';
import Profile from './screens/main/Profile/Profile';
import Debug from './screens/misc/Debug/Debug';
import Topics from './screens/main/Topics/TopicList';

// Types
import { Session } from '@supabase/supabase-js';
import ContentList from './screens/main/Contents/ContentList';

function Router({
  session,
  getGroups,
}: {
  session: Session | null;
  getGroups: () => Promise<void>;
}) {
  return (
    <Routes>
      <Route path="/survey/:id" element={<Survey />} />
      <Route path="/login" element={<Login />} />
      <Route path="/group/:group_id" element={<Group getGroups={getGroups} />}>
        <Route path="/group/:group_id/topics" element={<Topics />} />
      </Route>
      <Route path="/contents" element={<ContentList />} />

      <Route path="/create" element={<CreateGroup getGroups={getGroups} />} />
      <Route path="/debug" element={<Debug session={session} />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/" element={<Home />} index />
      <Route path="*" element={<div>404</div>} />
    </Routes>
  );
}

export default Router;
