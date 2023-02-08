import React from 'react';
import { Route, Routes } from 'react-router-dom';

// Screens
import Home from './screens/Home/Home';
import Survey from './screens/Survey/Survey';
import Login from './screens/Login/Login';
import Group from './screens/Group/Group';
import CreateGroup from './screens/CreateGroup/CreateGroup';
import Profile from './screens/Profile/Profile';
import Debug from './screens/Debug/Debug';

// Types
import { Session } from '@supabase/supabase-js';

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
      <Route
        path="/group/:group_id"
        element={<Group getGroups={getGroups} />}
      />
      <Route path="/create" element={<CreateGroup getGroups={getGroups} />} />
      <Route path="/debug" element={<Debug session={session} />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/" element={<Home />} index />
      <Route path="*" element={<div>404</div>} />
    </Routes>
  );
}

export default Router;
