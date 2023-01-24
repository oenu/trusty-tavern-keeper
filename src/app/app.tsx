import styled from 'styled-components';
// import NxWelcome from './nx-welcome';

import { Routes, Route } from 'react-router-dom';
import Home from 'src/screens/Home/Home';
import Survey from 'src/screens/Survey/Survey';

const StyledApp = styled.div`
  // Your style here
`;

export function App() {
  return (
    <StyledApp>
      <Routes>
        <Route path="/survey/:id" element={<Survey />} />
        <Route path="/" element={<Home />} index />
        <Route path="*" element={<div>404</div>} />
      </Routes>

      {/* <NxWelcome title="trusty-tavern-keeper" /> */}
    </StyledApp>
  );
}

export default App;
