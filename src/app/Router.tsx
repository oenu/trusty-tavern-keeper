import React from 'react';
import { Route, Routes } from 'react-router-dom';

// Screens
import Home from 'src/screens/Home/Home';
import Survey from 'src/screens/Survey/Survey';
import Login from 'src/screens/Login/Login';

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
