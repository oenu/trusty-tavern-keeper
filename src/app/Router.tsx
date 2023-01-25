import React from 'react';
import { Route, Routes } from 'react-router-dom';

// Screens
import Home from './screens/Home/Home';
import Survey from './screens/Survey/Survey';
import Login from './screens/Login/Login';

function Router() {
  return (
    <Routes>
      <Route path="/survey/:id" element={<Survey />} />
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<Home />} index />
      <Route path="*" element={<div>404</div>} />
    </Routes>
  );
}

export default Router;
